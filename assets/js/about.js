/**
 * VISIORA - About (À propos) Page JavaScript
 * Handles GSAP ScrollTrigger animations with specific editorial magazine transitions,
 * including horizontal offsets and asymmetrical reveal effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP and ScrollTrigger are loaded before initiating
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Initialize all About animations
  initHeroReveals();
  initAsymmetricMediaAnimations();
  initEditorialTextAnimations();
  initValuesAnimations();
  initTeamAnimations();
});

/**
 * Entrance animation for the About Hero elements
 */
function initHeroReveals() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.about-hero-title', 
    { opacity: 0, x: -30 }, 
    { opacity: 1, x: 0, duration: 1.2, delay: 0.5 }
  )
  .fromTo('.editorial-divider', 
    { scaleX: 0, transformOrigin: 'left center' }, 
    { scaleX: 1, duration: 1 }, 
    '-=0.6'
  );
}

/**
 * Animates asymmetrical images sliding in from one side,
 * while their outline accent border slides from the opposite side.
 */
function initAsymmetricMediaAnimations() {
  const mediaContainers = gsap.utils.toArray('.history-media');
  
  mediaContainers.forEach(container => {
    const imgWrapper = container.querySelector('.history-img-wrapper');
    const offsetBorder = container.querySelector('.media-offset-border');
    const isInverted = container.closest('.magazine-grid').classList.contains('inverted');

    if (!imgWrapper) return;

    const imgTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate image wrapper and border with opposing offsets
    imgTimeline.fromTo(imgWrapper,
      { opacity: 0, x: isInverted ? -50 : 50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
    );

    if (offsetBorder) {
      imgTimeline.fromTo(offsetBorder,
        { opacity: 0, x: isInverted ? 40 : -40, y: 15 },
        { opacity: 0.8, x: 0, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );
    }
  });
}

/**
 * Editorial transitions: fade-in with horizontal offsets for texts and pullquotes
 */
function initEditorialTextAnimations() {
  const textBlocks = gsap.utils.toArray('.history-text p, .history-text .dropcap');
  
  textBlocks.forEach(block => {
    const isDropcap = block.classList.contains('dropcap');
    
    gsap.fromTo(block,
      { opacity: 0, x: isDropcap ? -30 : 25 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Animate Pullquotes with larger transitions
  const quotes = gsap.utils.toArray('.editorial-quote');
  quotes.forEach(quote => {
    const quoteText = quote.querySelector('blockquote');
    const quoteCite = quote.querySelector('cite');

    const quoteTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: quote,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    quoteTimeline.fromTo(quote,
      { borderLeftWidth: 0, paddingLeft: 0 },
      { borderLeftWidth: '2px', paddingLeft: '2rem', duration: 0.8, ease: 'power2.out' }
    )
    .fromTo([quoteText, quoteCite],
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      '-=0.4'
    );
  });
}

/**
 * Reveal animation for values list
 */
function initValuesAnimations() {
  const valueItems = gsap.utils.toArray('.value-item');
  if (!valueItems.length) return;

  gsap.fromTo(valueItems,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * Stagger entrance animation for team cards
 */
function initTeamAnimations() {
  const teamCards = gsap.utils.toArray('.team-card');
  if (!teamCards.length) return;

  gsap.fromTo(teamCards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}
