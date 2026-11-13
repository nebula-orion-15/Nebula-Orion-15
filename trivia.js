/* ==========================================================
   trivia.js — Lógica del juego de trivia
   Las preguntas y los ajustes se editan en preguntas.js
   ========================================================== */
(function () {
  'use strict';

  var CFG = Object.assign({
    numPreguntas: 10, tiempoMin: 5, tiempoMax: 60, tiempoDefecto: 15,
    puntosAcierto: 50, bonoRapidez: 25, segundosPeligro: 5
  }, window.TRIVIA_CONFIG || {});

  function valida(q) {
    return q && q.pregunta && q.correcta && Array.isArray(q.incorrectas) && q.incorrectas.length >= 1;
  }
  var BANCO = (window.PREGUNTAS_TRIVIA || []).filter(valida);
  var LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function $(id) { return document.getElementById(id); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var S = null;          // estado de la partida
  var tiempoElegido = CFG.tiempoDefecto;

  /* ---------- Pantalla de ajustes ---------- */
  var rango = $('tiempo');
  var rangoVal = $('tiempo-val');

  function fijarTiempo(v) {
    tiempoElegido = Math.max(CFG.tiempoMin, Math.min(CFG.tiempoMax, Number(v)));
    rango.value = tiempoElegido;
    rangoVal.textContent = tiempoElegido + ' s';
    document.querySelectorAll('.preset').forEach(function (b) {
      b.classList.toggle('on', Number(b.dataset.t) === tiempoElegido);
    });
  }

  rango.min = CFG.tiempoMin;
  rango.max = CFG.tiempoMax;
  rango.step = 1;
  rango.addEventListener('input', function () { fijarTiempo(rango.value); });
  document.querySelectorAll('.preset').forEach(function (b) {
    b.addEventListener('click', function () { fijarTiempo(b.dataset.t); });
  });
  fijarTiempo(tiempoElegido);

  var nPreg = Math.min(CFG.numPreguntas, BANCO.length);
  $('info-num').textContent = nPreg;
  $('info-banco').textContent = BANCO.length;
  $('info-pts').textContent = CFG.puntosAcierto;
  $('info-bono').textContent = CFG.bonoRapidez;

  if (BANCO.length === 0) {
    $('btn-start').disabled = true;
    $('setup-error').hidden = false;
  }

  /* ---------- Vistas ---------- */
  function vista(id) {
    ['view-setup', 'view-game', 'view-summary'].forEach(function (v) { $(v).hidden = (v !== id); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Partida ---------- */
  function iniciar() {
    if (S && S.timer) clearInterval(S.timer);
    var elegidas = shuffle(BANCO).slice(0, nPreg).map(function (q) {
      return {
        pregunta: q.pregunta,
        correcta: q.correcta,
        dato: q.dato || '',
        opciones: shuffle([q.correcta].concat(q.incorrectas))
      };
    });
    S = {
      tiempo: tiempoElegido, preguntas: elegidas, i: 0,
      aciertos: 0, errores: 0, puntos: 0, respuestas: [],
      timer: null, limite: 0, restante: 0, bloqueado: false
    };
    actualizarContadores();
    vista('view-game');
    mostrar();
  }

  function actualizarContadores() {
    $('c-ok').textContent = S.aciertos;
    $('c-bad').textContent = S.errores;
    $('p-partida').textContent = S.puntos;
  }

  function mostrar() {
    var p = S.preguntas[S.i];
    S.bloqueado = false;
    $('q-num').textContent = S.i + 1;
    $('q-total').textContent = S.preguntas.length;
    $('q-text').textContent = p.pregunta;

    var cont = $('opts');
    cont.innerHTML = '';
    p.opciones.forEach(function (txt, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      var k = document.createElement('span');
      k.className = 'k';
      k.textContent = LETRAS[idx];
      var t = document.createElement('span');
      t.textContent = txt;
      b.appendChild(k);
      b.appendChild(t);
      b.addEventListener('click', function () { responder(idx); });
      cont.appendChild(b);
    });

    $('feedback').hidden = true;
    limpiarPeligro();

    var card = $('q-card');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');

    S.limite = Date.now() + S.tiempo * 1000;
    S.restante = S.tiempo;
    actualizarTimer();
    clearInterval(S.timer);
    S.timer = setInterval(tick, 100);
  }

  function umbralPeligro() {
    return Math.min(CFG.segundosPeligro, S.tiempo * 0.35);
  }

  function limpiarPeligro() {
    $('q-card').classList.remove('danger');
    $('timer-bar').classList.remove('danger');
    $('timer-num').classList.remove('danger');
    $('vignette').classList.remove('on');
  }

  function actualizarTimer() {
    var frac = S.restante / S.tiempo;
    $('timer-fill').style.width = (frac * 100) + '%';
    $('timer-num').textContent = Math.ceil(S.restante);

    var u = umbralPeligro();
    if (S.restante <= u && S.restante > 0) {
      // Las pulsaciones rojas se hacen más rápidas conforme se acaba el tiempo
      var pulso = (0.3 + 0.6 * (S.restante / u)).toFixed(2) + 's';
      $('q-card').style.setProperty('--pulse', pulso);
      $('timer-num').style.setProperty('--pulse', pulso);
      $('vignette').style.setProperty('--pulse', pulso);
      $('q-card').classList.add('danger');
      $('timer-bar').classList.add('danger');
      $('timer-num').classList.add('danger');
      $('vignette').classList.add('on');
    }
  }

  function tick() {
    S.restante = Math.max(0, (S.limite - Date.now()) / 1000);
    actualizarTimer();
    if (S.restante <= 0) responder(null);
  }

  function responder(idx) {
    if (!S || S.bloqueado) return;
    S.bloqueado = true;
    clearInterval(S.timer);
    limpiarPeligro();

    var p = S.preguntas[S.i];
    var correctaIdx = p.opciones.indexOf(p.correcta);
    var acierto = idx !== null && idx === correctaIdx;
    var ganados = 0;

    if (acierto) {
      ganados = CFG.puntosAcierto + Math.round(CFG.bonoRapidez * (S.restante / S.tiempo));
      S.aciertos++;
      S.puntos += ganados;
      Puntos.add(ganados, 'trivia');         // puntos GLOBALES
    } else {
      S.errores++;
    }

    S.respuestas.push({
      pregunta: p.pregunta,
      elegida: idx === null ? null : p.opciones[idx],
      correcta: p.correcta,
      acierto: acierto
    });

    var btns = $('opts').children;
    for (var n = 0; n < btns.length; n++) {
      btns[n].disabled = true;
      if (n === correctaIdx) btns[n].classList.add('correct');
      else if (n === idx) btns[n].classList.add('wrong');
      else btns[n].classList.add('dim');
    }

    var fb = $('feedback');
    fb.className = 'feedback ' + (acierto ? 'ok' : 'bad');
    $('fb-title').textContent = acierto
      ? '¡Correcto! +' + ganados + ' puntos'
      : (idx === null ? '¡Se acabó el tiempo!' : 'Respuesta incorrecta');
    $('fb-text').textContent = (acierto ? '' : 'La respuesta correcta era: ' + p.correcta + '. ') + p.dato;
    fb.hidden = false;

    var ultima = S.i + 1 >= S.preguntas.length;
    $('btn-next').textContent = ultima ? 'Ver resumen →' : 'Siguiente pregunta →';
    actualizarContadores();
    $('btn-next').focus({ preventScroll: true });
  }

  function siguiente() {
    if (!S || !S.bloqueado) return;
    if (S.i + 1 >= S.preguntas.length) resumen();
    else { S.i++; mostrar(); }
  }

  /* ---------- Resumen ---------- */
  function resumen() {
    var total = S.preguntas.length;
    var precision = Math.round((S.aciertos / total) * 100);
    var rango = precision >= 90 ? 'Comandante de misión'
              : precision >= 70 ? 'Astronauta veterano'
              : precision >= 40 ? 'Cadete espacial'
              : 'Novato en órbita';
    var msg = precision >= 90 ? '¡Increíble! Conoces la historia espacial como un experto.'
            : precision >= 70 ? 'Muy buen vuelo, apenas unos detalles por pulir.'
            : precision >= 40 ? 'Buen comienzo. Con otra partida mejorarás.'
            : 'Todos empezamos en la plataforma de lanzamiento. ¡Inténtalo otra vez!';

    $('s-rank').textContent = rango;
    $('s-msg').textContent = msg;
    $('s-pts').textContent = S.puntos;
    $('s-ok').textContent = S.aciertos;
    $('s-bad').textContent = S.errores;
    $('s-acc').textContent = precision + '%';
    $('s-global').textContent = Puntos.total().toLocaleString('es-MX');

    var ul = $('s-review');
    ul.innerHTML = '';
    S.respuestas.forEach(function (r, n) {
      var li = document.createElement('li');
      li.className = r.acierto ? 'ok' : 'bad';
      var q = document.createElement('div');
      q.className = 'rq';
      q.textContent = (n + 1) + '. ' + r.pregunta;
      var a = document.createElement('div');
      a.className = 'ra';
      if (r.acierto) {
        a.appendChild(document.createTextNode('✔ Tu respuesta: '));
        var b1 = document.createElement('b'); b1.className = 'ok'; b1.textContent = r.correcta;
        a.appendChild(b1);
      } else {
        a.appendChild(document.createTextNode('✘ Tu respuesta: '));
        var b2 = document.createElement('b'); b2.className = 'bad';
        b2.textContent = r.elegida === null ? 'Sin responder' : r.elegida;
        a.appendChild(b2);
        a.appendChild(document.createTextNode('  ·  Correcta: '));
        var b3 = document.createElement('b'); b3.className = 'ok'; b3.textContent = r.correcta;
        a.appendChild(b3);
      }
      li.appendChild(q);
      li.appendChild(a);
      ul.appendChild(li);
    });

    vista('view-summary');
  }

  /* ---------- Eventos ---------- */
  $('btn-start').addEventListener('click', iniciar);
  $('btn-next').addEventListener('click', siguiente);
  $('btn-again').addEventListener('click', iniciar);
  $('btn-config').addEventListener('click', function () { vista('view-setup'); });

  document.addEventListener('keydown', function (e) {
    if ($('view-game').hidden || !S) return;
    if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
    if (!S.bloqueado) {
      var n = ['1', '2', '3', '4', '5', '6'].indexOf(e.key);
      if (n === -1) n = ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(e.key.toLowerCase());
      if (n >= 0 && n < S.preguntas[S.i].opciones.length) responder(n);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      siguiente();
    }
  });
})();
