// Site behaviour: scroll animations, nav state, gallery, contact form.
// Plain ES module with a stable URL, so pages cached by the browser always find it.

/**
 * Page behaviour. Runs on every `astro:page-load`, i.e. on the first load and
 * after each View Transitions navigation, so every init must be idempotent.
 */
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- Toast ---------- */
let toastTimer;
function toast(message, kind = 'ok') {
    const el = document.querySelector('[data-toast]');
    if (!el)
        return;
    el.textContent = message;
    el.dataset.kind = kind;
    el.classList.add('is-shown');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('is-shown'), 3200);
}
/* ---------- Header: active page indicator (header persists across pages) ---------- */
/* ---------- Language ---------- */
const MSG = {
    en: {
        copied: 'Copied!',
        copiedToast: (t) => `Copied ${t}`,
        copyFailed: (t) => `Couldn't copy. The address is ${t}`,
        required: 'Required.',
        badEmail: 'Enter a valid email address.',
        tooShort: 'Write at least 10 characters.',
        checkFields: 'Check the highlighted fields.',
        sent: 'Message sent. Thanks!',
        sendFailed: (to) => `Sending failed. Email me directly at ${to}.`,
    },
    sr: {
        copied: 'Kopirano!',
        copiedToast: (t) => `Kopirano: ${t}`,
        copyFailed: (t) => `Kopiranje nije uspelo. Adresa je ${t}`,
        required: 'Obavezno polje.',
        badEmail: 'Unesite ispravnu email adresu.',
        tooShort: 'Napišite bar 10 karaktera.',
        checkFields: 'Proverite označena polja.',
        sent: 'Poruka je poslata. Hvala!',
        sendFailed: (to) => `Slanje nije uspelo. Pišite mi direktno na ${to}.`,
    },
};
const lang = () => (document.documentElement.lang.startsWith('sr') ? 'sr' : 'en');
const msg = () => MSG[lang()];
/** The same page in the other language: /about/ <-> /sr/about/ */
function otherLangPath(path) {
    if (path === '/sr' || path === '/sr/') return '/';
    if (path.startsWith('/sr/')) return path.slice(3);
    return path === '/' ? '/sr/' : `/sr${path}`;
}

function updateNav() {
    const path = location.pathname;
    document.querySelectorAll('[data-lang-switch]').forEach((a) => {
        a.setAttribute('href', otherLangPath(path) + location.hash);
    });
    document.querySelectorAll('[data-mnav]').forEach((a) => {
        const m = a.dataset.mnav;
        const active = a.hasAttribute('data-exact') ? path === m : path.startsWith(m);
        if (active) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-nav]').forEach((a) => {
        const active = path.startsWith(a.dataset.nav);
        if (active)
            a.setAttribute('aria-current', 'page');
        else
            a.removeAttribute('aria-current');
    });
}
/* ---------- Mobile menu (below 768px) ---------- */
function setMenu(open) {
    const root = document.documentElement;
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    root.classList.toggle('menu-open', open);
    root.classList.toggle('menu-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) || '');
    menu.setAttribute('aria-hidden', String(!open));
    menu.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', open ? '0' : '-1'));
    if (open) setTimeout(() => menu.querySelector('a')?.focus({ preventScroll: true }), 350);
}
function initMobileMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu || toggle.dataset.bound) return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
    // Any link inside closes the menu; so does a tap on the empty area around the links.
    menu.addEventListener('click', (e) => {
        if (e.target.closest('a') || !e.target.closest('.mobile-menu-links, .mobile-menu-foot')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) {
            setMenu(false);
            toggle.focus();
        }
    });
    // Leaving the mobile breakpoint (rotating a tablet, resizing) closes it too.
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && setMenu(false));
    document.addEventListener('astro:before-swap', () => setMenu(false));
}

