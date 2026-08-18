/* =============================================================
   rosa.js — Una rosa roja dibujada con matemáticas.
   Crece el tallo, brotan las hojas y la flor se abre
   pétalo por pétalo. Después respira, para siempre.
   ============================================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('rosa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CAPAS = 6;            // capas de pétalos
  const DURACION = 5200;      // ms que tarda en florecer
  let W = 0, H = 0, DPR = 1;
  let inicio = null;
  let chispas = [];

  /* ---------- utilidades ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const suave = t => t * t * (3 - 2 * t);                    // smoothstep
  const salida = t => 1 - Math.pow(1 - t, 3);                // easeOutCubic

  function medir() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* ---------- chispas de luz alrededor de la flor ---------- */
  function crearChispas() {
    chispas = [];
    const n = W < 640 ? 26 : 46;
    for (let i = 0; i < n; i++) {
      chispas.push({
        a: Math.random() * Math.PI * 2,
        r: 60 + Math.random() * (Math.min(W, H) * 0.42),
        vel: (Math.random() - 0.5) * 0.0016,
        tam: Math.random() * 1.6 + 0.4,
        fase: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 60
      });
    }
  }

  /* ---------- un pétalo ---------- */
  function petalo(ang, dist, ancho, alto, curva, relleno, borde) {
    ctx.save();
    ctx.rotate(ang);
    ctx.translate(0, -dist);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( ancho * 0.9, -alto * 0.12,  ancho * curva, -alto * 0.86, 0, -alto);
    ctx.bezierCurveTo(-ancho * curva, -alto * 0.86, -ancho * 0.9, -alto * 0.12, 0, 0);
    ctx.closePath();
    ctx.fillStyle = relleno;
    ctx.fill();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = borde;
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- el tallo, con hojas y espinas ---------- */
  function tallo(cx, cy, largo, p) {
    if (p <= 0) return;
    const fin = cy + largo;
    const y = cy + largo * (1 - p);   // crece de abajo hacia arriba

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(46, 84, 46, .9)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(cx, fin);
    // curva suave del tallo
    for (let t = 0; t <= 1.001; t += 0.02) {
      const yy = fin - largo * t;
      if (yy < y) break;
      ctx.lineTo(cx + Math.sin(t * 2.4) * 7, yy);
    }
    ctx.stroke();

    // brillo del tallo
    ctx.strokeStyle = 'rgba(120, 175, 110, .35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // hojas
    [0.34, 0.6].forEach((h, i) => {
      const t = clamp((p - h) / 0.22, 0, 1);
      if (t <= 0) return;
      const yy = fin - largo * h;
      const lado = i === 0 ? 1 : -1;
      const L = 46 * salida(t), A = 17 * salida(t);
      ctx.save();
      ctx.translate(cx + Math.sin(h * 2.4) * 7, yy);
      ctx.rotate(lado * (0.75 + Math.sin(h * 3) * 0.1));
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(L * 0.5,  A, L, 0);
      ctx.quadraticCurveTo(L * 0.5, -A, 0, 0);
      const g = ctx.createLinearGradient(0, 0, L, 0);
      g.addColorStop(0, 'rgba(40, 78, 40, .95)');
      g.addColorStop(1, 'rgba(88, 138, 74, .8)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(150,190,140,.28)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(L, 0);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  /* ---------- la flor ---------- */
  function flor(cx, cy, escala, p, t) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(cx, cy);
    // respiración leve cuando ya está abierta
    const respira = 1 + Math.sin(t / 1600) * 0.012 * p;
    ctx.scale(escala * respira, escala * respira);
    ctx.rotate(Math.sin(t / 5200) * 0.02);

    // resplandor
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
    glow.addColorStop(0, `rgba(255, 45, 77, ${0.16 * p})`);
    glow.addColorStop(1, 'rgba(255, 45, 77, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();

    // sépalos verdes detrás
    const sp = clamp(p * 1.4, 0, 1);
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.globalAlpha = sp * 0.9;
      petalo(
        (i / 5) * Math.PI * 2 + 0.3, 6 * sp, 12 * sp, 78 * sp, 0.35,
        'rgba(44, 82, 44, .85)', 'rgba(0,0,0,.2)'
      );
      ctx.restore();
    }

    // capas de pétalos: de afuera hacia adentro
    for (let capa = CAPAS - 1; capa >= 0; capa--) {
      const retraso = (CAPAS - 1 - capa) * 0.09;
      const lp = suave(clamp((p - retraso) / 0.55, 0, 1));
      if (lp <= 0) continue;

      const n = 5 + capa * 2;                       // pétalos por capa
      const k = capa / (CAPAS - 1);                 // 0 = centro, 1 = borde
      const dist = (4 + k * 30) * lp;
      const alto = (24 + k * 62) * lp;
      const ancho = (16 + k * 34) * lp;
      const giro = capa * 0.42 + Math.sin(t / 7000 + capa) * 0.01;
      const apertura = 0.55 + k * 0.5;

      for (let i = 0; i < n; i++) {
        const ang = giro + (i / n) * Math.PI * 2;
        // sombra hacia el centro: más oscuro adentro, más vivo afuera
        const l1 = 22 + k * 26;
        const l2 = 34 + k * 30;
        const g = ctx.createLinearGradient(0, 0, 0, -alto);
        g.addColorStop(0, `hsl(350, 88%, ${l1}%)`);
        g.addColorStop(0.55, `hsl(352, 90%, ${l2}%)`);
        g.addColorStop(1, `hsl(355, 92%, ${l2 + 12}%)`);
        petalo(ang, dist, ancho, alto, apertura, g, 'rgba(40, 0, 6, .35)');
      }
    }

    // corazón de la rosa
    ctx.beginPath();
    ctx.arc(0, 0, 9 * p, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(348, 90%, 16%, ${p})`;
    ctx.fill();

    ctx.restore();
  }

  /* ---------- chispas ---------- */
  function dibujarChispas(cx, cy, t, p) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const c of chispas) {
      c.a += c.vel;
      const brillo = (Math.sin(t / 900 + c.fase) * 0.5 + 0.5) * p;
      const x = cx + Math.cos(c.a) * c.r;
      const y = cy + Math.sin(c.a) * c.r * 0.55 + c.y;
      ctx.beginPath();
      ctx.arc(x, y, c.tam, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 190, 200, ${0.5 * brillo})`;
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- bucle ---------- */
  function cuadro(ts) {
    if (inicio === null) inicio = ts;
    const t = ts - inicio;

    ctx.clearRect(0, 0, W, H);

    const base = Math.min(W, H);
    const escala = clamp(base / 640, 0.45, 1.05);
    const cx = W / 2;
    const cy = H * 0.28;
    const largoTallo = H * 0.32;

    const avance = clamp(t / DURACION, 0, 1);
    const pTallo = suave(clamp(avance / 0.34, 0, 1));
    const pFlor  = clamp((avance - 0.22) / 0.78, 0, 1);

    tallo(cx, cy, largoTallo, pTallo);
    flor(cx, cy, escala, pFlor, t);
    dibujarChispas(cx, cy, t, pFlor);

    requestAnimationFrame(cuadro);
  }

  function iniciar() {
    medir();
    crearChispas();
    requestAnimationFrame(cuadro);
  }

  let temporizador;
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { medir(); crearChispas(); }, 150);
  });

  iniciar();
})();
