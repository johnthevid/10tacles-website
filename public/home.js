// Menu category switching. Without JavaScript every category stays visible and the
// chips work as plain anchor links, so the full menu is always reachable.
(() => {
  const nav = document.querySelector('.menu-cats');
  const panels = [...document.querySelectorAll('[data-cat-panel]')];
  if (!nav || !panels.length) return;
  const links = [...nav.querySelectorAll('a[data-cat]')];
  const menuHead = document.querySelector('.menu-head');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
  links.forEach((a) => a.setAttribute('aria-controls', 'cat-' + a.dataset.cat));

  function show(id, { focusPanel = false, scroll = false } = {}) {
    if (!panels.some((p) => p.dataset.catPanel === id)) id = panels[0].dataset.catPanel;
    panels.forEach((p) => {
      const on = p.dataset.catPanel === id;
      p.hidden = !on;
      p.classList.toggle('is-entering', on && !reduce.matches);
    });
    links.forEach((a) => {
      const on = a.dataset.cat === id;
      a.setAttribute('aria-current', on ? 'true' : 'false');
      if (on && nav.scrollWidth > nav.clientWidth) {
        const left = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
        nav.scrollTo({ left, behavior: reduce.matches ? 'auto' : 'smooth' });
      }
    });
    if (scroll && menuHead) {
      const navTop = nav.getBoundingClientRect().top;
      const stuck = navTop <= parseFloat(getComputedStyle(nav).top) + 1;
      if (stuck) menuHead.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    }
    if (focusPanel) {
      const heading = document.getElementById('cat-' + id)?.querySelector('h3');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  }

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cat]');
    if (!a) return;
    e.preventDefault();
    show(a.dataset.cat, { scroll: true, focusPanel: e.detail === 0 });
    history.replaceState(null, '', '#cat-' + a.dataset.cat);
  });

  // Links elsewhere on the page (the sharing picks) open their category and bring the menu into view.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#cat-"]');
    if (!a || nav.contains(a)) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(5);
    show(id, { focusPanel: e.detail === 0 });
    history.replaceState(null, '', '#cat-' + id);
    menuHead.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  });

  const fromHash = () => (location.hash.startsWith('#cat-') ? location.hash.slice(5) : null);
  const initial = fromHash();
  show(initial || 'signature');
  if (initial && menuHead) requestAnimationFrame(() => menuHead.scrollIntoView({ block: 'start' }));
  addEventListener('hashchange', () => { const id = fromHash(); if (id) show(id); });
})();
