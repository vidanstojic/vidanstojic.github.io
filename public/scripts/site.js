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
function updateNav() {
    const path = location.pathname;
    document.querySelectorAll('[data-nav]').forEach((a) => {
        const active = path.startsWith(a.dataset.nav);
        if (active)
            a.setAttribute('aria-current', 'page');
        else
            a.removeAttribute('aria-current');
    });
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
    if (onScroll)
        window.removeEventListener('scroll', onScroll);
    const bar = document.querySelector('[data-progress]');
    const hero = document.querySelector('.hs7-section');
    const heroContent = hero?.querySelector('.hs7-content');
    const heroBg = hero?.querySelector('.hs7-bg img');
    let ticking = false;
    const update = () => {
        ticking = false;
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
    update();
}
/* ---------- Scroll reveal with stagger ---------- */
let revealObserver;
function initReveal() {
    revealObserver?.disconnect();
    splitHeadings();
    autoTag();
    document.querySelectorAll('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
            const c = child;
            c.setAttribute('data-reveal', '');
            c.style.setProperty('--i', String(Math.min(i, 8)));
        });
    });
    const items = document.querySelectorAll('[data-reveal], [data-split]');
    if (reduceMotion() || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    // Two-way reveal: a block animates in when it enters from below (scrolling down)
    // and animates out again when it drops back below the fold (scrolling up), so it
    // replays the next time the visitor scrolls down. Blocks that leave through the
    // top stay visible, so scrolling back up never shows empty space above.
    revealObserver = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
            }
            else if (e.boundingClientRect.top > 0) {
                e.target.classList.remove('is-visible');
            }
        }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    items.forEach((el) => revealObserver.observe(el));
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
    const items = Array.from(document.querySelectorAll('[data-gallery-item]'));
    let index = 0;
    const show = (i) => {
        index = (i + items.length) % items.length;
        const it = items[index];
        img.src = it.dataset.full;
        img.alt = it.dataset.alt ?? '';
        cap.textContent = it.dataset.caption ?? '';
        counter.textContent = `${index + 1} / ${items.length}`;
    };
    items.forEach((it, i) => it.addEventListener('click', () => {
        show(i);
        dialog.showModal();
    }));
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
                    label.textContent = 'Copied!';
                    btn.classList.add('is-copied');
                    setTimeout(() => {
                        label.textContent = prev;
                        btn.classList.remove('is-copied');
                    }, 1800);
                }
                toast(`Copied ${text}`);
            }
            catch {
                toast(`Couldn't copy. The address is ${text}`, 'error');
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
                msg = 'Required.';
            else if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                msg = 'Enter a valid email address.';
            else if (f === 'message' && v.length < 10)
                msg = 'Write at least 10 characters.';
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
            toast('Check the highlighted fields.', 'error');
            return;
        }
        const data = Object.fromEntries(new FormData(form));
        if ((data.botcheck ?? '') !== '')
            return;
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
            if (!res.ok || json.success === false)
                throw new Error(json.message || res.statusText);
            form.reset();
            form.hidden = true;
            success?.removeAttribute('hidden');
            toast('Message sent. Thanks!');
        }
        catch {
            toast(`Sending failed. Email me directly at ${to}.`, 'error');
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
