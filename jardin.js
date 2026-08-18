/* =============================================================
   jardin.js — Toca la pantalla y nace una rosa con un mensaje.
   ============================================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('jardin-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const btnLimpiar = document.getElementById('limpiar-jardin');

  let W = 0, H = 0, DPR = 1;
  let flores = [];
  let luciernagas = [];
  let indiceMensaje = 0;

  const MENSAJES = (window.CONTENIDO && CONTENIDO.jardin && CONTENIDO.jardin.mensajes) || ['Te amo'];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const salida = t => 1 - Math.pow(1 - t, 3);

  function medir() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    crearLuciernagas();
  }

  function crearLuciernagas() {
    const n = W < 640 ? 14 : 26;
    luciernagas = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      fase: Math.random() * Math.PI * 2
    }));
  }

  function sembrar(x, y) {
    if (flores.length > 70) flores.shift();
    flores.push({
      x, y,
      nace: performance.now(),
      alto: 42 + Math.random() * 58,
      escala: 0.55 + Math.random() * 0.6,
      giro: Math.random() * Math.PI * 2,
      tono: 344 + Math.random() * 14,
      mensaje: MENSAJES[indiceMensaje++ % MENSAJES.length],
      inclina: (Math.random() - 0.5) * 0.28
    });
  }

  function dibujarFlor(f, t) {
    const edad = (t - f.nace) / 1400;
    const p = salida(clamp(edad, 0, 1));
    if (p <= 0) return;

    const balanceo = Math.sin(t / 1300 + f.x) * 0.045;
    const alto = f.alto * p;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.inclina + balanceo);

    // tallo
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, -alto * 0.55, 0, -alto);
    ctx.strokeStyle = 'rgba(70, 120, 66, .75)';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // hojita
    if (p > 0.45) {
      const hp = clamp((p - 0.45) / 0.55, 0, 1);
      ctx.beginPath();
      ctx.moveTo(2, -alto * 0.5);
      ctx.quadraticCurveTo(14 * hp, -alto * 0.58, 20 * hp, -alto * 0.44);
      ctx.quadraticCurveTo(12 * hp, -alto * 0.4, 2, -alto * 0.5);
      ctx.fillStyle = 'rgba(64, 112, 60, .7)';
      ctx.fill();
    }

    // flor
    ctx.translate(0, -alto);
    ctx.rotate(f.giro);
    const s = f.escala * p;
    for (let capa = 2; capa >= 0; capa--) {
      const n = 5 + capa * 2;
      const k = capa / 2;
      const r = (5 + k * 12) * s;
      const a = (7 + k * 7) * s;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + capa * 0.5;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.7, a * 0.62, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${f.tono}, 88%, ${28 + k * 22}%, .95)`;
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.beginPath();
    ctx.arc(0, 0, 3.2 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(46, 90%, 62%, .9)';
    ctx.fill();

    // resplandor
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 40 * s);
    g.addColorStop(0, `hsla(${f.tono}, 90%, 55%, .16)`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 40 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // mensaje flotante durante los primeros segundos
    const vida = (t - f.nace) / 3800;
    if (vida < 1) {
      const alfa = vida < 0.2 ? vida / 0.2 : 1 - (vida - 0.2) / 0.8;
      ctx.save();
      ctx.globalAlpha = clamp(alfa, 0, 1);
      ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd9de';
      ctx.shadowColor = 'rgba(255,45,77,.9)';
      ctx.shadowBlur = 14;
      ctx.fillText(f.mensaje, f.x, f.y - f.alto - 26 - vida * 22);
      ctx.restore();
    }
  }

  function cuadro(t) {
    ctx.clearRect(0, 0, W, H);

    // luciérnagas
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const l of luciernagas) {
      l.x += l.vx; l.y += l.vy;
      if (l.x < 0) l.x = W; if (l.x > W) l.x = 0;
      if (l.y < 0) l.y = H; if (l.y > H) l.y = 0;
      const b = Math.sin(t / 700 + l.fase) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 170, 185, ${0.35 * b})`;
      ctx.fill();
    }
    ctx.restore();

    for (const f of flores) dibujarFlor(f, t);
    requestAnimationFrame(cuadro);
  }

  /* --- interacción --- */
  function punto(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  canvas.addEventListener('click', e => { const p = punto(e); sembrar(p.x, p.y); });
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const p = punto(e);
    sembrar(p.x, p.y);
  }, { passive: false });

  if (btnLimpiar) btnLimpiar.addEventListener('click', () => { flores = []; indiceMensaje = 0; });

  /* Siembra unas cuantas sola, para que no se vea vacío */
  let sembrado = false;
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (en.isIntersecting && !sembrado) {
        sembrado = true;
        [0.18, 0.4, 0.62, 0.84].forEach((fx, i) => {
          setTimeout(() => sembrar(W * fx, H * (0.68 + Math.random() * 0.2)), i * 420);
        });
      }
    });
  }, { threshold: 0.35 });
  obs.observe(canvas);

  let temporizador;
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(medir, 150);
  });

  medir();
  requestAnimationFrame(cuadro);
})();
