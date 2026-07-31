/**
 * VISIORA - WavyBackground (Vanilla JS Port)
 * Implémentation native de l'animation canvas "simplex noise" inspirée de
 * l'architecture du composant React Aceternity UI / simplex-noise.
 * Utilisé sur : Hero section (index.html) et CTA section (index.html)
 *
 * Palette de couleurs VISIORA stricte :
 *   Background : #030405
 *   Rouge accent : #D4141A
 *   Rouge sombre : #7A0B0E
 *   Gunmetal     : #2D2E2E
 *   Graphite     : #3A3A3A
 */

/* =====================================================
   SIMPLEX NOISE — Algorithme embarqué (aino-code/simplex-noise v4 — ESM)
   On charge la lib en ESM depuis esm.sh directement dans le script importé.
   ===================================================== */

(async () => {
  // === Chargement dynamique de simplex-noise via CDN ESM (compatible browsers) ===
  let createNoise3D;
  try {
    const module = await import('https://esm.sh/simplex-noise@4.0.1');
    createNoise3D = module.createNoise3D;
  } catch (e) {
    console.warn('[VISIORA WavyBG] simplex-noise non chargé, animation dégradée.', e);
    return;
  }

  /* ==========================================================
     CONFIG GLOBALE DES VAGUES VISIORA
     ========================================================== */
  const VISIORA_COLORS = [
    '#D4141A', // Rouge Shutter (accent principal)
    '#7A0B0E', // Rouge sombre
    '#4A0508', // Rouge très profond
    '#2D2E2E', // Gunmetal
    '#3A3A3A', // Graphite
  ];

  const VISIORA_BG = '#030405'; // Noir cinématographique

  /* ==========================================================
     FONCTION PRINCIPALE : createWavyCanvas
     Initialise une animation de vagues sur un <canvas> donné.
     @param {HTMLCanvasElement} canvas
     @param {Object} options
     ========================================================== */
  function createWavyCanvas(canvas, options = {}) {
    const {
      colors = VISIORA_COLORS,
      backgroundFill = VISIORA_BG,
      waveWidth = 55,
      waveOpacity = 0.45,
      blur = 10,
      speed = 'fast',
      waveCount = 5,
    } = options;

    const noise = createNoise3D();
    const ctx = canvas.getContext('2d');
    let w, h, nt = 0;
    let animationId;

    const getSpeed = () => (speed === 'fast' ? 0.002 : 0.001);

    // Détection Safari pour le filtre blur fallback
    const isSafari = typeof navigator !== 'undefined' &&
      navigator.userAgent.includes('Safari') &&
      !navigator.userAgent.includes('Chrome');

    if (isSafari) {
      canvas.style.filter = `blur(${blur}px)`;
    } else {
      canvas.style.filter = '';
    }

    const resize = () => {
      const parent = canvas.parentElement;
      w = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      h = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      if (!isSafari) ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = () => {
      nt += getSpeed();
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave();
      animationId = requestAnimationFrame(render);
    };

    const destroy = () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };

    // Init
    resize();
    render();
    window.addEventListener('resize', resize);

    return { destroy };
  }

  /* ==========================================================
     INSTANCE 1 — HERO SECTION (index.html)
     Remplace le fond vidéo par un canvas animé cinématique
     ========================================================== */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    // Créer et injecter le canvas hero
    const heroCanvas = document.createElement('canvas');
    heroCanvas.id = 'wavy-hero-canvas';
    heroCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;

    // Cacher la vidéo, conserver comme fallback (accessibilité)
    const heroVideo = heroSection.querySelector('.hero-video-bg');
    if (heroVideo) {
      heroVideo.style.opacity = '0';
      heroVideo.style.transition = 'opacity 1s ease';
    }

    // Ajuster l'overlay par-dessus le canvas
    const heroOverlay = heroSection.querySelector('.hero-overlay');
    if (heroOverlay) {
      heroOverlay.style.zIndex = '2';
      // Overlay plus léger pour laisser transparaître les vagues
      heroOverlay.style.background = `
        radial-gradient(circle at center, rgba(3,4,5,0.2) 0%, rgba(3,4,5,0.6) 100%),
        linear-gradient(to bottom, rgba(3,4,5,0.3) 0%, rgba(3,4,5,0.75) 100%)
      `;
    }

    // Contenu doit passer au-dessus de l'overlay
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) heroContent.style.zIndex = '3';

    const scrollIndicator = heroSection.querySelector('.scroll-indicator');
    if (scrollIndicator) scrollIndicator.style.zIndex = '3';

    // Injecter juste avant l'overlay
    if (heroOverlay) {
      heroSection.insertBefore(heroCanvas, heroOverlay);
    } else {
      heroSection.prepend(heroCanvas);
    }

    // Lancer l'animation hero (vagues dynamiques avec rouge vif + accents)
    createWavyCanvas(heroCanvas, {
      colors: [
        '#D4141A', // Rouge Shutter vif
        '#9A0F13', // Rouge sombre
        '#5E0A0C', // Rouge profond
        '#2D2E2E', // Gunmetal (subtil)
        '#1a1a1b', // Noir doux
      ],
      backgroundFill: '#030405',
      waveWidth: 60,
      waveOpacity: 0.5,
      blur: 8,
      speed: 'fast',
      waveCount: 5,
    });
  }

  /* ==========================================================
     INSTANCE 2 — SECTION CTA (Appel à l'action)
     Vagues plus lentes, plus subtiles, pour un effet "atmosphère"
     ========================================================== */
  const ctaSection = document.getElementById('call-to-action');
  if (ctaSection) {
    // S'assurer que le container est relatif
    ctaSection.style.position = 'relative';
    ctaSection.style.overflow = 'hidden';

    const ctaCanvas = document.createElement('canvas');
    ctaCanvas.id = 'wavy-cta-canvas';
    ctaCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    `;

    // Pousser les éléments enfants existants au-dessus
    const ctaGlow = ctaSection.querySelector('.cta-glow');
    const ctaContainer = ctaSection.querySelector('.cta-container');
    if (ctaGlow) ctaGlow.style.zIndex = '2';
    if (ctaContainer) ctaContainer.style.zIndex = '3';

    ctaSection.prepend(ctaCanvas);

    // Vagues CTA : rouge très discret, lent, atmosphérique
    createWavyCanvas(ctaCanvas, {
      colors: [
        '#D4141A',
        '#6B0810',
        '#2D2E2E',
        '#1f1f20',
        '#3A3A3A',
      ],
      backgroundFill: '#0f1011',
      waveWidth: 45,
      waveOpacity: 0.35,
      blur: 14,
      speed: 'slow',
      waveCount: 4,
    });
  }

})();
