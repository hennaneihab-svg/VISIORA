/**
 * VISIORA - Témoignages (Testimonials) Page JavaScript
 * Handles custom carousel translation with GSAP, autoplay controls,
 * hover pause/resume, and mobile touch swipe events.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize slider
  initTestimonialsSlider();
});

/**
 * Premium testimonial slider supporting autoplay, manual controls, and swipe events
 */
function initTestimonialsSlider() {
  const container = document.querySelector('.carousel-container');
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!container || !track || !slides.length || !dotsContainer) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const autoplayInterval = 5000; // 5 seconds

  // 1. Generate Navigation Dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Voir le témoignage ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  // 2. Navigation Logic (Using GSAP for smooth translation)
  const goToSlide = (index) => {
    // Bounds clamping
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Translate track
    gsap.to(track, {
      x: `-${currentIndex * 100}%`,
      duration: 0.65,
      ease: 'power2.out'
    });

    // Animate active slide elements slightly for a cinematic reveal
    const currentSlide = slides[currentIndex];
    const quote = currentSlide.querySelector('.testimonial-quote');
    const author = currentSlide.querySelector('.testimonial-author-wrapper');

    if (quote && author) {
      gsap.fromTo(quote, 
        { opacity: 0.6, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(author, 
        { opacity: 0.6, y: 5 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    }

    // Update Dots active state
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Reset Autoplay timer on manual interaction
    startAutoplay();
  };

  // 3. Manual Button Click Triggers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // 4. Autoplay Functionality
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // Pause on hover
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Initialize
  startAutoplay();

  // 5. Touch / Swipe Support for Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50; // pixels
    const swipeDiff = touchStartX - touchEndX;

    if (swipeDiff > swipeThreshold) {
      // Swiped Left -> Next slide
      goToSlide(currentIndex + 1);
    } else if (swipeDiff < -swipeThreshold) {
      // Swiped Right -> Prev slide
      goToSlide(currentIndex - 1);
    }
  };
}
