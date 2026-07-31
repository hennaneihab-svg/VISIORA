/**
 * VISIORA - Core JavaScript
 * Manages global components (header, footer), page transitions,
 * active link highlighting, and navigation animations with GSAP.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Page Load Transition (Fade In)
  gsap.fromTo('body', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });

  // 2. Load Components (Header and Footer)
  initGlobalComponents();
});

/**
 * Loads header.html and footer.html dynamically, then initializes their respective interactions.
 */
async function initGlobalComponents() {
  const headerContainer = document.getElementById('global-header');
  const footerContainer = document.getElementById('global-footer');

  // Load Header
  if (headerContainer) {
    try {
      const response = await fetch('./components/header.html');
      if (response.ok) {
        headerContainer.innerHTML = await response.text();
        initHeaderInteractions();
      } else {
        console.error('Failed to load header component:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }

  // Load Footer
  if (footerContainer) {
    try {
      const response = await fetch('./components/footer.html');
      if (response.ok) {
        footerContainer.innerHTML = await response.text();
        highlightActiveLinks();
      } else {
        console.error('Failed to load footer component:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }
}

/**
 * Initializes burger menu toggles, scroll opacity, and GSAP animations for the header.
 */
function initHeaderInteractions() {
  const header = document.getElementById('global-header');
  const burgerToggle = document.getElementById('burger-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (!burgerToggle || !mobileOverlay) {
    console.warn('[VISIORA] Burger or overlay element not found after header load.');
    return;
  }

  // 1. Highlight Active Links
  highlightActiveLinks();

  // 2. Scroll Event for Sticky Header
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 3. Mobile Menu Toggle — GSAP gère display flex/none EXCLUSIVEMENT
  let isMenuOpen = false;

  // État initial : caché (GSAP prend le contrôle total, le CSS a display:none)
  gsap.set(mobileOverlay, { display: 'none', opacity: 0 });

  const closeMenu = () => {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    burgerToggle.classList.remove('open');
    burgerToggle.setAttribute('aria-expanded', 'false');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-link');
    const mobileSocials = mobileOverlay.querySelector('.mobile-socials');

    gsap.timeline()
      .to([...mobileLinks, mobileSocials].filter(Boolean), {
        y: -20, opacity: 0, duration: 0.25, stagger: 0.04, ease: 'power2.in'
      })
      .to(mobileOverlay, {
        opacity: 0, duration: 0.35, ease: 'power2.inOut',
        onComplete: () => { gsap.set(mobileOverlay, { display: 'none' }); }
      }, '-=0.1');
  };

  const openMenu = () => {
    if (isMenuOpen) return;
    isMenuOpen = true;
    burgerToggle.classList.add('open');
    burgerToggle.setAttribute('aria-expanded', 'true');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-link');
    const mobileSocials = mobileOverlay.querySelector('.mobile-socials');

    // display:flex d'abord, puis animer l'opacité
    gsap.set(mobileOverlay, { display: 'flex', opacity: 0 });

    gsap.timeline()
      .to(mobileOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .fromTo(mobileLinks,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo(mobileSocials || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
        '-=0.3'
      );
  };

  const toggleMenu = () => { isMenuOpen ? closeMenu() : openMenu(); };

  burgerToggle.addEventListener('click', toggleMenu);

  // Fermer le menu en cliquant un lien
  mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer avec touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });

  // 4. Smooth Page Out Transition on Navigation Links
  const localLinks = document.querySelectorAll('a[href$=".html"]');
  localLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      if (e.metaKey || e.ctrlKey || link.target === '_blank' || !targetUrl.endsWith('.html')) return;
      e.preventDefault();
      gsap.to('body', {
        opacity: 0, duration: 0.35, ease: 'power2.in',
        onComplete: () => { window.location.href = targetUrl; }
      });
    });
  });
}

/**
 * Highlights the active link in the navigation menus by reading data-page from the body tag.
 */
function highlightActiveLinks() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  const links = document.querySelectorAll(`[data-page-link="${currentPage}"]`);
  links.forEach(link => {
    link.classList.add('active');
  });

  // Highlight simple footer links as well (they don't have data-page-link, so check href matching)
  const footerLinks = document.querySelectorAll('footer a');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage + '.html' || (currentPage === 'home' && href === 'index.html'))) {
      link.classList.add('active');
      link.style.color = 'var(--color-accent)';
    }
  });
}
