/* =============================================================
   app.js — Arma la página con los textos de contenido.js,
   revela las secciones al bajar y maneja las tarjetas.
   ============================================================= */

(function () {
  'use strict';

  const C = window.CONTENIDO || {};
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ---------- 1. Textos ---------- */
  function pintarTextos() {
    if (C.hero) {
      $('.saludo').textContent = C.hero.saludo;
      $('.titulo-hero').textContent = C.hero.titulo;
      $('.subtitulo').textContent = C.hero.subtitulo;
      $('.scroll-hint span').textContent = C.hero.scroll;
      document.title = `${C.hero.saludo} ${C.hero.titulo} ❤`;
    }

    if (C.carta) {
      $('#carta .titulo-seccion').textContent = C.carta.titulo;
      const cont = $('#carta-parrafos');
      C.carta.parrafos.forEach((txt, i) => {
        const p = document.createElement('p');
        p.textContent = txt;
        p.setAttribute('data-rev', '');
        p.style.transitionDelay = (0.12 * i) + 's';
        cont.appendChild(p);
      });
      $('#carta .firma').textContent = C.firma || '';
    }

    if (C.cancion) {
      $('#cancion .titulo-seccion').textContent = C.cancion.titulo;
      $('#cancion .cancion-descripcion').textContent = C.cancion.descripcion;
      $('#cancion .cancion-artista').textContent = C.cancion.artista;
      $('#cancion .cancion-titulo-track').textContent = C.cancion.track;
    }

    if (C.razones) {
      $('#razones .titulo-seccion').textContent = C.razones.titulo;
      $('#razones .pista').textContent = C.razones.subtitulo;
      const cont = $('#tarjetas');
      C.razones.tarjetas.forEach((t, i) => {
        const b = document.createElement('button');
        b.className = 'tarjeta';
        b.type = 'button';
        b.setAttribute('data-rev', '');
        b.style.transitionDelay = (0.08 * i) + 's';
        b.innerHTML =
          '<div class="tarjeta-inner">' +
            '<div class="cara cara-frente"><span class="flor">🌹</span><span></span></div>' +
            '<div class="cara cara-atras"><span></span></div>' +
          '</div>';
        b.querySelector('.cara-frente span:last-child').textContent = t.frente;
        b.querySelector('.cara-atras span').textContent = t.reverso;
        b.addEventListener('click', () => b.classList.toggle('volteada'));
        cont.appendChild(b);
      });
    }

    if (C.jardin) {
      $('#jardin .titulo-seccion').textContent = C.jardin.titulo;
      $('#jardin .pista').textContent = C.jardin.subtitulo;
    }

    if (C.final) {
      $('.titulo-final').textContent = C.final.titulo;
      $('.texto-final').textContent = C.final.texto;
      $('#btn-final').textContent = C.final.boton;
      $('.firma-final').textContent = C.firma || '';
    }
  }

  /* ---------- 2. Revelar al bajar ---------- */
  function revelar() {
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

    $$('[data-rev]').forEach(el => obs.observe(el));
    // el hero se revela solo, con su propio retraso
    $$('#inicio [data-rev]').forEach(el => {
      obs.unobserve(el);
      el.classList.add('visible');
    });
  }

  /* ---------- 3. Máquina de escribir para la frase ---------- */
  function escribir() {
    const destino = $('#frase-texto');
    if (!destino || !C.carta) return;
    const texto = C.carta.frase;
    let i = 0, corriendo = false;

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function paso() {
      if (i <= texto.length) {
        destino.textContent = texto.slice(0, i);
        destino.appendChild(cursor);
        i++;
        setTimeout(paso, texto[i - 1] === ',' || texto[i - 1] === '.' ? 280 : 34);
      } else {
        setTimeout(() => cursor.remove(), 1400);
      }
    }

    const obs = new IntersectionObserver(en => {
      if (en[0].isIntersecting && !corriendo) { corriendo = true; paso(); }
    }, { threshold: 0.5 });
    obs.observe(destino);
  }

  /* ---------- 4. Botón final: corazones y pétalos ---------- */
  function botonFinal() {
    const btn = $('#btn-final');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (window.lluviaDePetalos) window.lluviaDePetalos(70);

      const r = btn.getBoundingClientRect();
      for (let i = 0; i < 22; i++) {
        const c = document.createElement('div');
        c.className = 'corazon-vuela';
        c.textContent = '❤';
        c.style.left = (r.left + r.width / 2) + 'px';
        c.style.top  = (r.top + r.height / 2) + 'px';
        c.style.fontSize = (12 + Math.random() * 22) + 'px';
        c.style.color = `hsl(${348 + Math.random() * 12}, 90%, ${45 + Math.random() * 25}%)`;
        document.body.appendChild(c);

        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
        const dist = 140 + Math.random() * 260;
        c.animate([
          { transform: 'translate(-50%,-50%) scale(.2) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(1.1) rotate(${(Math.random() - .5) * 200}deg)`, opacity: 0 }
        ], { duration: 1500 + Math.random() * 1100, easing: 'cubic-bezier(.16,.9,.3,1)' })
         .onfinish = () => c.remove();
      }

      const corazon = $('#corazon');
      if (corazon) {
        corazon.style.animation = 'none';
        void corazon.offsetWidth;
        corazon.style.animation = 'latir .7s ease-in-out 4';
        setTimeout(() => { corazon.style.animation = 'latir 1.5s ease-in-out infinite'; }, 2900);
      }
    });
  }

  pintarTextos();
  revelar();
  escribir();
  botonFinal();
})();
