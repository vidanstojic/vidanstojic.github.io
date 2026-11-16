/**
 * Behaviour of the CV popup (CvDialog.astro). Events are delegated from the
 * document, so it keeps working after View Transitions swap the page.
 * The PDF code (pdf-lib) is loaded only when a custom CV is generated.
 */

let picked: string[] = [];
let layer = '';
const tags = new Set<string>();
let assets: Promise<Record<'regular' | 'bold' | 'light' | 'photo', ArrayBuffer>> | undefined;

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const dialog = () => $<HTMLDialogElement>('[data-cv-dialog]');

interface Texts {
  heading: string;
  buildHeading: string;
  none: string;
  count: string[];
  more: string;
  fewer: string;
  building: string;
  done: string;
  failed: string;
  download: string;
}
/** Interface text for the current page's language, rendered into the dialog. */
const text = (): Texts => JSON.parse($('[data-cv-text]', dialog() ?? document)?.textContent ?? '{}');

function showView(name: 'choose' | 'build') {
  const d = dialog();
  if (!d) return;
  $$<HTMLElement>('[data-cv-view]', d).forEach((v) => (v.hidden = v.dataset.cvView !== name));
  $<HTMLElement>('[data-cv-back]', d)!.hidden = name === 'choose';
  $<HTMLElement>('[data-cv-heading]', d)!.textContent = name === 'choose' ? text().heading : text().buildHeading;
  d.dataset.view = name;
  if (name === 'build' && matchMedia('(hover: hover)').matches) $<HTMLInputElement>('[data-cv-search]', d)?.focus();
}

function open() {
  const d = dialog();
  if (!d) return;
  showView('choose');
  sync();
  d.showModal();
  document.documentElement.classList.add('cv-locked');
}

function close() {
  const d = dialog();
  if (d?.open) d.close();
}

/** Applies search, layer and technology filters to the list. */
function filter() {
  const d = dialog();
  if (!d) return;
  const terms = ($<HTMLInputElement>('[data-cv-search]', d)?.value ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;
  $$<HTMLElement>('[data-cv-item]', d).forEach((li) => {
    const okLayer = !layer || li.dataset.layer === layer;
    const itemTags = (li.dataset.tags ?? '').split('|');
    const okTags = !tags.size || itemTags.some((t) => tags.has(t));
    const okText = terms.every((t) => (li.dataset.search ?? '').includes(t));
    const show = okLayer && okTags && okText;
    li.hidden = !show;
    if (show) shown++;
  });
  $<HTMLElement>('[data-cv-empty]', d)!.hidden = shown > 0;
}

/** Reflects the picked projects (and their order) in the list and the footer. */
function sync() {
  const d = dialog();
  if (!d) return;
  $$<HTMLElement>('[data-cv-item]', d).forEach((li) => {
    const id = li.dataset.cvItem!;
    const n = picked.indexOf(id);
    const box = $<HTMLInputElement>('input', li)!;
    box.checked = n >= 0;
    $<HTMLElement>('[data-cv-order]', li)!.textContent = n >= 0 ? String(n + 1) : '';
    li.classList.toggle('is-picked', n >= 0);
  });
  const count = picked.length;
  const T = text();
  $<HTMLElement>('[data-cv-count]', d)!.textContent = count
    ? T.count[Math.min(count, T.count.length) - 1].replace('{n}', String(count))
    : T.none;
  $<HTMLButtonElement>('[data-cv-generate]', d)!.disabled = count === 0;
  $$<HTMLButtonElement>('[data-cv-layer]', d).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cvLayer === layer)));
  $$<HTMLButtonElement>('[data-cv-tag]', d).forEach((b) => b.setAttribute('aria-pressed', String(tags.has(b.dataset.cvTag!))));
  filter();
}

function loadAssets() {
  const get = (url: string) =>
    fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.arrayBuffer();
    });
  assets ??= Promise.all([
    get('/cv/fonts/DejaVuSans.ttf'),
    get('/cv/fonts/DejaVuSans-Bold.ttf'),
    get('/cv/fonts/DejaVuSans-ExtraLight.ttf'),
    get('/cv/photo.jpg'),
  ]).then(([regular, bold, light, photo]) => ({ regular, bold, light, photo }));
  assets.catch(() => (assets = undefined));
  return assets;
}

