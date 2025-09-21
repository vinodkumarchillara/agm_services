/* index.mobile.js
   Injects a mobile hamburger toggle only on small screens (<=767px).
   - toggles body.mobile-menu-active
   - toggles dropdown .show-me classes for submenus
   - removes itself/cleanup on resize to desktop
*/

(function(){
  if (window.__AGM_MOBILE_INIT) return;
  window.__AGM_MOBILE_INIT = true;

  const MAX = 767;

  function isMobile(){ return window.innerWidth <= MAX; }

  function makeToggle(){
    let t = document.getElementById('agmMenuToggle');
    if (t) return t;
    t = document.createElement('button');
    t.id = 'agmMenuToggle';
    t.className = 'menu-toggle';
    t.type = 'button';
    t.setAttribute('aria-label', 'Toggle menu');
    t.setAttribute('aria-expanded', 'false');
    t.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    return t;
  }

  function insertToggle(){
    if (!isMobile()) { removeToggle(); return; }
    if (document.getElementById('agmMenuToggle')) return;
    const toggle = makeToggle();
    const header = document.querySelector('header') || document.body;
    const logo = header.querySelector('.logo');
    if (logo && logo.parentNode) logo.parentNode.insertBefore(toggle, logo.nextSibling);
    else header.insertBefore(toggle, header.firstChild);

    toggle.addEventListener('click', toggleMenu);
    // attach submenu toggles
    attachSubmenuToggles();
    document.addEventListener('click', docClickHandler);
    document.addEventListener('keydown', escHandler);
  }

  function removeToggle(){
    const t = document.getElementById('agmMenuToggle');
    if (t) {
      t.removeEventListener('click', toggleMenu);
      t.parentNode && t.parentNode.removeChild(t);
    }
    detachSubmenuToggles();
    document.body.classList.remove('mobile-menu-active');
    document.removeEventListener('click', docClickHandler);
    document.removeEventListener('keydown', escHandler);
  }

  function toggleMenu(e){
    e.stopPropagation();
    const toggle = document.getElementById('agmMenuToggle');
    const open = document.body.classList.toggle('mobile-menu-active');
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }

  function docClickHandler(ev){
    const nav = document.querySelector('nav');
    const t = document.getElementById('agmMenuToggle');
    if (!nav) return;
    if (t && (t.contains(ev.target) || nav.contains(ev.target))) return;
    if (document.body.classList.contains('mobile-menu-active')) {
      document.body.classList.remove('mobile-menu-active');
      if (t) t.setAttribute('aria-expanded','false');
    }
  }

  function escHandler(e){
    if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-active')) {
      document.body.classList.remove('mobile-menu-active');
      const t = document.getElementById('agmMenuToggle');
      if (t) t.setAttribute('aria-expanded','false');
    }
  }

  /* Submenu toggles on mobile:
     Add a small button next to each dropdown-sub anchor to expand its submenu.
  */
function attachSubmenuToggles(){
  detachSubmenuToggles();
  const mainDropdowns = document.querySelectorAll('.dropdown > a');
  mainDropdowns.forEach(drop => {
    drop.addEventListener('click', function(ev){
      if (window.innerWidth <= 767) {
        ev.preventDefault();
        const content = drop.parentElement.querySelector('.dropdown-content');
        if (!content) return;
        content.classList.toggle('show-me');
      }
    });
  });
}

  function detachSubmenuToggles(){
    const toggles = document.querySelectorAll('.submenu-toggle');
    toggles.forEach(btn => btn.parentNode && btn.parentNode.removeChild(btn));
    // also remove any show-me classes
    const shown = document.querySelectorAll('.dropdown .show-me');
    shown.forEach(el => el.classList.remove('show-me'));
  }

  // handle resize
  let to;
  function onResize(){
    clearTimeout(to);
    to = setTimeout(function(){
      if (isMobile()) insertToggle();
      else removeToggle();
    }, 120);
  }

  // init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      if (isMobile()) insertToggle();
      window.addEventListener('resize', onResize);
    });
  } else {
    if (isMobile()) insertToggle();
    window.addEventListener('resize', onResize);
  }

})();
