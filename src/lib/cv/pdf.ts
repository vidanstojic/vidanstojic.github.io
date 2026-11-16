/**
 * Builds the CV as a real (text, not image) A4 PDF in the layout of Vidan's CV
 * template: grey sidebar with a round photo and dark pill headings on the left,
 * name and ruled sections on the right.
 *
 * Runs both in the browser (custom CV) and in Node at build time (default CV),
 * so it takes font and photo bytes as input instead of loading them itself.
 *
 * Layout is done in "template units" (the measurements of the original CV) and
 * scaled by `k` to the page. The CV is fitted to one page when the text stays
 * readable; longer selections flow onto a second page.
 */
import {
  PDFDocument,
  PDFString,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  moveTo,
  lineTo,
  appendBezierCurve,
  closePath,
  clip,
  endPath,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { CV_PERSON, type CvLabelled, type CvProject } from './data';

export interface CvAssets {
  regular: Uint8Array | ArrayBuffer;
  bold: Uint8Array | ArrayBuffer;
  light: Uint8Array | ArrayBuffer;
  photo: Uint8Array | ArrayBuffer;
}

type FontKey = 'r' | 'b' | 'l';
type Color = [number, number, number];

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const INK: Color = [0.169, 0.169, 0.169];
const SUBTLE: Color = [0.267, 0.267, 0.267];
const SIDEBAR_BG: Color = [0.945, 0.945, 0.945];
const PILL: Color = [0.235, 0.235, 0.235];
const WHITE: Color = [1, 1, 1];

/** Largest scale first; the first one that fits on a single page wins. */
const FIT_SCALES = [1.3, 1.25, 1.2, 1.15, 1.1];
const FLOW_SCALE = 1.25;

type Op =
  | { t: 'text'; x: number; top: number; size: number; font: FontKey; color: Color; text: string; spacing?: number }
  | { t: 'rect'; x: number; top: number; w: number; h: number; color: Color }
  | { t: 'pill'; x: number; top: number; w: number; h: number; color: Color }
  | { t: 'diamond'; cx: number; cy: number; r: number; color: Color }
  | { t: 'link'; x: number; top: number; w: number; h: number; url: string }
  | { t: 'photo'; cx: number; cy: number; r: number };

interface Word {
  text: string;
  font: FontKey;
}

class Measure {
  constructor(private fonts: Record<FontKey, PDFFont>) {}
  width(text: string, font: FontKey, size: number): number {
    return this.fonts[font].widthOfTextAtSize(text, size);
  }

  /** Character wrap for a single line of small print (long URLs), as in the template. */
  wrapChars(text: string, font: FontKey, size: number, maxW: number): Word[][] {
    const lines: Word[][] = [];
    let chunk = '';
    for (const ch of text) {
      if (chunk && this.width(chunk + ch, font, size) > maxW) {
        lines.push([{ text: chunk, font }]);
        chunk = ch === ' ' ? '' : ch;
        continue;
      }
      chunk += ch;
    }
    if (chunk) lines.push([{ text: chunk, font }]);
    return lines;
  }

  /** Greedy word wrap; words longer than a line (URLs) are broken by characters. */
  wrap(words: Word[], size: number, maxW: number): Word[][] {
    const space = this.width(' ', 'r', size);
    const lines: Word[][] = [];
    let line: Word[] = [];
    let lineW = 0;
    const push = () => {
      if (line.length) lines.push(line);
      line = [];
      lineW = 0;
    };
    for (const word of words) {
      let w = this.width(word.text, word.font, size);
      if (w > maxW) {
        push();
        let chunk = '';
        for (const ch of word.text) {
          if (this.width(chunk + ch, word.font, size) > maxW) {
            lines.push([{ text: chunk, font: word.font }]);
            chunk = '';
          }
          chunk += ch;
        }
        line = [{ text: chunk, font: word.font }];
        lineW = this.width(chunk, word.font, size);
        continue;
      }
      const needed = line.length ? lineW + space + w : w;
      if (needed > maxW && line.length) {
        push();
        w = this.width(word.text, word.font, size);
      }
      lineW = line.length ? lineW + space + w : w;
      line.push(word);
    }
    push();
    return lines;
  }
}

const words = (text: string, font: FontKey): Word[] =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ({ text: t, font }));

