/**
 * VISIORA - Contact Page JavaScript
 * Handles URL query parameter auto-selections, client-side validation,
 * asynchronous Web3Forms submission, and animated success screens with GSAP.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pre-select service if passed in URL query
  preselectServiceFromQuery();

  // Initialize form validation and submission
  initContactForm();
});

/**
 * Reads ?service=XXX query parameters from URL and sets the matching select value.
 */
function preselectServiceFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  
  if (!serviceParam) return;

  const selectField = document.getElementById('contact-service');
  if (!selectField) return;

  // Map of URL values to option values
  const serviceMapping = {
    'creation-contenu': 'creation-contenu',
    'campagnes-reseaux': 'campagnes-reseaux',
    'gestion-reseaux': 'gestion-reseaux',
    'videographie': 'videographie',
    'photographie': 'photographie',
    'design-graphique': 'design-graphique',
    'branding': 'branding'
  };

  const matchedValue = serviceMapping[serviceParam];
  if (matchedValue) {
    selectField.value = matchedValue;
  }
}

/**
 * Validates fields and manages Web3Forms submission via asynchronous fetch request.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formWrapper = document.querySelector('.contact-form-wrapper');
  const successScreen = document.getElementById('success-screen');
  const errorScreen = document.getElementById('error-screen');
  
  if (!form || !successScreen || !errorScreen) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Client-Side Validation
    const isFormValid = validateFormFields(form);
    if (!isFormValid) return; // Stop if invalid

    // 2. Prepare Form Data
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi en cours...';

    const formData = new FormData(form);

    // 3. Post to Web3Forms API
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        // Success: Animate form out and success screen in
        animateFormTransition(form, successScreen);
      } else {
        // API Error
        console.error('Submission failed:', result.message);
        animateFormTransition(form, errorScreen);
      }
    } catch (error) {
      // Network Error
      console.error('Network Error during submission:', error);
      animateFormTransition(form, errorScreen);
    } finally {
      // Re-enable button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Re-try button on error screen
  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      gsap.to(errorScreen, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          errorScreen.style.display = 'none';
          form.style.display = 'block';
          gsap.fromTo(form, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        }
      });
    });
  }
}

/**
 * Validates input fields and toggles .error classes
 */
function validateFormFields(form) {
  let isValid = true;

  // Helper validation functions
  const setError = (input, show) => {
    const group = input.closest('.form-group');
    if (show) {
      group.classList.add('error');
      isValid = false;
    } else {
      group.classList.remove('error');
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate Name
  const nameInput = form.querySelector('[name="name"]');
  setError(nameInput, nameInput.value.trim() === '');

  // Validate Email
  const emailInput = form.querySelector('[name="email"]');
  setError(emailInput, !emailRegex.test(emailInput.value.trim()));

  // Validate Service Selection
  const serviceInput = form.querySelector('[name="service"]');
  setError(serviceInput, serviceInput.value === '');

  // Validate Message
  const messageInput = form.querySelector('[name="message"]');
  setError(messageInput, messageInput.value.trim().length < 10);

  return isValid;
}

/**
 * GSAP fade-out of form, fade-in of status screen, and draws success SVG checkmark.
 */
function animateFormTransition(form, targetScreen) {
  gsap.timeline()
    .to(form, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        form.style.display = 'none';
        targetScreen.style.display = 'flex';
        gsap.set(targetScreen, { opacity: 0 });
      }
    })
    .to(targetScreen, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        // If it's the success screen, animate the SVG checkmark
        if (targetScreen.id === 'success-screen') {
          const path = targetScreen.querySelector('.success-stroke');
          if (path) {
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 0.6,
              ease: 'power2.out'
            });
          }
        }
      }
    });
}
