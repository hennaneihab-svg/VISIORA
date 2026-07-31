/**
 * VISIORA - Portfolio Page JavaScript
 * Handles dynamic grid filtering with custom GSAP transitions,
 * and a fully accessible, media-capable Lightbox/Modal system.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP is not loaded.');
    return;
  }

  // Initialize features
  initPortfolioFilters();
  initLightbox();
});

/**
 * Filter gallery cards based on data-category attributes using GSAP
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Update Active state on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // 2. Perform GSAP filter animation
      const toHide = [];
      const toShow = [];

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
          toShow.push(card);
        } else {
          toHide.push(card);
        }
      });

      // Animate out items to hide
      if (toHide.length) {
        gsap.to(toHide, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            toHide.forEach(el => el.style.display = 'none');
            
            // Once hidden items are out of the column layout flow,
            // make show-items block and animate them in
            toShow.forEach(el => el.style.display = 'block');
            gsap.fromTo(toShow,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
          }
        });
      } else {
        // If nothing is to hide, just show items
        toShow.forEach(el => el.style.display = 'block');
        gsap.fromTo(toShow,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
        );
      }
    });
  });
}

/**
 * Responsive Lightbox Modal supporting both images and autoplay video loops
 */
function initLightbox() {
  const lightbox = document.getElementById('portfolio-lightbox');
  const wrapper = lightbox?.querySelector('.lightbox-content-wrapper');
  const mediaContainer = lightbox?.querySelector('.lightbox-media');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  
  const cards = document.querySelectorAll('.portfolio-card');
  if (!lightbox || !mediaContainer || !closeBtn || !cards.length) return;

  // Open Lightbox
  const openLightbox = (card) => {
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category-label');
    const description = card.getAttribute('data-description');
    const mediaSrc = card.getAttribute('data-media-src');
    const isVideo = card.getAttribute('data-is-video') === 'true';

    // Set textual information
    lightbox.querySelector('.lightbox-title').innerText = title;
    lightbox.querySelector('.lightbox-cat').innerText = category;
    lightbox.querySelector('.lightbox-desc').innerText = description;

    // Clear previous media
    mediaContainer.innerHTML = '';

    // Create and inject media element
    if (isVideo) {
      const video = document.createElement('video');
      video.src = mediaSrc;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.controls = true;
      video.playsInline = true;
      mediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = mediaSrc;
      img.alt = title;
      mediaContainer.appendChild(img);
    }

    // Play GSAP opening timeline
    document.body.style.overflow = 'hidden'; // Disable scroll
    lightbox.classList.add('open');
    
    gsap.timeline()
      .to(lightbox, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          lightbox.style.visibility = 'visible';
        }
      })
      .fromTo(wrapper,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      );
  };

  // Close Lightbox
  const closeLightbox = () => {
    gsap.timeline()
      .to(wrapper, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(lightbox, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          lightbox.classList.remove('open');
          lightbox.style.visibility = 'hidden';
          document.body.style.overflow = ''; // Re-enable scroll
          // Stop media playback by cleaning the node
          mediaContainer.innerHTML = '';
        }
      }, '-=0.15');
  };

  // Bind clicks on cards
  cards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  // Bind close buttons
  closeBtn.addEventListener('click', closeLightbox);
  
  // Close on clicking overlay bg
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}
