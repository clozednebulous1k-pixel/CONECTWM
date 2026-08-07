/**
 * Partículas estilo chat saindo dos 4 cantos 
 · tela de login
 */
(function initLoginCornerWeb() {
  function start() {
    const mount = document.getElementById('login-corner-web');
    if (!mount || mount.dataset.ready === '1') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.className = 'login-corner-web-canvas';
    mount.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    mount.dataset.ready = '1';

    const corners = [
      { id: 'tl', ox: 0, oy: 0, angle: Math.PI / 4 },
      { id: 'tr', ox: 1, oy: 0, angle: (3 * Math.PI) / 4 },
      { id: 'bl', ox: 0, oy: 1, angle: -Math.PI / 4 },
      { id: 'br', ox: 1, oy: 1, angle: (-3 * Math.PI) / 4 },
    ];

    let w = 0;
    let h = 0;
    let particles = [];
    let rafId = null;
    let cornerReach = 260;
    let pad = 28;
    let running = false;

    function anchor(c) {
      return {
        x: c.ox === 0 ? pad : w - pad,
        y: c.oy === 0 ? pad : h - pad,
      };
    }

    function roundRectPath(x, y, rw, rh, r) {
      const rad = Math.min(r, rw / 2, rh / 2);
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.lineTo(x + rw - rad, y);
      ctx.quadraticCurveTo(x + rw, y, x + rw, y + rad);
      ctx.lineTo(x + rw, y + rh - rad);
      ctx.quadraticCurveTo(x + rw, y + rh, x + rw - rad, y + rh);
      ctx.lineTo(x + rad, y + rh);
      ctx.quadraticCurveTo(x, y + rh, x, y + rh - rad);
      ctx.lineTo(x, y + rad);
      ctx.quadraticCurveTo(x, y, x + rad, y);
      ctx.closePath();
    }

    function spawnParticle(ci, burst) {
      const c = corners[ci];
      const { x: ax, y: ay } = anchor(c);
      const spread = Math.PI / 4;
      const angle = c.angle + (Math.random() - 0.5) * spread;
      const speed = burst ? 1.2 + Math.random() * 1.4 : 0.7 + Math.random() * 1.3;
      const isBubble = Math.random() > 0.55;

      particles.push({
        corner: ci,
        x: ax + (Math.random() - 0.5) * 8,
        y: ay + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.003 + Math.random() * 0.005,
        r: isBubble ? 2.5 + Math.random() * 2 : 1.5 + Math.random() * 2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        kind: isBubble ? 'bubble' : 'dot',
      });
    }

    function distFromCorner(p) {
      const { x: ax, y: ay } = anchor(corners[p.corner]);
      return Math.hypot(p.x - ax, p.y - ay);
    }

    function update(t) {
      corners.forEach((_, ci) => {
        if (Math.random() < 0.28) spawnParticle(ci, false);
      });

      particles = particles.filter((p) => {
        const wob = Math.sin(t * 0.001 * p.wobbleSpeed * 60 + p.wobble) * 0.25;
        p.x += p.vx + wob * 0.4;
        p.y += p.vy + Math.cos(t * 0.001 * p.wobbleSpeed * 60 + p.wobble) * 0.15;
        p.vx *= 0.996;
        p.vy *= 0.996;
        p.life -= p.decay;
        return p.life > 0 && distFromCorner(p) < cornerReach;
      });

      if (particles.length > 180) particles = particles.slice(-180);
    }

    function drawBracket(c, t) {
      const breathe = reduced ? 0 : Math.sin(t * 0.002 + (c.ox + c.oy) * 1.3) * 6;
      const len = 52 + breathe;
      const x = c.ox === 0 ? pad : w - pad;
      const y = c.oy === 0 ? pad : h - pad;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 14;
      ctx.beginPath();

      if (c.id === 'tl') {
        ctx.moveTo(x, y + len);
        ctx.lineTo(x, y);
        ctx.lineTo(x + len, y);
      } else if (c.id === 'tr') {
        ctx.moveTo(x - len, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + len);
      } else if (c.id === 'bl') {
        ctx.moveTo(x, y - len);
        ctx.lineTo(x, y);
        ctx.lineTo(x + len, y);
      } else {
        ctx.moveTo(x - len, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - len);
      }

      ctx.stroke();
      ctx.restore();
    }

    function drawEmitterGlow(c, t) {
      const { x, y } = anchor(c);
      const pulse = reduced ? 0.4 : 0.35 + Math.sin(t * 0.003 + c.angle) * 0.2;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 40);
      g.addColorStop(0, `rgba(56, 189, 248, ${pulse})`);
      g.addColorStop(0.45, 'rgba(14, 165, 233, 0.18)');
      g.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticle(p) {
      const dist = distFromCorner(p);
      const distFade = 1 - dist / cornerReach;
      const alpha = Math.max(0, p.life * distFade);
      if (alpha <= 0.03) return;

      const tailX = p.x - p.vx * 8;
      const tailY = p.y - p.vy * 8;
      const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(1, `rgba(125, 211, 252, ${alpha * 0.75})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = p.kind === 'bubble' ? 2.5 : 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.kind === 'bubble') {
        const bw = p.r * 3;
        const bh = p.r * 1.6;
        ctx.save();
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.3})`;
        ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.85})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
        ctx.shadowBlur = 10;
        roundRectPath(p.x - bw / 2, p.y - bh / 2, bw, bh, bh / 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      corners.forEach((c) => drawEmitterGlow(c, t));
      particles.forEach(drawParticle);
      corners.forEach((c) => drawBracket(c, t));
    }

    function burstSeed() {
      corners.forEach((_, ci) => {
        for (let i = 0; i < 8; i++) spawnParticle(ci, true);
      });
    }

    function resize() {
      const rect = mount.getBoundingClientRect();
      const nextW = rect.width;
      const nextH = rect.height;
      if (nextW < 2 || nextH < 2) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = nextW;
      h = nextH;
      cornerReach = Math.min(280, Math.max(w, h) * 0.32);
      pad = Math.max(20, Math.min(w, h) * 0.035);

      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!running) {
        burstSeed();
        running = true;
      }
      return true;
    }

    function loop(t) {
      if (w > 0 && h > 0) {
        if (!reduced) update(t);
        draw(t);
      }
      rafId = requestAnimationFrame(loop);
    }

    function tryStart() {
      if (resize()) {
        if (!rafId) rafId = requestAnimationFrame(loop);
        return true;
      }
      return false;
    }

    tryStart();
    if (!running) {
      const retry = setInterval(() => {
        if (tryStart()) clearInterval(retry);
      }, 200);
      setTimeout(() => clearInterval(retry), 8000);
    }

    const ro = new ResizeObserver(() => tryStart());
    ro.observe(mount);
    window.addEventListener('resize', tryStart);

    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
