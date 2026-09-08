/**
 * KARMAA WEDDING PRODUCTIONS - SOUND VIBE STUDIO & INTERACTIVE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  let isPlaying = false;
  let currentOscillators = [];
  let animFrameId = null;
  let analyser = null;

  const btnStudioPlay = document.getElementById('btn-studio-play');
  const activeVibeTitle = document.getElementById('active-vibe-title');
  const consoleStatusText = document.getElementById('console-status-text');
  const spectrumCanvas = document.getElementById('studio-spectrum-canvas');
  const spectrumCanvasCtx = spectrumCanvas ? spectrumCanvas.getContext('2d') : null;

  const vibes = {
    acoustic: {
      name: "Acoustic Romance — Warm Guitar & Piano",
      freqs: [261.63, 329.63, 392.00, 493.88], // C, E, G, B
      type: 'sine'
    },
    orchestral: {
      name: "Royal Orchestral & Sitar — Majestic Crescendo",
      freqs: [220.00, 277.18, 329.63, 440.00], // A, C#, E, A
      type: 'triangle'
    },
    sufi: {
      name: "Sufi Soul & Sacred Mantras — Ambient Flute",
      freqs: [196.00, 246.94, 293.66, 392.00], // G, B, D, G
      type: 'sine'
    },
    pop: {
      name: "Sangeet Pop Anthem — Upbeat Rhythm",
      freqs: [293.66, 369.99, 440.00, 554.37], // D, F#, A, C#
      type: 'triangle'
    }
  };

  let activeVibeKey = 'acoustic';

  function initAudioEngine() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(audioCtx.destination);
    }
  }

  function playVibeSynth(vibeKey) {
    initAudioEngine();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopVibeSynth();

    activeVibeKey = vibeKey || 'acoustic';
    const vibe = vibes[activeVibeKey] || vibes.acoustic;

    if (activeVibeTitle) activeVibeTitle.textContent = vibe.name;
    if (consoleStatusText) consoleStatusText.textContent = "Synthesizing Realtime Soundscape";

    vibe.freqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = vibe.type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // LFO modulation for warm vibrato
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.6, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(2.5, audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.07, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(analyser);
      osc.start();

      currentOscillators.push({ osc, gain, lfo });
    });

    isPlaying = true;
    updatePlayUI(true);
    startVisualizerLoop();
  }

  function stopVibeSynth() {
    currentOscillators.forEach(item => {
      try {
        item.gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        setTimeout(() => {
          item.osc.stop();
          if (item.lfo) item.lfo.stop();
        }, 120);
      } catch (e) {}
    });
    currentOscillators = [];
    isPlaying = false;
    updatePlayUI(false);
    if (consoleStatusText) consoleStatusText.textContent = "Soundscape Paused";
  }

  function toggleVibeSynth() {
    if (isPlaying) {
      stopVibeSynth();
    } else {
      playVibeSynth(activeVibeKey);
    }
  }

  function updatePlayUI(playing) {
    if (!btnStudioPlay) return;
    const svg = btnStudioPlay.querySelector('svg');
    if (playing) {
      if (svg) svg.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      btnStudioPlay.childNodes[1].nodeValue = ' Pause Soundscape';
    } else {
      if (svg) svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      btnStudioPlay.childNodes[1].nodeValue = ' Play Live Soundscape';
    }
  }

  // Realtime Spectrum Visualizer Loop
  function startVisualizerLoop() {
    if (!spectrumCanvasCtx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isPlaying) {
        spectrumCanvasCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
        return;
      }
      animFrameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      spectrumCanvasCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

      const barWidth = (spectrumCanvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * spectrumCanvas.height * 0.85;

        const gradient = spectrumCanvasCtx.createLinearGradient(0, spectrumCanvas.height, 0, 0);
        gradient.addColorStop(0, '#e0b968');
        gradient.addColorStop(0.5, '#f3d38c');
        gradient.addColorStop(1, '#e8a598');

        spectrumCanvasCtx.fillStyle = gradient;
        spectrumCanvasCtx.fillRect(x, spectrumCanvas.height - barHeight, barWidth - 4, barHeight);

        x += barWidth + 2;
      }
    }
    draw();
  }

  if (btnStudioPlay) {
    btnStudioPlay.addEventListener('click', toggleVibeSynth);
  }

  // Vibe Cards Selection (no-op now but kept for safety)
  const vibeCards = document.querySelectorAll('.vibe-card');
  vibeCards.forEach(card => {
    card.addEventListener('click', () => {
      vibeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });


  // SIMPLE INQUIRY FORM HANDLER WITH FORMSUBMIT INTEGRATION
  const wizardForm           = document.getElementById('wizard-form');
  const wizardSuccessMsg      = document.getElementById('wizard-success-msg');
  const btnWizardSubmit      = document.getElementById('btn-wizard-submit');
  const hiddenSelectedServices = document.getElementById('hidden-selected-services');

  // Service chips — multi-toggle
  document.querySelectorAll('.query-service-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('chip-selected'));
  });

  // Submit via FormSubmit AJAX fetch
  if (wizardForm) {
    wizardForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Gather selected chips
      const selectedChips = Array.from(document.querySelectorAll('.query-service-chip.chip-selected'))
        .map(c => c.textContent.trim());
      if (hiddenSelectedServices) {
        hiddenSelectedServices.value = selectedChips.length > 0 ? selectedChips.join(', ') : 'General Inquiry';
      }

      // UI Loading Feedback
      if (btnWizardSubmit) {
        btnWizardSubmit.disabled = true;
        btnWizardSubmit.textContent = 'Sending Your Inquiry...';
      }

      const formData = new FormData(wizardForm);
      const actionUrl = wizardForm.getAttribute('action') || 'https://formsubmit.co/cinema@karmaaproductions.com';

      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(() => {
        wizardForm.style.display = 'none';
        if (wizardSuccessMsg) wizardSuccessMsg.style.display = 'block';
      })
      .catch(() => {
        // Fallback display success message
        wizardForm.style.display = 'none';
        if (wizardSuccessMsg) wizardSuccessMsg.style.display = 'block';
      });
    });
  }

  // HERO DYNAMIC SLIDE TRANSITION CONTROLLER (FOMO ROTATOR)
  let currentHeroSlide = 1;
  let heroSlideInterval = null;
  const heroSlides = document.querySelectorAll('.hero-slide');
  const slideDots = document.querySelectorAll('.slide-dot');
  const totalHeroSlides = heroSlides.length || 5;

  function goToHeroSlide(slideNum) {
    currentHeroSlide = slideNum;
    heroSlides.forEach(slide => {
      const num = parseInt(slide.getAttribute('data-slide'));
      if (num === currentHeroSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    slideDots.forEach(dot => {
      const targetNum = parseInt(dot.getAttribute('data-target'));
      if (targetNum === currentHeroSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startHeroSlideTimer() {
    if (heroSlideInterval) clearInterval(heroSlideInterval);
    heroSlideInterval = setInterval(() => {
      let nextSlide = currentHeroSlide + 1;
      if (nextSlide > totalHeroSlides) nextSlide = 1;
      goToHeroSlide(nextSlide);
    }, 8000);
  }

  slideDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetSlide = parseInt(dot.getAttribute('data-target'));
      goToHeroSlide(targetSlide);
      startHeroSlideTimer(); // reset timer on manual click
    });
  });

  if (heroSlides.length > 0) {
    goToHeroSlide(1);
    startHeroSlideTimer();
  }

  // SERVICE 4: 35MM FILM PHOTO SLIDESHOW ROTATOR (CAROUSEL ENGINE)
  function initFilmSlideshow() {
    const container = document.getElementById('service4-slideshow');
    if (!container) return;
    const slides = container.querySelectorAll('.film-slide');
    const dots = container.querySelectorAll('.f-dot');
    if (slides.length < 2) return;

    let currentIndex = 0;
    let timer = null;

    function goToSlide(index) {
      slides[currentIndex].classList.remove('active');
      if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add('active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 3500);
    }

    // Dot click interaction
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
        startTimer();
      });
    });

    // Mobile touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        goToSlide(currentIndex + 1);
        startTimer();
      } else if (touchEndX - touchStartX > 40) {
        goToSlide(currentIndex - 1);
        startTimer();
      }
    }, { passive: true });

    goToSlide(0);
    startTimer();
  }

  initFilmSlideshow();

  // ============================================================
  // SCROLL REVEAL — WORD-BY-WORD CURTAIN ENGINE
  // ============================================================
  function initScrollReveal() {

    // ── 1. WORD SPLIT for all headings ──────────────────────────
    const headingSelectors = [
      '.editorial-title-serif',
      '.editorial-sec-title',
      '.section-title',
    ];

    headingSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.srDone) return;
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words
          .map((w, i) =>
            `<span class="wo"><span class="wi" style="transition-delay:${(i * 0.09).toFixed(2)}s">${w}</span></span>`
          )
          .join(' ');
        el.dataset.sr = 'words';
        el.dataset.srDone = '1';
      });
    });

    // ── 2. VIDEO / MEDIA frames — slide in from sides ───────────
    document.querySelectorAll('.editorial-video-frame').forEach((el, i) => {
      // Odd service blocks → video on left → slide from left
      // Even → slide from right (layout alternates via CSS, so just left here)
      el.classList.add('sr-slide-left');
    });

    // ── 3. Typography content blocks — staggered fade-up ────────
    // Process each service block independently so delays reset per block
    document.querySelectorAll('.service-block').forEach(block => {
      const orderedSelectors = [
        { sel: '.editorial-badge',            delay: 0.05 },
        { sel: '.editorial-title-serif',      delay: 0.1  },
        { sel: '.editorial-script-line',      delay: 0.3  },
        { sel: '.editorial-body-text',        delay: 0.42 },
        { sel: '.editorial-contrast-columns', delay: 0.54 },
        { sel: '.editorial-features-bar',     delay: 0.66 },
        { sel: '.editorial-action-row',       delay: 0.76 },
      ];

      orderedSelectors.forEach(({ sel, delay }) => {
        const el = block.querySelector(sel);
        if (!el) return;
        // Don't double-apply to heading (already handled as sr-words)
        if (sel === '.editorial-title-serif') return;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add('sr-fade');
      });
    });

    // ── 4. Section-level elements ────────────────────────────────
    document.querySelectorAll('.editorial-top-header .editorial-sec-title').forEach(el => {
      // Already word-split above; nothing extra needed
    });

    document.querySelectorAll('.editorial-top-header .editorial-sec-desc, .section-desc').forEach((el, i) => {
      el.style.transitionDelay = `${0.15 + i * 0.05}s`;
      el.classList.add('sr-fade');
    });

    document.querySelectorAll('.editorial-section-divider').forEach(el => {
      el.classList.add('sr-line');
    });

    // Keepsakes portrait items
    document.querySelectorAll('.keepsake-portrait-item').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.18}s`;
      el.classList.add('sr-fade');
    });

    // Process cards
    document.querySelectorAll('.process-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.12}s`;
      el.classList.add('sr-fade');
    });

    // Section headers (badge tags)
    document.querySelectorAll('.section-tag').forEach(el => {
      el.style.transitionDelay = '0s';
      el.classList.add('sr-fade');
    });

    document.querySelectorAll('.editorial-top-header .hero-badge-clean').forEach(el => {
      el.style.transitionDelay = '0s';
      el.classList.add('sr-fade');
    });

    // ── 5. IntersectionObserver ──────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add('sr-on');
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll(
      '[data-sr="words"], .sr-fade, .sr-slide-left, .sr-slide-right, .sr-line'
    ).forEach(el => io.observe(el));
  }

  initScrollReveal();

  // ============================================================
  // BIDIRECTIONAL SCROLL INTERACTION ENGINE
  // (runs continuously on every scroll, forward AND reverse)
  // ============================================================
  function initLiveScrollEngine() {

    // ── DOM references ──────────────────────────────────────────
    const marqueeTrack   = document.querySelector('.marquee-track');
    const videoFrames    = document.querySelectorAll('.editorial-video-frame');

    // ── Progress bar ────────────────────────────────────────────
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    // ── State ───────────────────────────────────────────────────
    let lastScrollY    = window.scrollY;
    let rawVelocity    = 0;   // pixels/frame — raw delta
    let smoothVelocity = 0;   // lerped velocity
    let rafId          = null;
    let ticking        = false;

    // ── Scroll listener (passive) ────────────────────────────────
    window.addEventListener('scroll', () => {
      rawVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (!ticking) {
        rafId = requestAnimationFrame(updateAll);
        ticking = true;
      }
    }, { passive: true });

    // ── Velocity decay loop — keeps marquee alive after scroll stops
    function decayLoop() {
      if (Math.abs(smoothVelocity) > 0.05) {
        smoothVelocity *= 0.88;   // friction factor
        applyMarquee(smoothVelocity);
      }
      requestAnimationFrame(decayLoop);
    }
    decayLoop();

    // ── Main update (called per rAF during scroll) ───────────────
    function updateAll() {
      ticking = false;

      // Smooth the raw velocity
      smoothVelocity += (rawVelocity - smoothVelocity) * 0.25;

      updateProgressBar();
      applyMarquee(smoothVelocity);
      applySpotlight();
    }

    // ── 1. GOLD PROGRESS BAR ─────────────────────────────────────
    function updateProgressBar() {
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.height = `${Math.min(progress, 100)}%`;
    }

    // ── 2. MARQUEE VELOCITY REACTIVE ─────────────────────────────
    function applyMarquee(velocity) {
      if (!marqueeTrack) return;

      const absVel  = Math.abs(velocity);
      // Base 28s → speeds up to 6s at high velocity
      const dur     = Math.max(6, 28 - absVel * 1.8);
      // Reverse direction when scrolling up
      const dir     = velocity >= 0 ? 'normal' : 'reverse';

      document.documentElement.style.setProperty('--marquee-dur', `${dur.toFixed(2)}s`);
      document.documentElement.style.setProperty('--marquee-dir', dir);
    }

    // ── 3. SPOTLIGHT SCALE on video frames ───────────────────────
    function applySpotlight() {
      const vpCenter = window.innerHeight / 2;

      videoFrames.forEach(frame => {
        const rect        = frame.getBoundingClientRect();
        const frameCenter = rect.top + rect.height / 2;
        const dist        = Math.abs(frameCenter - vpCenter);
        const maxDist     = window.innerHeight * 0.75;

        // 0 = edge of influence, 1 = perfectly centred
        const proximity   = Math.max(0, 1 - dist / maxDist);

        const scale       = 1 + proximity * 0.038;
        const shadowBlur  = 25 + proximity * 45;
        const shadowAlpha = 0.08 + proximity * 0.22;

        const media = frame.querySelector('video') || frame.querySelector('.film-slideshow-frame');
        if (!media) return;

        media.style.transform  = `scale(${scale.toFixed(4)})`;
        media.style.boxShadow  =
          `0 ${Math.round(shadowBlur * 0.55)}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha.toFixed(2)}),` +
          `0 0 ${Math.round(proximity * 40)}px rgba(197,155,39,${(proximity * 0.12).toFixed(2)})`;
      });
    }

    // Run once immediately to set initial state
    updateProgressBar();
    applySpotlight();
  }

  initLiveScrollEngine();

  // ============================================================
  // SMART HIDE HEADER ON SCROLL DOWN / SHOW ON SCROLL UP
  // ============================================================
  function initSmartHeaderHide() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleHeaderScroll() {
      const currentScrollY = window.scrollY;

      // Hide header when scrolling down past 80px
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add('header-hidden');
      } else {
        // Show header when scrolling up or near top
        header.classList.remove('header-hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleHeaderScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  initSmartHeaderHide();

  // ============================================================
  // SITE BACKGROUND BGM MUSIC PLAYER (INTEGRATED HEADER OPTION 1)
  // ============================================================
  const siteBgm = document.getElementById('site-bgm');
  const headerSoundBtn = document.getElementById('header-sound-btn');
  const soundBtnText = document.getElementById('sound-btn-text');
  let lastBgmToggleTime = 0;

  function updateSoundUI(isPlaying) {
    if (!headerSoundBtn || !soundBtnText) return;
    if (isPlaying) {
      headerSoundBtn.classList.remove('paused');
      headerSoundBtn.classList.add('playing');
      soundBtnText.textContent = 'SOUND ON';
    } else {
      headerSoundBtn.classList.remove('playing');
      headerSoundBtn.classList.add('paused');
      soundBtnText.textContent = 'SOUND OFF';
    }
  }

  function toggleSiteBgm() {
    if (!siteBgm) return;
    const now = Date.now();
    // Debounce to prevent double toggle on mobile touch + click events
    if (now - lastBgmToggleTime < 350) return;
    lastBgmToggleTime = now;

    siteBgm.volume = 0.15; // Non-intrusive 15% volume
    if (siteBgm.paused) {
      siteBgm.play().then(() => {
        updateSoundUI(true);
      }).catch(() => {
        updateSoundUI(false);
      });
    } else {
      siteBgm.pause();
      updateSoundUI(false);
    }
  }

  if (siteBgm) {
    siteBgm.addEventListener('play', () => updateSoundUI(true));
    siteBgm.addEventListener('pause', () => updateSoundUI(false));
  }

  document.addEventListener('click', toggleSiteBgm);
  document.addEventListener('touchend', toggleSiteBgm);
});

