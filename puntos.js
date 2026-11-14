/* ==========================================================
   puntos.js — Sistema de puntos GLOBAL
   Se carga en TODAS las páginas (después de idioma.js y antes de
   los scripts de los juegos). Guarda los puntos en localStorage para
   que se acumulen entre juegos y entre visitas.

   Uso desde un juego nuevo:
     Puntos.add(50, 'mi-juego');   // suma puntos
     Puntos.sub(20, 'mi-juego');   // resta puntos (nunca baja de 0)
     Puntos.total();               // puntos de todos los juegos
     Puntos.juego('mi-juego');     // puntos de un solo juego

   En el HTML:
     <span data-puntos-global></span>          -> total global
     <span data-puntos-juego="trivia"></span>  -> puntos de un juego

   Juegos embebidos en un <iframe> (cohete y rompecabezas):
     La página contenedora llama  Puntos.conectarMarco(iframe, 'id-del-juego')
     y el juego del iframe envía los puntos con:
       parent.postMessage({ type: 'puntos', n: 100 }, '*');
   ========================================================== */
(function (w) {
  'use strict';

  var KEY = 'misionesOlvidadas.puntos.v1';
  var MAX_POR_MENSAJE = 1000;   // tope de seguridad para los juegos embebidos
  var ultimoTotal = null;

  function vacio() { return { porJuego: {}, misiones: {} }; }

  function cargar() {
    try {
      var r = JSON.parse(w.localStorage.getItem(KEY));
      if (r && typeof r === 'object') {
        return { porJuego: r.porJuego || {}, misiones: r.misiones || {} };
      }
    } catch (e) { /* sin almacenamiento: se usa memoria */ }
    return vacio();
  }

  var data = cargar();

  function fmt(n) {
    var loc = (w.Idioma && w.Idioma.locale) ? w.Idioma.locale() : 'es-MX';
    return Number(n).toLocaleString(loc);
  }

  function total() {
    return Object.keys(data.porJuego).reduce(function (s, k) { return s + (data.porJuego[k] || 0); }, 0);
  }

  function juego(id) { return data.porJuego[id] || 0; }

  function pintar() {
    var t = total();
    document.querySelectorAll('[data-puntos-global]').forEach(function (el) {
      el.textContent = fmt(t);
      if (ultimoTotal !== null && ultimoTotal !== t) {
        var chip = el.closest('.pts-chip') || el;
        chip.classList.remove('bump');
        void chip.offsetWidth;
        chip.classList.add('bump');
      }
    });
    document.querySelectorAll('[data-puntos-juego]').forEach(function (el) {
      el.textContent = fmt(juego(el.getAttribute('data-puntos-juego')));
    });
    ultimoTotal = t;
  }

  function guardar() {
    try { w.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignorar */ }
    pintar();
  }

  w.Puntos = {
    total: total,
    juego: juego,
    refrescar: pintar,
    add: function (n, id) {
      id = id || 'general';
      data.porJuego[id] = Math.max(0, juego(id) + Math.round(n));
      guardar();
    },
    sub: function (n, id) {
      id = id || 'general';
      data.porJuego[id] = Math.max(0, juego(id) - Math.round(n));
      guardar();
    },
    /* Misiones ya completadas (evita ganar puntos repetidos al recargar) */
    misionHecha: function (id) { return !!data.misiones[id]; },
    marcarMision: function (id) { data.misiones[id] = true; guardar(); },
    borrarMision: function (id) { delete data.misiones[id]; guardar(); },
    /* Reinicia solo un juego (sus puntos y misiones) */
    reiniciarJuego: function (id) {
      data.porJuego[id] = 0;
      if (id === 'rescate') data.misiones = {};
      guardar();
    },
    reiniciarTodo: function () { data = vacio(); guardar(); },

    /* Carga un juego dentro de un <iframe data-src="..."> y recibe sus puntos */
    conectarMarco: function (frame, id) {
      if (!frame) return;
      var lang = (w.Idioma && w.Idioma.lang) ? w.Idioma.lang : 'es';
      var src = frame.getAttribute('data-src');
      frame.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'lang=' + lang;
      w.addEventListener('message', function (e) {
        if (e.source !== frame.contentWindow) return;      // solo mensajes de ESE iframe
        var d = e.data;
        if (!d || d.type !== 'puntos') return;
        var n = Number(d.n);
        if (!isFinite(n) || n <= 0 || n > MAX_POR_MENSAJE) return;
        w.Puntos.add(n, id);
      });
    }
  };

  /* Sincroniza entre pestañas */
  w.addEventListener('storage', function (e) {
    if (e.key === KEY) { data = cargar(); pintar(); }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pintar);
  else pintar();
})(window);