async function generate(button: HTMLButtonElement) {
  const label = $<HTMLElement>('.btn-label', button)!;
  button.disabled = true;
  button.dataset.state = 'sending';
  const T = text();
  label.textContent = T.building;
  try {
    const [{ buildCvPdf }, { CV_PROJECTS }, files] = await Promise.all([
      import('../lib/cv/pdf'),
      import('../lib/cv/data'),
      loadAssets(),
    ]);
    const bytes = await buildCvPdf(
      picked.map((id) => CV_PROJECTS[id]).filter(Boolean),
      files,
    );
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'Vidan_Stojic_CV.pdf' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    label.textContent = T.done;
    setTimeout(() => (label.textContent = T.download), 2200);
  } catch (err) {
    console.error(err);
    label.textContent = T.failed;
  } finally {
    delete button.dataset.state;
    button.disabled = picked.length === 0;
  }
}

function onClick(e: MouseEvent) {
  const t = e.target as Element | null;
  if (!t) return;
  if (t.closest('[data-cv-open]')) {
    e.preventDefault();
    open();
    return;
  }
  const d = dialog();
  if (!d?.open || !d.contains(t)) return;
  // A click on the backdrop lands on the <dialog> itself.
  if (t === d) return close();
  if (t.closest('[data-cv-close]')) return close();
  if (t.closest('[data-cv-build]')) return showView('build');
  if (t.closest('[data-cv-back]')) return showView('choose');
  if (t.closest('[data-cv-default]')) return void setTimeout(close, 300);
  const layerBtn = t.closest<HTMLElement>('[data-cv-layer]');
  if (layerBtn) {
    layer = layerBtn.dataset.cvLayer ?? '';
    return sync();
  }
  const tagBtn = t.closest<HTMLElement>('[data-cv-tag]');
  if (tagBtn) {
    const tag = tagBtn.dataset.cvTag!;
    if (tags.has(tag)) tags.delete(tag);
    else tags.add(tag);
    return sync();
  }
  const more = t.closest<HTMLButtonElement>('[data-cv-more]');
  if (more) {
    const box = more.parentElement!;
    const expanded = box.classList.toggle('is-expanded');
    more.setAttribute('aria-expanded', String(expanded));
    more.textContent = expanded ? text().fewer : text().more.replace('{n}', String($$('[data-cv-tag]', box).length - 12));
    return;
  }
  if (t.closest('[data-cv-clear]')) {
    picked = [];
    return sync();
  }
  if (t.closest('[data-cv-preset]')) {
    picked = JSON.parse($('[data-cv-defaults]', d)?.textContent ?? '[]');
    return sync();
  }
  const gen = t.closest<HTMLButtonElement>('[data-cv-generate]');
  if (gen && !gen.disabled) void generate(gen);
}

function onChange(e: Event) {
  const box = e.target as HTMLInputElement;
  if (!box.matches?.('[data-cv-item] input[type="checkbox"]')) return;
  picked = box.checked ? [...picked.filter((id) => id !== box.value), box.value] : picked.filter((id) => id !== box.value);
  sync();
}

export function initCvDialog() {
  if (document.documentElement.dataset.cvBound) return;
  document.documentElement.dataset.cvBound = '1';
  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  document.addEventListener('input', (e) => {
    if ((e.target as Element).matches?.('[data-cv-search]')) filter();
  });
  // The dialog element is replaced on navigation, so its close event is caught on the document.
  document.addEventListener(
    'close',
    (e) => {
      if ((e.target as Element).matches?.('[data-cv-dialog]')) document.documentElement.classList.remove('cv-locked');
    },
    true,
  );
  document.addEventListener('astro:before-swap', close);
  // Warm up the fonts once the builder is opened, so the PDF is ready faster.
  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest?.('[data-cv-build]')) void loadAssets();
  });
}