/* ---------- Split headings into words for the masked word-by-word reveal ---------- */
function splitHeadings() {
    const targets = document.querySelectorAll('main h1:not(.hs7-title):not([data-split]), main .sec-title:not([data-split]), main .text-h3:not([data-split])');
    targets.forEach((el) => {
        // Only plain-text, visible headings; leave ones with links, icons or hidden parents alone.
        if (el.children.length > 0 || el.closest('[hidden]'))
            return;
        const text = el.textContent?.trim() ?? '';
        if (!text)
            return;
        el.setAttribute('aria-label', text);
        el.innerHTML = text
            .split(/\s+/)
            .map((w, i) => `<span class="split-word" aria-hidden="true"><span class="split-inner" style="--w:${i}">${w}</span></span>`)
            .join(' ');
        el.setAttribute('data-split', '');
        el.removeAttribute('data-reveal');
        if (el.classList.contains('sec-title'))
            el.classList.add('draw-line');
    });
}
/* Long-form text and repeated blocks reveal one by one without hand-written attributes. */
function autoTag() {
    // Animate long-form text paragraph by paragraph instead of as one block.
    document.querySelectorAll('.prose-tech[data-reveal]').forEach((e) => e.removeAttribute('data-reveal'));
    const selectors = [
        '.prose-tech > *',
        '.principle',
        '.tech-group',
        '.tl-item',
        '.gallery figure',
        '.cta-band',
        '.facts-row',
    ];
    document.querySelectorAll(selectors.join(',')).forEach((el) => {
        if (!el.hasAttribute('data-reveal') && !el.closest('[data-reveal]:not(.prose-tech)')) {
            el.setAttribute('data-reveal', '');
        }
    });
    // Layer markers slide in from the left, their project lists from the right.
    document.querySelectorAll('[data-layer] .layer-marker').forEach((el) => el.setAttribute('data-reveal', 'left'));
}
/* ---------- Reading progress + hero parallax (one rAF-throttled scroll handler) ---------- */
let onScroll;
function initScrollEffects() {
    if (onScroll) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
    }
    const bar = document.querySelector('[data-progress]');
    const hero = document.querySelector('.hs7-section');
    const heroContent = hero?.querySelector('.hs7-content');
    const heroBg = hero?.querySelector('.hs7-bg img');
    let ticking = false;
    const update = () => {
        ticking = false;
        updateReveal();
        const max = document.documentElement.scrollHeight - innerHeight;
        bar?.style.setProperty('--progress', String(max > 0 ? Math.min(1, scrollY / max) : 0));
        if (hero && heroContent && !reduceMotion()) {
            const h = hero.offsetHeight;
            const p = Math.min(1, Math.max(0, scrollY / h));
            heroContent.style.transform = `translate3d(0, ${p * -60}px, 0)`;
            heroContent.style.opacity = String(1 - p * 1.3);
            if (heroBg)
                heroBg.style.transform = `translate3d(0, ${p * 90}px, 0) scale(${1 + p * 0.06})`;
        }
    };
    onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}
/* ---------- Scroll-linked reveal ----------
 * Each block gets --p from 0 (below the bottom edge) to 1 (fully in view), recomputed on
 * every scroll frame. Scrolling down raises --p and brings blocks in; scrolling up lowers it
 * and sends them back out through the bottom edge. Blocks above the fold stay at 1.
 */
