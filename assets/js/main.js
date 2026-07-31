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
  
  if (!burgerToggle || !mobileOverlay) return;

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
  handleScroll(); // Check initially

  // 3. Mobile Menu Toggle (GSAP-powered overlay animation)
  let isMenuOpen = false;
  
  // Set initial states for GSAP
  gsap.set(mobileOverlay, { display: 'none', opacity: 0 });
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    burgerToggle.classList.toggle('open', isMenuOpen);
    burgerToggle.setAttribute('aria-expanded', isMenuOpen);
    mobileOverlay.setAttribute('aria-hidden', !isMenuOpen);

    const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-link');
    const mobileSocials = mobileOverlay.querySelector('.mobile-socials');

    if (isMenuOpen) {
      // Open Menu
      document.body.style.overflow = 'hidden'; // Disable page scrolling
      gsap.set(mobileOverlay, { display: 'flex' });
      
      gsap.timeline()
        .to(mobileOverlay, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        .fromTo(mobileLinks, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(mobileSocials,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.3'
        );
    } else {
      // Close Menu
      document.body.style.overflow = ''; // Re-enable page scrolling
      
      gsap.timeline()
        .to(mobileLinks, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        })
        .to(mobileOverlay, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(mobileOverlay, { display: 'none' });
          }
        }, '-=0.15');
    }
  };

  burgerToggle.addEventListener('click', toggleMenu);

  // Close mobile menu on clicking any navigation link (useful for hash links / same-page redirects)
  const links = mobileOverlay.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // 4. Smooth Page Out Transition on Navigation Links
  const localLinks = document.querySelectorAll('a[href$=".html"]');
  localLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      
      // Do not animate if command/ctrl key is pressed or link opens in new tab
      if (e.metaKey || e.ctrlKey || link.target === '_blank' || !targetUrl.endsWith('.html')) {
        return;
      }

      e.preventDefault();
      
      gsap.to('body', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          window.location.href = targetUrl;
        }
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
