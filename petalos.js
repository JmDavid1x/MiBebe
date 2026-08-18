/* =============================================================
   petalos.js — Lluvia suave de pétalos rojos en todo el fondo.
   ============================================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('petalos');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, DPR = 1;
  let petalos = [];
  let extra = [];   // ráfaga temporal (botón "te amo")

  function medir() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function nuevo(y) {
    return {
      x: Math.random() * W,
      y: y !== undefined ? y : -20 - Math.random() * H,
      tam: 6 + Math.random() * 11,
      vy: 0.35 + Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.5,
      giro: Math.random() * Math.PI * 2,
      vgiro: (Math.random() - 0.5) * 0.022,
      vaiven: Math.random() * Math.PI * 2,
      alfa: 0.25 + Math.random() * 0.45,
      tono: 348 + Math.random() * 10,
      luz: 32 + Math.random() * 22
    };
  }

  function crear() {
    const n = W < 640 ? 22 : 40;
    petalos = Array.from({ length: n }, () => nuevo());
  }

  function forma(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.giro);
    ctx.scale(1, 0.55 + Math.sin(p.vaiven) * 0.4);   // efecto de girar en el aire
    ctx.beginPath();
    ctx.moveTo(0, -p.tam);
    ctx.bezierCurveTo( p.tam,  -p.tam * 0.5,  p.tam * 0.75, p.tam * 0.75, 0, p.tam);
    ctx.bezierCurveTo(-p.tam * 0.75, p.tam * 0.75, -p.tam, -p.tam * 0.5, 0, -p.tam);
    ctx.closePath();
    ctx.fillStyle = `hsla(${p.tono}, 85%, ${p.luz}%, ${p.alfa})`;
    ctx.fill();
    ctx.restore();
  }

  function mover(p, dt) {
    p.vaiven += 0.02 * dt;
    p.y += p.vy * dt;
    p.x += (p.vx + Math.sin(p.vaiven) * 0.5) * dt;
    p.giro += p.vgiro * dt;
  }

  let ultimo = 0;
  function cuadro(ts) {
    const dt = Math.min((ts - ultimo) / 16.67, 3) || 1;
    ultimo = ts;

    ctx.clearRect(0, 0, W, H);

    for (const p of petalos) {
      mover(p, dt);
      if (p.y - p.tam > H) Object.assign(p, nuevo(-20));
      if (p.x < -40) p.x = W + 40;
      if (p.x > W + 40) p.x = -40;
      forma(p);
    }

    for (let i = extra.length - 1; i >= 0; i--) {
      const p = extra[i];
      mover(p, dt);
      p.alfa -= 0.0035 * dt;
      if (p.alfa <= 0 || p.y - p.tam > H) { extra.splice(i, 1); continue; }
      forma(p);
    }

    requestAnimationFrame(cuadro);
  }

  /* Ráfaga: se usa desde app.js cuando ella presiona el botón */
  window.lluviaDePetalos = function (cantidad) {
    for (let i = 0; i < (cantidad || 60); i++) {
      const p = nuevo(-Math.random() * H * 0.6);
      p.vy *= 2.1;
      p.alfa = 0.5 + Math.random() * 0.5;
      extra.push(p);
    }
  };

  let temporizador;
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { medir(); crear(); }, 150);
  });

  medir();
  crear();
  requestAnimationFrame(cuadro);
})();
