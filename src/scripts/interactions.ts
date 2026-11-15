/**
 * Page behaviour. Runs on every `astro:page-load`, i.e. on the first load and
 * after each View Transitions navigation, so every init must be idempotent.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Toast ---------- */
let toastTimer: number | undefined;
export function toast(message: string, kind: 'ok' | 'error' = 'ok') {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
  el.classList.add('is-shown');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-shown'), 3200);
}

/* ---------- Header: active page indicator (header persists across pages) ---------- */
function updateNav() {
  const path = location.pathname;
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
    const active = path.startsWith(a.dataset.nav!);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ---------- Scroll reveal with stagger ---------- */
let revealObserver: IntersectionObserver | undefined;
function initReveal() {
  revealObserver?.disconnect();
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      const c = child as HTMLElement;
      c.setAttribute('data-reveal', '');
      c.style.setProperty('--i', String(Math.min(i, 8)));
    });
  });
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => revealObserver!.observe(el));
}

/* ---------- Spotlight border on cards (follows the cursor) ---------- */
function initSpotlight() {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    if (card.dataset.bound) return;
    card.dataset.bound = '1';
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Layer bands: highlight the band in the middle of the viewport ---------- */
let layerObserver: IntersectionObserver | undefined;
function initLayerSpy() {
  layerObserver?.disconnect();
  const bands = document.querySelectorAll<HTMLElement>('[data-layer]');
  if (!bands.length) return;
  const setActive = (active: Element) =>
    bands.forEach((b) => b.classList.toggle('is-active', b === active));
  layerObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target)),
    { rootMargin: '-45% 0px -55% 0px' },
  );
  bands.forEach((b) => layerObserver!.observe(b));
}

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dialog || dialog.dataset.bound) return;
  dialog.dataset.bound = '1';
  const img = dialog.querySelector<HTMLImageElement>('img')!;
  const cap = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-count]')!;
  const items = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-gallery-item]'));
  let index = 0;
  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const it = items[index];
    img.src = it.dataset.full!;
    img.alt = it.dataset.alt ?? '';
    cap.textContent = it.dataset.caption ?? '';
    counter.textContent = `${index + 1} / ${items.length}`;
  };
  items.forEach((it, i) =>
    it.addEventListener('click', () => {
      show(i);
      dialog.showModal();
    }),
  );
  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

/* ---------- Copy email ---------- */
function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy!;
      const label = btn.querySelector<HTMLElement>('[data-copy-label]');
      try {
        await navigator.clipboard.writeText(text);
        if (label) {
          const prev = label.textContent;
          label.textContent = 'Copied!';
          btn.classList.add('is-copied');
          setTimeout(() => {
            label.textContent = prev;
            btn.classList.remove('is-copied');
          }, 1800);
        }
        toast(`Copied ${text}`);
      } catch {
        toast(`Couldn't copy. The address is ${text}`, 'error');
      }
    });
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  const key = form.dataset.key;
  const to = form.dataset.email!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const success = document.querySelector<HTMLElement>('[data-form-success]');

  const fields = ['name', 'email', 'topic', 'message'] as const;
  const validate = () => {
    let ok = true;
    for (const f of fields) {
      const input = form.elements.namedItem(f) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const err = form.querySelector<HTMLElement>(`[data-error="${f}"]`);
      let msg = '';
      const v = input.value.trim();
      if (!v) msg = 'Required.';
      else if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email address.';
      else if (f === 'message' && v.length < 10) msg = 'Write at least 10 characters.';
      if (err) err.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) ok = false;
    }
    return ok;
  };
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    if (t.getAttribute('aria-invalid') === 'true') validate();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast('Check the highlighted fields.', 'error');
      return;
    }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if ((data.botcheck ?? '') !== '') return;

    if (!key) {
      // No form service configured yet: hand the message to the visitor's email app.
      const body = `${data.message}\n\n${data.name}\n${data.email}`;
      location.href = `mailto:${to}?subject=${encodeURIComponent(`[${data.topic}] from ${data.name}`)}&body=${encodeURIComponent(body)}`;
      toast('Opening your email app…');
      return;
    }

    submit.disabled = true;
    submit.dataset.state = 'sending';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `Portfolio: ${data.topic} from ${data.name}`,
          from_name: 'vidanstojic.me',
          name: data.name,
          email: data.email,
          topic: data.topic,
          message: data.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.statusText);
      form.reset();
      form.hidden = true;
      success?.removeAttribute('hidden');
      toast('Message sent. Thanks!');
    } catch {
      toast(`Sending failed. Email me directly at ${to}.`, 'error');
    } finally {
      submit.disabled = false;
      delete submit.dataset.state;
    }
  });

  document.querySelector('[data-form-again]')?.addEventListener('click', () => {
    success?.setAttribute('hidden', '');
    form.hidden = false;
  });
}

export function initPage() {
  updateNav();
  initReveal();
  initSpotlight();
  initLayerSpy();
  initLightbox();
  initCopy();
  initContactForm();
}