let revealItems = [];
let revealResize;
function measureReveal() {
    const root = document.documentElement;
    root.classList.add('reveal-measuring');
    revealItems.forEach((it) => it.el.style.setProperty('--p', '1'));
    revealItems.forEach((it) => {
        const r = it.el.getBoundingClientRect();
        it.top = r.top + window.scrollY;
    });
    revealItems.forEach((it) => it.el.style.setProperty('--p', it.p.toFixed(3)));
    void document.body.offsetHeight;
    root.classList.remove('reveal-measuring');
}
function updateReveal() {
    const vh = window.innerHeight;
    const y = window.scrollY;
    const start = vh * 0.98; // a block starts arriving as its top crosses the bottom edge
    const range = Math.max(200, vh * 0.34); // ...and is fully in after this many pixels
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    for (const it of revealItems) {
        // Scroll positions where this block starts arriving and is fully in.
        let sStart = it.top + it.offset - start;
        let sFull = sStart + range;
        // Blocks near the end of a short page must still finish at the bottom of the scroll.
        if (sFull > maxScroll) {
            sFull = maxScroll;
            sStart = Math.min(sStart, maxScroll - range * 0.6);
        }
        let p = sFull <= sStart ? (y >= sFull ? 1 : 0) : (y - sStart) / (sFull - sStart);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (Math.abs(p - it.p) > 0.002) {
            it.p = p;
            it.el.style.setProperty('--p', p.toFixed(3));
        }
    }
}
function initReveal() {
    splitHeadings();
    autoTag();
    document.querySelectorAll('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
            child.setAttribute('data-reveal', child.getAttribute('data-reveal') ?? '');
            child.style.setProperty('--i', String(Math.min(i, 8)));
        });
    });
    const els = Array.from(document.querySelectorAll('[data-reveal], [data-split]'));
    if (reduceMotion()) {
        els.forEach((el) => el.style.setProperty('--p', '1'));
        revealItems = [];
        return;
    }
    revealItems = els.map((el) => ({
        el,
        top: 0,
        p: 0,
        // items in a staggered group arrive one after another
        offset: Number(el.style.getPropertyValue('--i') || 0) * 44,
    }));
    measureReveal();
    // Blocks already on screen ease in once on page load, then follow the scroll.
    const root = document.documentElement;
    root.classList.add('reveal-intro');
    requestAnimationFrame(() => {
        updateReveal();
        setTimeout(() => root.classList.remove('reveal-intro'), 1200);
    });
    // Re-measure when the layout changes (fonts, images, viewport size).
    revealResize?.disconnect();
    revealResize = new ResizeObserver(() => {
        measureReveal();
        updateReveal();
    });
    revealResize.observe(document.body);
}
/* ---------- Spotlight border on cards (follows the cursor) ---------- */
function initSpotlight() {
    document.querySelectorAll('[data-spotlight]').forEach((card) => {
        if (card.dataset.bound)
            return;
        card.dataset.bound = '1';
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}
/* ---------- Touch: show the hover look while a finger is on a card ---------- */
const TOUCH_TARGETS = '.card, .contact-card, .tech-item, .gallery button, [data-layer] .group';
let touchCard = null;
let touchTimer = 0;
let fadingCard = null;
const TOUCH_LINGER = 1200; // ms the look stays after the finger lifts (and after the scroll settles)
function placeSpot(card, t) {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${t.clientX - r.left}px`);
    card.style.setProperty('--my', `${t.clientY - r.top}px`);
}
function scheduleFade() {
    clearTimeout(touchTimer);
    const card = fadingCard;
    touchTimer = setTimeout(() => {
        if (card && card !== touchCard) card.classList.remove('is-touch-hover');
        if (fadingCard === card) fadingCard = null;
    }, TOUCH_LINGER);
}
function releaseTouchCard(e) {
    // Some browsers fire touchcancel as soon as a touch turns into a scroll;
    // keep the card lit while any finger is still down.
    if (e?.touches?.length) return;
    if (!touchCard) return;
    fadingCard = touchCard;
    touchCard = null;
    scheduleFade();
}
function initTouchHover() {
    if (document.documentElement.dataset.touchHover) return;
    document.documentElement.dataset.touchHover = '1';
    document.addEventListener('touchstart', (e) => {
        const card = e.target.closest?.(TOUCH_TARGETS);
        for (const old of [touchCard, fadingCard]) if (old && old !== card) old.classList.remove('is-touch-hover');
        fadingCard = null;
        clearTimeout(touchTimer);
        touchCard = card;
        if (!card) return;
        placeSpot(card, e.touches[0]);
        card.classList.add('is-touch-hover');
    }, { passive: true });
    document.addEventListener('touchmove', (e) => touchCard && placeSpot(touchCard, e.touches[0]), { passive: true });
    document.addEventListener('touchend', releaseTouchCard, { passive: true });
    document.addEventListener('touchcancel', releaseTouchCard, { passive: true });
    // While the page is still gliding after the finger lifts, keep the card lit.
    window.addEventListener('scroll', () => fadingCard && scheduleFade(), { passive: true });
    document.addEventListener('astro:before-swap', () => {
        touchCard?.classList.remove('is-touch-hover');
        fadingCard?.classList.remove('is-touch-hover');
        touchCard = fadingCard = null;
    });
}

/* ---------- Layer bands: highlight the band in the middle of the viewport ---------- */
let layerObserver;
function initLayerSpy() {
    layerObserver?.disconnect();
    const bands = document.querySelectorAll('[data-layer]');
    if (!bands.length)
        return;
    const setActive = (active) => bands.forEach((b) => b.classList.toggle('is-active', b === active));
    layerObserver = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target)), { rootMargin: '-45% 0px -55% 0px' });
    bands.forEach((b) => layerObserver.observe(b));
}
/* ---------- Gallery lightbox ---------- */
function initLightbox() {
    const dialog = document.querySelector('[data-lightbox]');
    if (!dialog || dialog.dataset.bound)
        return;
    dialog.dataset.bound = '1';
    const img = dialog.querySelector('img');
    const cap = dialog.querySelector('[data-lightbox-caption]');
    const counter = dialog.querySelector('[data-lightbox-count]');
    const all = Array.from(document.querySelectorAll('[data-gallery-item]'));
    // Each set (app screens, diagrams) is browsed on its own.
    const setOf = (el) => el.dataset.gallerySet ?? 'default';
    let items = [];
    let index = 0;
    const show = (i) => {
        index = (i + items.length) % items.length;
        const it = items[index];
        dialog.classList.toggle('is-portrait', it.hasAttribute('data-portrait'));
        img.src = it.dataset.full;
        img.alt = it.dataset.alt ?? '';
        cap.textContent = it.dataset.caption ?? '';
        counter.textContent = `${index + 1} / ${items.length}`;
        // Warm up the neighbours so arrows and swipes feel instant.
        [index - 1, index + 1].forEach((n) => {
            const nb = items[(n + items.length) % items.length];
            if (nb) new Image().src = nb.dataset.full;
        });
    };
    const open = (set, i) => {
        items = all.filter((el) => setOf(el) === set);
        if (!items.length)
            return;
        show(i);
        dialog.showModal();
    };
    all.forEach((it) => it.addEventListener('click', () => {
        const set = setOf(it);
        open(set, all.filter((el) => setOf(el) === set).indexOf(it));
    }));
    document.querySelectorAll('[data-gallery-open]').forEach((btn) => btn.addEventListener('click', () => open(btn.dataset.galleryOpen, 0)));
    dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index - 1));
    dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index + 1));
    dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog)
            dialog.close();
    });
    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')
            show(index - 1);
        if (e.key === 'ArrowRight')
            show(index + 1);
    });
    let startX = null;
    img.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    img.addEventListener('touchend', (e) => {
        if (startX === null)
            return;
        const dx = e.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(dx) > 40)
            show(dx < 0 ? index + 1 : index - 1);
    });
}
/* ---------- Copy email ---------- */
function initCopy() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
        if (btn.dataset.bound)
            return;
        btn.dataset.bound = '1';
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            const label = btn.querySelector('[data-copy-label]');
            try {
                await navigator.clipboard.writeText(text);
                if (label) {
                    const prev = label.textContent;
                    label.textContent = msg().copied;
                    btn.classList.add('is-copied');
                    setTimeout(() => {
                        label.textContent = prev;
                        btn.classList.remove('is-copied');
                    }, 1800);
                }
                toast(msg().copiedToast(text));
            }
            catch {
                toast(msg().copyFailed(text), 'error');
            }
        });
    });
}
/* ---------- Contact form ---------- */
function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form || form.dataset.bound)
        return;
    form.dataset.bound = '1';
    const key = form.dataset.key;
    const to = form.dataset.email;
    const submit = form.querySelector('button[type="submit"]');
    const success = document.querySelector('[data-form-success]');
    const fields = ['name', 'email', 'topic', 'message'];
    const validate = () => {
        let ok = true;
        for (const f of fields) {
            const input = form.elements.namedItem(f);
            const err = form.querySelector(`[data-error="${f}"]`);
            let msg = '';
            const v = input.value.trim();
            if (!v)
                msg = MSG[lang()].required;
            else if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                msg = MSG[lang()].badEmail;
            else if (f === 'message' && v.length < 10)
                msg = MSG[lang()].tooShort;
            if (err)
                err.textContent = msg;
            input.setAttribute('aria-invalid', msg ? 'true' : 'false');
            if (msg)
                ok = false;
        }
        return ok;
    };
    form.addEventListener('input', (e) => {
        const t = e.target;
        if (t.getAttribute('aria-invalid') === 'true')
            validate();
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast(msg().checkFields, 'error');
            return;
        }
        const data = Object.fromEntries(new FormData(form));
        if ((data.botcheck ?? '') !== '')
            return;
        submit.disabled = true;
        submit.dataset.state = 'sending';
        try {
            const subject = `Portfolio: ${data.topic} from ${data.name}`;
            // Web3Forms when an access key is configured; otherwise FormSubmit, which
            // relays to the site owner's address (confirmed once by the owner).
            const res = key
                ? await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({
                        access_key: key,
                        subject,
                        from_name: 'vidanstojic.me',
                        name: data.name,
                        email: data.email,
                        topic: data.topic,
                        message: data.message,
                    }),
                })
                : await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({
                        _subject: subject,
                        _replyto: data.email,
                        _template: 'table',
                        _captcha: 'false',
                        name: data.name,
                        email: data.email,
                        topic: data.topic,
                        message: data.message,
                    }),
                });
            const json = await res.json().catch(() => ({}));
            const failed = !res.ok || json.success === false || json.success === 'false';
            // FormSubmit's very first message asks the site owner to activate the form by
            // email. The message itself is kept and delivered after activation.
            const needsActivation = /activat/i.test(String(json.message ?? ''));
            if (failed && !needsActivation)
                throw new Error(json.message || res.statusText);
            form.reset();
            form.hidden = true;
            success?.removeAttribute('hidden');
            toast(msg().sent);
        }
        catch {
            toast(msg().sendFailed(to), 'error');
        }
        finally {
            submit.disabled = false;
            delete submit.dataset.state;
        }
    });
    document.querySelector('[data-form-again]')?.addEventListener('click', () => {
        success?.setAttribute('hidden', '');
        form.hidden = false;
    });
}
function initPage() {
    initMobileMenu();
    initTouchHover();
    setMenu(false);
    window.__vsReady = true;
    updateNav();
    initReveal();
    initScrollEffects();
    initSpotlight();
    initLayerSpy();
    initLightbox();
    initCopy();
    initContactForm();
}

// Run on first load, and again after every View Transitions navigation.
initPage();
document.addEventListener('astro:page-load', initPage);