/** Lays out the whole CV at scale k. Coordinates are template units, top-down. */
function layout(projects: CvProject[], m: Measure, k: number) {
  const W = PAGE_W / k;
  const H = PAGE_H / k;
  const sideW = W * 0.33;
  const pillX = 12.7;
  const pillW = sideW - 2 * pillX;
  const x0 = sideW + 15;
  const x1 = W - 17.5;
  const mainW = x1 - x0;
  const bottom = H - 22;
  const pages: Op[][] = [[]];
  let page = 0;
  const emit = (op: Op) => pages[page].push(op);

  // ---------- Sidebar (first page) ----------
  emit({ t: 'photo', cx: sideW / 2, cy: 54, r: 37.3 });
  let sy = 103.7;
  const pill = (title: string) => {
    emit({ t: 'pill', x: pillX, top: sy, w: pillW, h: 17.3, color: PILL });
    const size = 6.34;
    const spacing = 0.55;
    const tw = m.width(title, 'b', size) + spacing * (title.length - 1);
    emit({ t: 'text', x: pillX + (pillW - tw) / 2, top: sy + 6.1, size, font: 'b', color: WHITE, text: title, spacing });
    sy += 26.2;
  };
  const sideLines = (ws: Word[], color: Color = INK, lineH = 8.6) => {
    const lines = m.wrap(ws, 5.76, pillW);
    lines.forEach((ln, i) => drawLine(ln, pillX, sy + i * lineH, 5.76, color));
    sy += (lines.length - 1) * lineH;
  };
  const drawLine = (ln: Word[], x: number, top: number, size: number, color: Color) => {
    // Runs of the same font are drawn together.
    let cx = x;
    let run: Word[] = [];
    const flush = () => {
      if (!run.length) return;
      const text = run.map((w) => w.text).join(' ');
      emit({ t: 'text', x: cx, top, size, font: run[0].font, color, text });
      cx += m.width(text, run[0].font, size) + m.width(' ', 'r', size);
      run = [];
    };
    for (const w of ln) {
      if (run.length && run[0].font !== w.font) flush();
      run.push(w);
    }
    flush();
  };

  pill('PERSONAL DETAILS');
  CV_PERSON.details.forEach((d, i) => {
    sideLines(words(d, 'r'));
    sy += i < CV_PERSON.details.length - 1 ? 14.4 : 17.1;
  });

  pill('EDUCATION');
  CV_PERSON.education.forEach((e, i) => {
    sideLines(words(e.title, 'b'));
    sy += 9.3;
    e.lines.forEach((l, j) => {
      sideLines(words(l, 'r'), SUBTLE);
      if (j < e.lines.length - 1) sy += 9.8;
    });
    sy += i < CV_PERSON.education.length - 1 ? 12.1 : 17.1;
  });

  const labelled = (items: CvLabelled[], urlOnNextLine: boolean) =>
    items.forEach((it, i) => {
      if (urlOnNextLine) {
        sideLines(words(it.label, 'b'));
        sy += 8.6;
        const before = sy;
        sideLines(words(it.text, 'r'));
        emit({ t: 'link', x: pillX, top: before - 1, w: pillW, h: sy - before + 8, url: it.text });
      } else {
        sideLines([...words(it.label, 'b'), ...words(it.text, 'r')]);
      }
      sy += i < items.length - 1 ? (urlOnNextLine ? 14.3 : 12.7) : 17.1;
    });

  pill('SKILLS');
  labelled(CV_PERSON.skills, false);

  pill('FOREIGN LANGUAGE');
  CV_PERSON.languages.forEach((l, i) => {
    sideLines(words(l, 'r'));
    sy += i < CV_PERSON.languages.length - 1 ? 12.7 : 17.1;
  });

  pill('LINKS');
  labelled(CV_PERSON.links, true);
  const sidebarBottom = sy;

  // ---------- Main column ----------
  let y = 19.1;
  emit({ t: 'text', x: x0, top: y, size: 17.29, font: 'l', color: INK, text: CV_PERSON.firstName });
  emit({ t: 'text', x: x0, top: 38.1, size: 17.29, font: 'b', color: INK, text: CV_PERSON.lastName });
  emit({ t: 'rect', x: x0, top: 57.6, w: mainW, h: 1.2, color: INK });
  y = 69.5;

  const newPage = () => {
    pages.push([]);
    page++;
    y = 26;
  };
  const ensure = (h: number) => {
    if (y + h > bottom) newPage();
  };

  /** Justified paragraph (last line ragged). Returns the top of the last line. */
  const paragraph = (text: string, size = 5.76, lineH = 8.65, measureOnly = false) => {
    const lines = m.wrap(words(text, 'r'), size, mainW);
    if (measureOnly) return lines.length;
    const space = m.width(' ', 'r', size);
    lines.forEach((ln, i) => {
      ensure(lineH);
      const last = i === lines.length - 1;
      if (last || ln.length === 1) {
        emit({ t: 'text', x: x0, top: y, size, font: 'r', color: INK, text: ln.map((w) => w.text).join(' ') });
      } else {
        const natural = ln.reduce((s, w) => s + m.width(w.text, 'r', size), 0);
        const gap = (mainW - natural) / (ln.length - 1);
        let cx = x0;
        for (const w of ln) {
          emit({ t: 'text', x: cx, top: y, size, font: 'r', color: INK, text: w.text });
          cx += m.width(w.text, 'r', size) + Math.max(gap, space * 0.8);
        }
      }
      if (!last) y += lineH;
    });
    return lines.length;
  };

  const ruledTitle = (title: string) => {
    ensure(40);
    emit({ t: 'text', x: x0, top: y, size: 8.64, font: 'b', color: INK, text: title });
    emit({ t: 'rect', x: x0, top: y + 12.3, w: mainW, h: 1.2, color: INK });
  };

  // About me
  ruledTitle('ABOUT ME');
  y += 17.7;
  paragraph(CV_PERSON.about);
  y += 18.5;

  // Projects
  if (projects.length) {
    ruledTitle('PROJECTS');
    y += 22.6;
    projects.forEach((p, i) => {
      const head = m.wrap(words(p.heading, 'b'), 6.92, mainW);
      const bodyLines = paragraph(p.body, 5.76, 8.65, true);
      const foot = p.footer ? m.wrapChars(p.footer, 'r', 5.19, mainW) : [];
      const height = (head.length - 1) * 10.3 + 11.9 + (bodyLines - 1) * 8.65 + (foot.length ? 9.7 + (foot.length - 1) * 7.5 : 0) + 9;
      ensure(Math.min(height, (head.length - 1) * 10.3 + 11.9 + 3 * 8.65));
      head.forEach((ln, j) => {
        emit({ t: 'text', x: x0, top: y, size: 6.92, font: 'b', color: INK, text: ln.map((w) => w.text).join(' ') });
        if (j < head.length - 1) y += 10.3;
      });
      y += 11.9;
      paragraph(p.body);
      if (foot.length) {
        y += 9.7;
        ensure(foot.length * 7.5);
        const start = y;
        foot.forEach((ln, j) => {
          emit({ t: 'text', x: x0, top: y, size: 5.19, font: 'r', color: INK, text: ln.map((w) => w.text).join(' ') });
          if (j < foot.length - 1) y += 7.5;
        });
        if (p.link) emit({ t: 'link', x: x0, top: start - 1, w: mainW, h: y - start + 7.5, url: p.link });
      }
      y += i < projects.length - 1 ? 15.5 : 18;
    });
  }

  // Experience and interests (no rule, as in the template)
  const bullets = (items: string[]) =>
    items.forEach((b, i) => {
      const lines = m.wrap(words(b, 'r'), 5.76, mainW - 10.4);
      ensure(lines.length * 8.7);
      emit({ t: 'diamond', cx: x0 + 3.75, cy: y + 2.95, r: 1.05, color: INK });
      lines.forEach((ln, j) => {
        emit({ t: 'text', x: x0 + 10.4, top: y, size: 5.76, font: 'r', color: INK, text: ln.map((w) => w.text).join(' ') });
        if (j < lines.length - 1) y += 8.7;
      });
      if (i < items.length - 1) y += 9.8;
    });

  ensure(50);
  emit({ t: 'text', x: x0, top: y, size: 8.07, font: 'b', color: INK, text: 'EXPERIENCE' });
  y += 16.3;
  emit({ t: 'text', x: x0, top: y, size: 6.34, font: 'b', color: INK, text: CV_PERSON.experience.title });
  y += 10.8;
  bullets(CV_PERSON.experience.bullets);
  y += 18.4;
  ensure(40);
  emit({ t: 'text', x: x0, top: y, size: 8.07, font: 'b', color: INK, text: 'Additional Activities and Interests' });
  y += 12.7;
  bullets(CV_PERSON.interests);

  return { pages, sideW, sidebarFits: sidebarBottom < bottom };
}

