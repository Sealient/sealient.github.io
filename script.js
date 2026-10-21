document.addEventListener('DOMContentLoaded', () => {

  // Native Seamless Page Load Ignition
  setTimeout(() => {
    document.body.classList.remove('page-entering');
    document.body.classList.add('page-loaded');
  }, 60);

  // Mouse-Reactive Background Glow Tracker
  const mouseGlow = document.getElementById('mouse-glow');
  window.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }
  });

  // Web Audio API Sound Synthesizer
  let sfxEnabled = false;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSynthSound(freq = 440, type = 'square', duration = 0.08) {
    if (!sfxEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Navigation Laser Split Sound Effect
  function playCinematicSplitSound() {
    if (!sfxEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.35);
      
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    } catch (e) {}
  }

  const sfxBtn = document.getElementById('sfx-toggle');
  if (sfxBtn) {
    const sfxIcon = document.getElementById('sfx-icon');
    const sfxText = document.getElementById('sfx-text');

    sfxBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        sfxIcon.className = 'fa-solid fa-volume-high text-accent';
        sfxText.textContent = 'SFX: ON';
        playSynthSound(880, 'square', 0.1);
      } else {
        sfxIcon.className = 'fa-solid fa-volume-xmark text-neutral-500';
        sfxText.textContent = 'SFX: OFF';
      }
    });
  }

  // NAVIGATION TRANSITION INTERCEPTOR
  const portalLinks = document.querySelectorAll('.portal-link');
  
  portalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      e.preventDefault();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      document.body.classList.add('curtain-active', 'flash-active');
      playCinematicSplitSound();

      setTimeout(() => {
        window.location.href = href;
      }, 620);
    });
  });

});