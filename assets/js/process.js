/**
 * VISIORA - Processus Page JavaScript
 * Handles GSAP ScrollTrigger timeline progression, central line filling,
 * node activations, and staggered slide entries from left and right.
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
  initProcessIntro();
  initVerticalTimelineProgress();
  initTimelineBlockReveals();
});

/**
 * Entrance reveal for intro title
 */
function initProcessIntro() {
  gsap.fromTo('.process-intro-title',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' }
  );
}

/**
 * Fills the central timeline progress bar and activates node circles on scroll
 */
function initVerticalTimelineProgress() {
  const progressLine = document.querySelector('.timeline-spine-progress');
  const wrapper = document.querySelector('.timeline-wrapper');
  
  if (!progressLine || !wrapper) return;

  // Animate line height from top to bottom
  gsap.to(progressLine, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 0.5
    }
  });

  // Activate nodes as blocks cross the scroll threshold
  const blocks = gsap.utils.toArray('.timeline-block');
  blocks.forEach(block => {
    ScrollTrigger.create({
      trigger: block,
      start: 'top 60%',
      onEnter: () => block.classList.add('active'),
      onLeaveBack: () => block.classList.remove('active')
    });
  });
}

/**
 * Animates blocks contents and media columns sliding in from opposite directions
 */
function initTimelineBlockReveals() {
  const blocks = gsap.utils.toArray('.timeline-block');
  const isDesktop = window.innerWidth > 900;

  blocks.forEach((block, index) => {
    const content = block.querySelector('.timeline-content-side');
    const media = block.querySelector('.timeline-media-side');

    if (!content || !media) return;

    const blockTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    if (isDesktop) {
      const isEven = (index % 2 !== 0);

      // Slide content and image from opposing sides on desktop
      blockTimeline.fromTo(content,
        { opacity: 0, x: isEven ? 60 : -60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }
      )
      .fromTo(media,
        { opacity: 0, x: isEven ? -60 : 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.9'
      );
    } else {
      // Mobile standard slide up
      blockTimeline.fromTo([content, media],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
      );
    }
  });
}
