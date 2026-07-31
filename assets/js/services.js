/**
 * VISIORA - Services Page JavaScript
 * Handles GSAP ScrollTrigger animations for alternating row arrivals
 * (opposing horizontal entry slides) and expanding red section dividers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP and ScrollTrigger are loaded before initiating
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Initialize animations
  initIntroAnimation();
  initAlternatingRows();
  initDividers();
});

/**
 * Entrance reveal for Services Intro Title
 */
function initIntroAnimation() {
  gsap.fromTo('.services-intro-title', 
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' }
  );
}

/**
 * Slide-in reveal for alternating rows:
 * Visual and Text arrive from opposite directions.
 */
function initAlternatingRows() {
  const rows = gsap.utils.toArray('.service-row');
  
  rows.forEach(row => {
    const visual = row.querySelector('.service-visual');
    const info = row.querySelector('.service-info');
    const isReversed = row.classList.contains('reversed');

    if (!visual || !info) return;

    const rowTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate visual entry
    rowTimeline.fromTo(visual,
      { opacity: 0, x: isReversed ? -60 : 60 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );

    // Animate text elements entry (staggered slightly)
    const textElements = info.querySelectorAll('.service-num, h2, p, .service-features, .service-cta');
    rowTimeline.fromTo(textElements,
      { opacity: 0, x: isReversed ? 40 : -40 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      '-=0.7'
    );
  });
}

/**
 * Expanding red divider line animations on scroll
 */
function initDividers() {
  const dividers = gsap.utils.toArray('.service-divider');
  
  dividers.forEach(divider => {
    gsap.to(divider, {
      scaleX: 1,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: divider,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
}
