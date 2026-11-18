// GitHub Pages serves the same 404 page for every missing address. On a Serbian
// address, show the Serbian text that the page carries in data-sr attributes.
(function () {
  if (!/^\/sr(\/|$)/.test(location.pathname)) return;
  var me = document.currentScript;
  document.documentElement.lang = 'sr-Latn';
  if (me && me.dataset.srTitle) document.title = me.dataset.srTitle;
  document.querySelectorAll('[data-nf]').forEach(function (el) { el.textContent = el.dataset.sr; });
  var link = document.querySelector('[data-nf-link]');
  if (link) link.setAttribute('href', '/sr/projects/');
})();
