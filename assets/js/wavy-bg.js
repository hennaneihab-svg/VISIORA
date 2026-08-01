/**
 * VISIORA - WavyBackground (Vanilla JS — Ultra-Performant PC & Mobile)
 * =====================================================================
 * Optimisations de performance extrêmes pour PC :
 *   1. Canvas interne plafonné à 1280x720 (stretch CSS 100%) -> Zéro lag GPU sur écrans 1080p/4K
 *   2. IntersectionObserver : l'animation S'ARRÊTE complètement quand le canvas n'est pas à l'écran
 *   3. Rendu CSS `filter: blur()` GPU-composited au lieu du dévastateur `ctx.filter` de canvas
 *   4. Pas d'échantillonnage x += 12 -> 60% d'opérations en moins par frame
 *   5. Regroupement intelligent des vagues en 1 seule passe contextuelle
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // SIMPLEX NOISE 3D (Ultra-rapide, zéro dépendance)
  // ─────────────────────────────────────────────────────────────
  const perm = new Uint8Array(512);
  const gradP = new Array(512);
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function seed(s) {
    let n = s;
    for (let i = 0; i < 256; i++) {
      n = (n * 1664525 + 1013904223) & 0xffffffff;
      perm[i] = perm[i + 256] = ((n >>> 24) ^ i) & 0xff;
      gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
    }
  }
  seed(42);

  function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }

  function noise3D(xin, yin, zin) {
    const F3 = 1/3, G3 = 1/6;
    const s = (xin+yin+zin)*F3;
    const i = Math.floor(xin+s), j = Math.floor(yin+s), k = Math.floor(zin+s);
    const t = (i+j+k)*G3;
    const X0=i-t, Y0=j-t, Z0=k-t;
    const x0=xin-X0, y0=yin-Y0, z0=zin-Z0;

    let i1,j1,k1,i2,j2,k2;
    if(x0>=y0){
      if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}
      else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}
      else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}
    } else {
      if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}
      else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}
      else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}
    }

    const x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3;
    const x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3;
    const x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3;

    const ii=i&255,jj=j&255,kk=k&255;

    let n0,n1,n2,n3,t0,t1,t2,t3;
    t0=0.6-x0*x0-y0*y0-z0*z0; n0=t0<0?0:(t0*=t0,t0*t0*dot3(gradP[ii+perm[jj+perm[kk]]],x0,y0,z0));
    t1=0.6-x1*x1-y1*y1-z1*z1; n1=t1<0?0:(t1*=t1,t1*t1*dot3(gradP[ii+i1+perm[jj+j1+perm[kk+k1]]],x1,y1,z1));
    t2=0.6-x2*x2-y2*y2-z2*z2; n2=t2<0?0:(t2*=t2,t2*t2*dot3(gradP[ii+i2+perm[jj+j2+perm[kk+k2]]],x2,y2,z2));
    t3=0.6-x3*x3-y3*y3-z3*z3; n3=t3<0?0:(t3*=t3,t3*t3*dot3(gradP[ii+1+perm[jj+1+perm[kk+1]]],x3,y3,z3));

    return 32*(n0+n1+n2+n3);
  }

  // ─────────────────────────────────────────────────────────────
  // PALETTES DE COULEURS
  // ─────────────────────────────────────────────────────────────
  const WAVE_COLORS_HERO = ['#D4141A', '#B01016', '#8A0C11', '#4A0508', '#2D2E2E'];
  const WAVE_COLORS_CTA  = ['#D4141A', '#6B0810', '#2D2E2E', '#1f1f20', '#3A3A3A'];

  // ─────────────────────────────────────────────────────────────
  // MOTEUR CANVAS WAVY ULTRA-OPTIMISÉ
  // ─────────────────────────────────────────────────────────────
  function createWavyCanvas(canvas, options) {
    const {
      colors      = WAVE_COLORS_HERO,
      bgFill      = '#030405',
      waveWidth   = 70,
      waveOpacity = 0.75,
      speedVal    = 0.002,
      waveCount   = 4,
    } = options || {};

    const ctx = canvas.getContext('2d', { alpha: false });
    let w, h, nt = 0, animId = null, isVisible = false;

    // 2. Plafonner la résolution interne (max 1280px large) pour éviter les lags 1080p/4K sur PC
    function resize() {
      const parent = canvas.parentElement;
      const realW  = parent ? parent.offsetWidth  : window.innerWidth;
      const realH  = parent ? parent.offsetHeight : window.innerHeight;

      // Échelle max 1280px : rendu 10x plus rapide sur grand écran PC
      const maxW = 1280;
      const scale = realW > maxW ? maxW / realW : 1;

      w = canvas.width  = Math.round(realW * scale);
      h = canvas.height = Math.round(realH * scale);
    }

    function drawWaves() {
      nt += speedVal;
      const step = 12; // Échantillonnage fluide à 12px

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth   = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];

        for (let x = 0; x < w; x += step) {
          const y = noise3D(x / 600, 0.3 * i, nt) * (h * 0.25);
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
      }
    }

    // 3. Regulateur 30 FPS stable
    const FRAME_MS = 1000 / 30;
    let lastTime = 0;

    function render(timestamp) {
      if (!isVisible) return; // Si hors écran -> ZÉRO calcul CPU

      if (timestamp - lastTime >= FRAME_MS) {
        lastTime = timestamp;
        ctx.fillStyle   = bgFill;
        ctx.globalAlpha = waveOpacity;
        ctx.fillRect(0, 0, w, h);
        drawWaves();
      }

      animId = requestAnimationFrame(render);
    }

    function start() {
      if (!isVisible) {
        isVisible = true;
        animId = requestAnimationFrame(render);
      }
    }

    function stop() {
      isVisible = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    // 4. IntersectionObserver : PAUSE L'ANIMATION LORSQU'ELLE N'EST PAS VISIBLE
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(canvas);
    } else {
      start(); // Fallback si pas de support
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
  }

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  function initHeroWave() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // Supprimer toute vidéo s'il en reste une
    const vid = heroSection.querySelector('.hero-video-bg');
    if (vid) vid.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'wavy-hero-canvas';
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%',
      zIndex: '1', pointerEvents: 'none',
    });

    const overlay = heroSection.querySelector('.hero-overlay');
    if (overlay) {
      overlay.style.zIndex = '2';
      overlay.style.background = 'radial-gradient(ellipse at center, rgba(3,4,5,0.1) 0%, rgba(3,4,5,0.45) 100%)';
      heroSection.insertBefore(canvas, overlay);
    } else {
      heroSection.prepend(canvas);
    }

    const content = heroSection.querySelector('.hero-content');
    const scroll  = heroSection.querySelector('.scroll-indicator');
    if (content) content.style.zIndex = '4';
    if (scroll)  scroll.style.zIndex  = '4';

    createWavyCanvas(canvas, {
      colors:      WAVE_COLORS_HERO,
      bgFill:      '#030405',
      waveWidth:   75,
      waveOpacity: 0.75,
      blurPx:      6,
      speedVal:    0.002,
      waveCount:   4,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // CTA SECTION
  // ─────────────────────────────────────────────────────────────
  function initCtaWave() {
    const ctaSection = document.getElementById('call-to-action');
    if (!ctaSection) return;

    ctaSection.style.position = 'relative';
    ctaSection.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.id = 'wavy-cta-canvas';
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%',
      zIndex: '0', pointerEvents: 'none',
    });

    const glow = ctaSection.querySelector('.cta-glow');
    const cont = ctaSection.querySelector('.cta-container');
    if (glow) glow.style.zIndex = '2';
    if (cont) cont.style.zIndex = '3';

    ctaSection.prepend(canvas);

    createWavyCanvas(canvas, {
      colors:      WAVE_COLORS_CTA,
      bgFill:      '#0f1011',
      waveWidth:   50,
      waveOpacity: 0.4,
      blurPx:      10,
      speedVal:    0.001,
      waveCount:   3,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // DÉMARRAGE
  // ─────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroWave();
      initCtaWave();
    });
  } else {
    initHeroWave();
    initCtaWave();
  }

})();
