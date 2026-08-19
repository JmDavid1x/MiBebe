/* =============================================================
   cumpleanos.js — Cuenta regresiva exacta al cumpleaños.
   Se actualiza cada segundo. Cuando llega el día, muestra
   el mensaje especial y lanza pétalos.
   ============================================================= */

(function () {
  'use strict';

  const C   = window.CONTENIDO || {};
  const cfg = C.cumpleanos;
  if (!cfg) return;

  /* ---- Calcula la próxima fecha de cumpleaños ---- */
  function proximoCumple() {
    const ahora = new Date();
    const anio  = ahora.getFullYear();
    // Medianoche del 31 de agosto
    const este  = new Date(anio, cfg.mes - 1, cfg.dia, 0, 0, 0, 0);
    // Si ya pasó este año, apunta al año siguiente
    return este > ahora ? este : new Date(anio + 1, cfg.mes - 1, cfg.dia, 0, 0, 0, 0);
  }

  /* ---- Aplica pulso visual cuando los segundos cambian ---- */
  function pulso(el) {
    el.classList.remove('pulso');
    void el.offsetWidth; // reflow forzado para reiniciar la animación
    el.classList.add('pulso');
    setTimeout(() => el.classList.remove('pulso'), 300);
  }

  /* ---- Actualiza los números en pantalla ---- */
  const elDias    = document.getElementById('cd-dias');
  const elHoras   = document.getElementById('cd-horas');
  const elMinutos = document.getElementById('cd-minutos');
  const elSegs    = document.getElementById('cd-segs');

  let ultimoSeg = -1;

  function actualizar() {
    const ahora    = new Date();
    const objetivo = proximoCumple();
    const diff     = objetivo - ahora;

    /* ── Es el cumpleaños ── */
    if (diff <= 0) {
      clearInterval(intervalo);
      mostrarCumpleanos();
      return;
    }

    const dias    = Math.floor(diff / 86400000);
    const horas   = Math.floor((diff % 86400000) / 3600000);
    const minutos = Math.floor((diff % 3600000)  / 60000);
    const segs    = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');

    if (elDias)    elDias.textContent    = pad(dias);
    if (elHoras)   elHoras.textContent   = pad(horas);
    if (elMinutos) elMinutos.textContent = pad(minutos);
    if (elSegs) {
      elSegs.textContent = pad(segs);
      if (segs !== ultimoSeg) {
        pulso(elSegs);
        if (segs === 0) {
          if (elMinutos) pulso(elMinutos);
        }
        ultimoSeg = segs;
      }
    }
  }

  /* ---- Modo cumpleaños: esconde el contador y celebra ---- */
  function mostrarCumpleanos() {
    const wrap  = document.querySelector('.cd-wrap');
    const panel = document.getElementById('cumple-activo');

    if (wrap)  { wrap.style.display  = 'none'; }
    if (panel) { panel.style.display = 'block'; }

    // Lluvia de pétalos y corazones
    if (window.lluviaDePetalos) window.lluviaDePetalos(120);

    // Corazones volando desde el centro de la sección
    const sec = document.getElementById('cumpleanos');
    if (sec) {
      const r = sec.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      for (let i = 0; i < 30; i++) {
        setTimeout(() => lanzarCorazon(cx, cy), i * 80);
      }
    }
  }

  function lanzarCorazon(cx, cy) {
    const el = document.createElement('div');
    el.className = 'corazon-vuela';
    el.textContent = Math.random() > .5 ? '❤' : '🌹';
    el.style.left  = cx + 'px';
    el.style.top   = cy + 'px';
    el.style.fontSize = (14 + Math.random() * 24) + 'px';
    el.style.color = `hsl(${340 + Math.random() * 20}, 85%, ${50 + Math.random() * 20}%)`;
    document.body.appendChild(el);

    const ang  = -Math.PI / 2 + (Math.random() - .5) * 2.6;
    const dist = 160 + Math.random() * 300;
    el.animate([
      { transform: 'translate(-50%,-50%) scale(.1)',
        opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px),
                               calc(-50% + ${Math.sin(ang) * dist}px)) scale(1.2)`,
        opacity: 0 }
    ], {
      duration: 1600 + Math.random() * 1200,
      easing: 'cubic-bezier(.16,.9,.3,1)'
    }).onfinish = () => el.remove();
  }

  /* ---- Arranca ---- */
  actualizar();
  const intervalo = setInterval(actualizar, 1000);

})();
