/**
 * Texto CONECTWM → monta ao carregar, vira partículas no hover
 */
(function initLoginBrandParticles() {
  const root = document.getElementById('login-brand-particles');
  if (!root) return;

  const TEXT = root.dataset.text || 'CONECTWM';
  const SPLIT = Number(root.dataset.split || 6);
  const COLOR_A = root.dataset.colorA || '#ffffff';
  const COLOR_B = root.dataset.colorB || '#38bdf8';
  const FONT = '800 {size}px Syne, "Space Grotesk", sans-serif';

  const canvas = document.createElement('canvas');
  canvas.className = 'login-brand-particles-canvas';
  root.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const measureCtx = document.createElement('canvas').getContext('2d');

  let particles = [];
  let width = 0;
  let height = 0;
  let fontSize = 72;
  let dispersed = false;
  let introDone = false;
  let mouse = { x: 0, y: 0, active: false };
  let rafId = null;
  let startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function measureTextWidth(size) {
    measureCtx.font = FONT.replace('{size}', String(size));
    return measureCtx.measureText(TEXT).width;
  }

  function fitFontSize(availableWidth, availableHeight) {
    const maxW = availableWidth * 0.92;
    const maxH = availableHeight * 0.72;
    let size = Math.min(110, Math.floor(maxW / (TEXT.length * 0.58)));
    while (size > 36) {
      const textW = measureTextWidth(size);
      const textH = size * 1.05;
      if (textW <= maxW && textH <= maxH) return size;
      size -= 1;
    }
    return 36;
  }

  function sampleTextParticles() {
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');
    off.width = width;
    off.height = height;

    octx.font = FONT.replace('{size}', String(fontSize));
    octx.textBaseline = 'middle';
    octx.textAlign = 'left';

    const conectPart = TEXT.slice(0, SPLIT);
    const wmPart = TEXT.slice(SPLIT);
    const fullWidth = octx.measureText(TEXT).width;
    const startX = Math.max(12, (width - fullWidth) / 2);
    const cy = height / 2;

    octx.fillStyle = COLOR_A;
    octx.fillText(conectPart, startX, cy);
    octx.fillStyle = COLOR_B;
    octx.fillText(wmPart, startX + octx.measureText(conectPart).width, cy);

    const img = octx.getImageData(0, 0, width, height);
    const data = img.data;
    const step = 3;
    const next = [];
    const fromIntro = !introDone;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 140) continue;

        next.push({
          ox: x,
          oy: y,
          x: fromIntro ? width / 2 + (Math.random() - 0.5) * width : x,
          y: fromIntro ? height / 2 + (Math.random() - 0.5) * height * 1.5 : y,
          vx: 0,
          vy: 0,
          color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
          size: 2,
          introDelay: fromIntro ? Math.random() * 0.35 : 0,
        });
      }
    }

    particles = next;
  }

  function resize() {
    const stage = root.closest('.login-brand-stage') || root.parentElement;
    const stageWidth = stage?.clientWidth || root.getBoundingClientRect().width || 640;
    const stageHeight = 220;

    width = Math.max(Math.floor(stageWidth), 280);
    fontSize = fitFontSize(width, stageHeight);
    height = Math.max(Math.floor(fontSize * 1.35) + 32, 110);

    root.style.height = `${height}px`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const keepIntro = introDone;
    sampleTextParticles();
    if (keepIntro) {
      particles.forEach((p) => {
        p.x = p.ox;
        p.y = p.oy;
      });
    }
  }

  function disperse() {
    if (!introDone) return;
    dispersed = true;
    particles.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 1.5 + Math.random() * 3;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
    });
  }

  function reassemble() {
    dispersed = false;
    mouse.active = false;
    particles.forEach((p) => {
      p.vx = 0;
      p.vy = 0;
    });
  }

  function tick(now) {
    if (!introDone && now - startTime >= 1400) introDone = true;

    ctx.clearRect(0, 0, width, height);
    const globalIntro = introDone ? 1 : easeOutCubic(Math.min(1, (now - startTime) / 1400));

    particles.forEach((p) => {
      if (!introDone) {
        const t = easeOutCubic(Math.max(0, Math.min(1, (globalIntro - p.introDelay) / (1 - p.introDelay))));
        p.x += (p.ox - p.x) * (0.06 + t * 0.14);
        p.y += (p.oy - p.y) * (0.06 + t * 0.14);
      } else if (dispersed) {
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 90) {
            const force = (90 - dist) / 90;
            p.vx += (dx / dist) * force * 0.5;
            p.vy += (dy / dist) * force * 0.5;
          }
        }
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      } else {
        p.vx = (p.ox - p.x) * 0.2;
        p.vy = (p.oy - p.y) * 0.2;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.ox - p.x) < 0.5) p.x = p.ox;
        if (Math.abs(p.oy - p.y) < 0.5) p.y = p.oy;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = requestAnimationFrame(tick);
  }

  canvas.addEventListener('mouseenter', disperse);
  canvas.addEventListener('mouseleave', reassemble);
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  function boot() {
    resize();
    startTime = performance.now();
    introDone = false;
    sampleTextParticles();
    cancelAnimationFrame(rafId);
    tick(startTime);
  }

  window.addEventListener('resize', () => {
    if (introDone) resize();
    else boot();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(boot);
  } else {
    setTimeout(boot, 100);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else tick(performance.now());
  });
})();
