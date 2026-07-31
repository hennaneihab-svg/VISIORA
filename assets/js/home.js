/**
 * VISIORA - Home Page JavaScript
 * Handles GSAP ScrollTrigger animations, statistics counter increments,
 * and the horizontal timeline pinned scroll effect.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP and ScrollTrigger are loaded before initiating
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const loader = document.getElementById('intro-loader');
  const isFirstLoad = !sessionStorage.getItem('visiora_loaded');

  if (loader && isFirstLoad) {
    sessionStorage.setItem('visiora_loaded', 'true');
    runLoaderAndStartAnimations(loader);
  } else {
    if (loader) loader.style.display = 'none';
    initHeroAnimations(0.1);
    initAllOtherAnimations();
  }
});

function initAllOtherAnimations() {
  initServicesAnimations();
  initPortfolioAnimations();
  initStatsCounters();
  initProcessTimeline();
  initGeneralScrollReveals();
}

function runLoaderAndStartAnimations(loader) {
  const loaderLogo = loader.querySelector('.loader-logo');
  const loaderBar = loader.querySelector('.loader-bar');

  const mainTimeline = gsap.timeline({
    onComplete: () => {
      loader.style.display = 'none';
      initAllOtherAnimations();
    }
  });

  mainTimeline
    // 1. Apparition du logo
    .fromTo(loaderLogo, 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
    )
    // 2. Remplissage de la barre rouge
    .fromTo(loaderBar,
      { width: 0 },
      { width: 140, duration: 1.2, ease: 'power3.inOut' },
      '-=0.2'
    )
    // 3. Disparition du loader
    .to([loaderLogo, loaderBar], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
    .to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.2')
    // 4. Lancement de l'animation Hero
    .add(() => {
      initHeroAnimations(0.1);
    }, '-=0.4');
}

/**
 * Entrance animations for the Hero elements
 */
function initHeroAnimations(delayVal = 0.5) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-subtitle', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 0.8, delay: delayVal }
  )
  .fromTo('.hero-title', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1 }, 
    '-=0.5'
  )
  .fromTo('.hero-btns .btn', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 
    '-=0.6'
  )
  .fromTo('.scroll-indicator', 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.8 }, 
    '-=0.4'
  );

  // Click handler to scroll to services section
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const servicesSection = document.querySelector('.services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Cascading stagger fade-in reveal for the services cards
 */
function initServicesAnimations() {
  const cards = gsap.utils.toArray('.service-card');
  if (!cards.length) return;

  gsap.fromTo(cards, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * Portfolio preview grid fade-in + scale animations
 */
function initPortfolioAnimations() {
  const items = gsap.utils.toArray('.portfolio-item');
  if (!items.length) return;

  gsap.fromTo(items, 
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * Increments statistics numbers when the section enters the viewport
 */
function initStatsCounters() {
  const statsSection = document.querySelector('.why-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsSection || !statNumbers.length) return;

  ScrollTrigger.create({
    trigger: '.stats-grid',
    start: 'top 85%',
    onEnter: () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const countObj = { val: 0 };
        
        gsap.to(countObj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.querySelector('span').innerText = Math.floor(countObj.val);
          }
        });
      });
    },
    once: true // Trigger count animation only once
  });
}

/**
 * Handles pinning and horizontal scrolling for the desktop timeline
 * and vertical progression for mobile.
 */
function initProcessTimeline() {
  const horizontalTimeline = document.querySelector('.timeline-horizontal');
  const horizontalTrack = document.querySelector('.timeline-track-horizontal');
  const progressBarHorizontal = document.querySelector('.timeline-progress-horizontal');
  
  if (!horizontalTimeline) return;

  // Desktop Horizontal Pin Scroll
  if (window.innerWidth > 800) {
    const steps = gsap.utils.toArray('.timeline-step-horizontal');
    const stepCount = steps.length;
    const scrollWidth = horizontalTimeline.scrollWidth - window.innerWidth;

    gsap.timeline({
      scrollTrigger: {
        trigger: '.process-section',
        pin: true,
        scrub: 1,
        start: 'top top',
        // Scroll duration matches the total amount of horizontal overflow
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true
      }
    })
    .to(horizontalTimeline, {
      x: () => -scrollWidth,
      ease: 'none'
    })
    .to(progressBarHorizontal, {
      width: '100%',
      ease: 'none'
    }, 0); // Start progress bar simultaneously (at time 0)
  } 
  // Mobile Vertical Progression
  else {
    const verticalSteps = gsap.utils.toArray('.timeline-step-vertical');
    const progressBarVertical = document.querySelector('.timeline-progress-vertical');

    if (progressBarVertical) {
      gsap.to(progressBarVertical, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-vertical',
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 0.5
        }
      });
    }

    // Toggle active state on steps as they cross viewport
    verticalSteps.forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        onEnter: () => step.classList.add('active'),
        onLeaveBack: () => step.classList.remove('active')
      });
    });
  }
}

/**
 * General Scroll Reveals for headings and call to actions
 */
function initGeneralScrollReveals() {
  // Title reveals
  const sectionHeaders = gsap.utils.toArray('.section-header');
  sectionHeaders.forEach(header => {
    gsap.fromTo(header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Pourquoi VISIORA left text block reveal
  const whyContent = document.querySelector('.why-content');
  if (whyContent) {
    gsap.fromTo(whyContent,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: whyContent,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // CTA Section reveal
  const ctaContainer = document.querySelector('.cta-container');
  if (ctaContainer) {
    gsap.fromTo(ctaContainer,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
}