/** Rounded rectangle with fully round ends, as path operators (PDF coordinates). */
function pillPath(x: number, y: number, w: number, h: number) {
  const r = h / 2;
  const c = r * 0.5523;
  return [
    moveTo(x + r, y),
    lineTo(x + w - r, y),
    appendBezierCurve(x + w - r + c, y, x + w, y + r - c, x + w, y + r),
    appendBezierCurve(x + w, y + r + c, x + w - r + c, y + h, x + w - r, y + h),
    lineTo(x + r, y + h),
    appendBezierCurve(x + r - c, y + h, x, y + r + c, x, y + r),
    appendBezierCurve(x, y + r - c, x + r - c, y, x + r, y),
    closePath(),
  ];
}

function circlePath(cx: number, cy: number, r: number) {
  const c = r * 0.5523;
  return [
    moveTo(cx + r, cy),
    appendBezierCurve(cx + r, cy + c, cx + c, cy + r, cx, cy + r),
    appendBezierCurve(cx - c, cy + r, cx - r, cy + c, cx - r, cy),
    appendBezierCurve(cx - r, cy - c, cx - c, cy - r, cx, cy - r),
    appendBezierCurve(cx + c, cy - r, cx + r, cy - c, cx + r, cy),
    closePath(),
  ];
}

function render(doc: PDFDocument, pages: Op[][], sideW: number, k: number, fonts: Record<FontKey, PDFFont>, photo: PDFImage) {
  const X = (v: number) => v * k;
  for (const ops of pages) {
    const page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: X(sideW), height: PAGE_H, color: rgb(...SIDEBAR_BG) });
    for (const op of ops) {
      switch (op.t) {
        case 'text': {
          // pdfplumber "top" is the top of the em box; the baseline sits ~0.76 em below it.
          const baseline = PAGE_H - X(op.top + op.size * 0.76);
          if (op.spacing) {
            let cx = X(op.x);
            for (const ch of op.text) {
              page.drawText(ch, { x: cx, y: baseline, size: X(op.size), font: fonts[op.font], color: rgb(...op.color) });
              cx += fonts[op.font].widthOfTextAtSize(ch, X(op.size)) + X(op.spacing);
            }
          } else {
            page.drawText(op.text, { x: X(op.x), y: baseline, size: X(op.size), font: fonts[op.font], color: rgb(...op.color) });
          }
          break;
        }
        case 'rect':
          page.drawRectangle({ x: X(op.x), y: PAGE_H - X(op.top + op.h), width: X(op.w), height: X(op.h), color: rgb(...op.color) });
          break;
        case 'pill': {
          const y = PAGE_H - X(op.top + op.h);
          page.pushOperators(pushGraphicsState(), ...pillPath(X(op.x), y, X(op.w), X(op.h)), clip(), endPath());
          page.drawRectangle({ x: X(op.x), y, width: X(op.w), height: X(op.h), color: rgb(...op.color) });
          page.pushOperators(popGraphicsState());
          break;
        }
        case 'diamond': {
          const cx = X(op.cx);
          const cy = PAGE_H - X(op.cy);
          const r = X(op.r);
          page.drawSvgPath(`M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`, { x: cx, y: cy, color: rgb(...op.color) });
          break;
        }
        case 'photo': {
          const cx = X(op.cx);
          const cy = PAGE_H - X(op.cy);
          const r = X(op.r);
          page.pushOperators(pushGraphicsState(), ...circlePath(cx, cy, r), clip(), endPath());
          page.drawImage(photo, { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r });
          page.pushOperators(popGraphicsState());
          break;
        }
        case 'link': {
          const annot = doc.context.register(
            doc.context.obj({
              Type: 'Annot',
              Subtype: 'Link',
              Rect: [X(op.x), PAGE_H - X(op.top + op.h), X(op.x + op.w), PAGE_H - X(op.top)],
              Border: [0, 0, 0],
              A: { Type: 'Action', S: 'URI', URI: PDFString.of(op.url) },
            }),
          );
          page.node.addAnnot(annot);
          break;
        }
      }
    }
  }
}

export async function buildCvPdf(projects: CvProject[], assets: CvAssets): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts: Record<FontKey, PDFFont> = {
    r: await doc.embedFont(assets.regular, { subset: true }),
    b: await doc.embedFont(assets.bold, { subset: true }),
    l: await doc.embedFont(assets.light, { subset: true }),
  };
  const photo = await doc.embedJpg(assets.photo);
  const m = new Measure(fonts);

  // Fewest pages first, then the largest (most readable) scale for that page count.
  const tries = FIT_SCALES.map((k) => ({ k, ...layout(projects, m, k) })).filter((l) => l.sidebarFits);
  const fewest = Math.min(...tries.map((l) => l.pages.length));
  const chosen =
    fewest === 1
      ? tries.find((l) => l.pages.length === 1)!
      : (tries.find((l) => l.k <= FLOW_SCALE && l.pages.length === fewest) ?? tries.find((l) => l.pages.length === fewest)!);
  render(doc, chosen.pages, chosen.sideW, chosen.k, fonts, photo);

  doc.setTitle(`${CV_PERSON.firstName} ${CV_PERSON.lastName} — CV`);
  doc.setAuthor(`${CV_PERSON.firstName} ${CV_PERSON.lastName}`);
  doc.setSubject('Curriculum vitae');
  doc.setCreator('vidanstojic.me');
  doc.setProducer('vidanstojic.me');
  doc.setLanguage('en');
  return doc.save();
}
