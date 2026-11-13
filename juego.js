/* ==========================================================
   juego.js — Misión de Rescate (Phaser 3)
   Reemplaza al juego.js anterior. Los puntos ahora son GLOBALES
   (se guardan con puntos.js, que debe cargarse antes).
   ========================================================== */
(function (SG) {
  'use strict';
  SG.PENALTY = 50;
  const ID_JUEGO = 'rescate';

  // Estado del juego conectado al sistema global de puntos
  SG.State = {
    get score() { return Puntos.juego(ID_JUEGO); },
    reset() { Puntos.reiniciarJuego(ID_JUEGO); },
    isDone(id) { return Puntos.misionHecha(id); },
    complete(id, pts) {
      if (Puntos.misionHecha(id)) return false;
      Puntos.marcarMision(id);
      Puntos.add(pts, ID_JUEGO);
      return true;
    },
    penalize(n) { Puntos.sub(n, ID_JUEGO); },
    resetDest(cfg) {
      [].concat(cfg.missions, cfg.extras || []).forEach(m => {
        if (Puntos.misionHecha(m.id)) { Puntos.borrarMision(m.id); Puntos.sub(m.pts, ID_JUEGO); }
      });
    }
  };
  SG.Controls = { left: false, right: false, up: false, down: false, scan: false };

  SG.DEST = {
    moon: { name: 'Luna', vehicle: 'rover', start: [200, 1000], missions: [
      { id: 'apollo11', name: 'Apollo 11', x: 520, y: 850, pts: 100, fact: 'En 1969 Neil Armstrong y Buzz Aldrin fueron los primeros humanos en pisar la Luna.' },
      { id: 'apollo12', name: 'Apollo 12', x: 1100, y: 1030, pts: 100, fact: 'Apollo 12 (1969) aterrizó a unos 180 m de Surveyor 3 y recuperó piezas de la sonda.' },
      { id: 'apollo15', name: 'Apollo 15', x: 1500, y: 520, pts: 100, fact: 'Apollo 15 (1971) fue la primera misión en conducir el Rover Lunar.' },
      { id: 'surveyor3', name: 'Surveyor 3', x: 800, y: 220, pts: 100, fact: 'Surveyor 3 (1967) excavó el suelo lunar con un brazo robótico y envió miles de fotos.' }
    ], extras: [
      { id: 'astro1', name: 'Astronauta', tex: 'astro', wander: true, x: 300, y: 520, pts: 25, fact: 'Solo 12 personas han caminado sobre la Luna, todas entre 1969 y 1972.' }
    ] },
    mars: { name: 'Marte', vehicle: 'rover', start: [150, 1050], missions: [
      { id: 'pathfinder', name: 'Mars Pathfinder', x: 450, y: 880, pts: 120, fact: 'Pathfinder aterrizó en 1997 y llevó a Sojourner, el primer rover que rodó en Marte.' },
      { id: 'spiropp', name: 'Spirit y Opportunity', x: 1050, y: 1050, pts: 120, fact: 'Los rovers gemelos llegaron en 2004; Opportunity funcionó casi 15 años.' },
      { id: 'dawn', name: 'Dawn Mission', x: 1500, y: 700, pts: 120, fact: 'Dawn usó la gravedad de Marte en 2009 y fue la primera sonda en orbitar Vesta y Ceres.' },
      { id: 'ingenuity', name: 'Ingenuity Mars', x: 900, y: 280, pts: 120, fact: 'En 2021 Ingenuity realizó el primer vuelo motorizado y controlado en otro planeta.' }
    ], extras: [
      { id: 'alien1', name: 'Alien curioso', tex: 'alien', follow: true, x: 700, y: 620, pts: 25, fact: 'Los marcianos de ficción nacieron en La guerra de los mundos (1898) de H. G. Wells.' },
      { id: 'alien2', name: 'Alien curioso', tex: 'alien', follow: true, x: 1250, y: 900, pts: 25, fact: 'En 1938 una versión radiofónica de esa novela asustó a miles de oyentes.' }
    ] },
    deep: { name: 'Espacio Profundo', vehicle: 'rocket', start: [1600, 600], missions: [
      { id: 'pioneer10', name: 'Pioneer 10', x: 1100, y: 200, pts: 200, fact: 'Pioneer 10 (1972) cruzó el cinturón de asteroides y sobrevoló Júpiter en 1973.' },
      { id: 'k2', name: 'Kepler K2', x: 500, y: 950, pts: 200, fact: 'Kepler K2 (2014) siguió cazando exoplanetas tras fallar dos de sus ruedas de reacción.' }
    ], extras: [] }
  };
  SG.totalMissions = function () { return Object.values(SG.DEST).reduce((n, d) => n + d.missions.length, 0); };
  SG.doneMissions = function () { return Object.values(SG.DEST).reduce((n, d) => n + d.missions.filter(m => SG.State.isDone(m.id)).length, 0); };
})(window.SpaceGame = window.SpaceGame || {});

(function (SG) {
  'use strict';
  const W = 800, H = 450, FONT = 'Arial, sans-serif';
  const txt = (s, x, y, t, sz, col, bold) => s.add.text(x, y, t, { fontFamily: FONT, fontSize: sz + 'px', color: col || '#fff', fontStyle: bold ? 'bold' : 'normal' });
  const setUI = on => { const r = document.getElementById('sg-root'); r.classList.toggle('in-game', on); if (!on) r.classList.remove('paused'); };
  const rnd = Phaser.Math.Between;

  // Transición: cortina negra que baja y cubre la pantalla...
  SG.wipeTo = function (s, key, data, before) {
    if (s._wiping) return;
    s._wiping = true;
    const r = s.add.rectangle(W / 2, -H / 2, W, H, 0x000000).setScrollFactor(0).setDepth(1000);
    s.tweens.add({ targets: r, y: H / 2, duration: 450, ease: 'Sine.easeInOut',
      onComplete: () => { if (before) before(); s.scene.start(key, data); } });
  };
  // ...y en la escena nueva la cortina sigue bajando hasta salir.
  function wipeIn(s) {
    s._wiping = false;
    const r = s.add.rectangle(W / 2, H / 2, W, H, 0x000000).setScrollFactor(0).setDepth(1000);
    s.tweens.add({ targets: r, y: H * 1.5, duration: 450, ease: 'Sine.easeInOut', onComplete: () => r.destroy() });
  }

  function stars(g, n, a) {
    for (let i = 0; i < n; i++) { g.fillStyle(0xffffff, a * (0.4 + Math.random() * 0.6)); g.fillRect(rnd(0, W), rnd(0, H), rnd(1, 2), rnd(1, 2)); }
  }
  function earth(g, x, y, r) {
    g.fillStyle(0x00f0ff, 0.12).fillCircle(x, y, r + 14);
    g.fillStyle(0x38bdf8, 0.22).fillCircle(x, y, r + 6);
    g.fillStyle(0x0284c7).fillCircle(x, y, r);
    g.fillStyle(0x16a34a).fillEllipse(x - r * 0.3, y - r * 0.2, r * 0.75, r * 0.55).fillEllipse(x + r * 0.35, y + r * 0.3, r * 0.55, r * 0.65);
    g.fillStyle(0x15803d).fillEllipse(x - r * 0.1, y + r * 0.35, r * 0.4, r * 0.3);
    g.fillStyle(0xffffff, 0.6).fillEllipse(x + r * 0.1, y - r * 0.45, r * 0.85, r * 0.2).fillEllipse(x - r * 0.2, y + r * 0.15, r * 0.6, r * 0.15);
    g.lineStyle(2, 0x38bdf8, 0.8).strokeCircle(x, y, r);
  }

  function menuButton(s, x, y, label, subtext, iconSymbol, cb) {
    const container = s.add.container(x, y);
    const bg = s.add.rectangle(0, 0, 260, 64, 0x0f172a, 0.85).setStrokeStyle(2, 0x00f0ff, 0.6).setInteractive({ useHandCursor: true });
    bg.isButton = true;

    const indicator = s.add.rectangle(-122, 0, 4, 40, 0x00f0ff, 0.8);
    const icon = s.add.text(-100, 0, iconSymbol, { fontSize: '24px' }).setOrigin(0.5);
    const tLabel = s.add.text(-70, -11, label, { fontFamily: FONT, fontSize: '16px', color: '#fff', fontStyle: 'bold' });
    const tSub = s.add.text(-70, +9, subtext, { fontFamily: FONT, fontSize: '11px', color: '#94a3b8' });

    container.add([bg, indicator, icon, tLabel, tSub]);

    bg.on('pointerover', () => {
      s.tweens.add({ targets: container, scale: 1.05, duration: 150, ease: 'Back.easeOut' });
      bg.setFillStyle(0x1e293b, 0.95);
      bg.setStrokeStyle(2, 0x7dff8a, 1);
      indicator.setFillStyle(0x7dff8a, 1);
    });
    bg.on('pointerout', () => {
      s.tweens.add({ targets: container, scale: 1, duration: 150, ease: 'Power1' });
      bg.setFillStyle(0x0f172a, 0.85);
      bg.setStrokeStyle(2, 0x00f0ff, 0.6);
      indicator.setFillStyle(0x00f0ff, 0.8);
    });
    bg.on('pointerdown', () => {
      s.tweens.add({ targets: container, scale: 0.95, duration: 80, yoyo: true });
    });
    bg.on('pointerup', cb);
    return container;
  }

  const WW = 1800, WH = 1200;
  function background(s, d) {
    const g = s.add.graphics().setDepth(0), r = new Phaser.Math.RandomDataGenerator([d]), b = (a, c) => r.between(a, c);
    if (d === 'moon') {
      g.fillStyle(0x8f9298).fillRect(0, 0, WW, WH);
      for (let i = 0; i < 70; i++) g.fillStyle(r.pick([0x7d8086, 0x9fa2a8]), 0.35).fillEllipse(b(0, WW), b(0, WH), b(80, 260), b(60, 180));
      for (let i = 0; i < 45; i++) { const x = b(0, WW), y = b(0, WH), R = b(25, 95);
        g.fillStyle(0x6a6d73).fillCircle(x, y, R).fillStyle(0x7d8086).fillCircle(x + R * 0.12, y + R * 0.12, R * 0.82); g.lineStyle(3, 0xb2b5ba).strokeCircle(x, y, R); }
      for (let i = 0; i < 160; i++) g.fillStyle(0x5f6268).fillCircle(b(0, WW), b(0, WH), b(2, 5));
    } else if (d === 'mars') {
      g.fillStyle(0xa4482a).fillRect(0, 0, WW, WH);
      for (let i = 0; i < 60; i++) { const x = b(0, WW), y = b(0, WH), w = b(160, 380), h = b(26, 48);
        g.fillStyle(0x7e3219, 0.45).fillEllipse(x + 10, y + 14, w, h).fillStyle(0xc9693a, 0.7).fillEllipse(x, y, w, h); }
      for (let i = 0; i < 120; i++) g.fillStyle(0x5e2410).fillCircle(b(0, WW), b(0, WH), b(3, 9));
    } else {
      g.fillStyle(0x02030a).fillRect(0, 0, WW, WH);
      [[0x6a3cff, 300, 300, 260], [0x2ec4ff, 1300, 800, 320], [0xff5ea8, 800, 1000, 220], [0x6a3cff, 1500, 200, 200]].forEach(n => g.fillStyle(n[0], 0.07).fillCircle(n[1], n[2], n[3]));
      for (let i = 0; i < 450; i++) g.fillStyle(0xffffff, 0.3 + r.frac() * 0.7).fillRect(b(0, WW), b(0, WH), b(1, 2), b(1, 2));
    }
  }

  class Boot extends Phaser.Scene {
    constructor() { super('Boot'); }
    create() {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      const save = (k, w, h) => { g.generateTexture(k, w, h); g.clear(); };
      g.fillStyle(0x222831).fillRect(6, 0, 12, 7).fillRect(38, 0, 12, 7).fillRect(6, 29, 12, 7).fillRect(38, 29, 12, 7);
      g.fillStyle(0xcfd4da).fillRoundedRect(4, 6, 48, 24, 5); g.fillStyle(0x2b4c8c).fillRect(8, 10, 18, 16); g.fillStyle(0xffd166).fillCircle(43, 18, 5);
      save('rover', 56, 36);
      g.fillStyle(0xf2f4f8).fillRect(10, 6, 38, 16); g.fillStyle(0xe63946).fillTriangle(48, 6, 48, 22, 64, 14);
      g.fillTriangle(12, 6, 3, 0, 24, 6).fillTriangle(12, 22, 3, 28, 24, 22);
      g.fillStyle(0x4aa3ff).fillCircle(34, 14, 4); g.fillStyle(0xffa62b).fillTriangle(10, 9, 0, 14, 10, 19);
      save('rocket', 64, 28);
      g.fillStyle(0x7dff8a).fillCircle(15, 15, 13); g.fillStyle(0x000000).fillEllipse(10, 12, 5, 7).fillEllipse(20, 12, 5, 7);
      g.fillStyle(0x7dff8a).fillCircle(6, 3, 3).fillCircle(24, 3, 3);
      save('alien', 30, 30);
      g.fillStyle(0xaaaaaa).fillRect(2, 9, 9, 12); g.fillStyle(0xffffff).fillCircle(15, 4, 4).fillCircle(15, 26, 4).fillCircle(16, 15, 11);
      g.fillStyle(0xffc400).fillEllipse(21, 15, 8, 12);
      save('astro', 32, 30);
      g.fillStyle(0x7a3cff, 0.15).fillCircle(64, 64, 62).fillStyle(0xb06cff, 0.3).fillCircle(64, 64, 50);
      g.fillStyle(0xffa040, 0.55).fillCircle(64, 64, 38).fillStyle(0x000000).fillCircle(64, 64, 28);
      save('blackhole', 128, 128);
      [['beacon', 0xffd166], ['beaconDone', 0x4cd964]].forEach(b => {
        g.fillStyle(b[1], 0.25).fillCircle(24, 24, 21); g.lineStyle(4, b[1]).strokeCircle(24, 24, 20); g.fillStyle(b[1]).fillCircle(24, 24, 5);
        if (b[0] === 'beaconDone') g.lineBetween(14, 24, 21, 31).lineBetween(21, 31, 35, 16);
        save(b[0], 48, 48);
      });
      g.destroy();
      this.scene.start('Menu');
    }
  }

  class Menu extends Phaser.Scene {
    constructor() { super('Menu'); }
    create() {
      setUI(false);
      const g = this.add.graphics();
      g.fillGradientStyle(0x030712, 0x030712, 0x0a1030, 0x0f172a, 1).fillRect(0, 0, W, H);
      stars(g, 180, 0.8);

      g.lineStyle(1, 0x00f0ff, 0.15).strokeCircle(400, 225, 160);
      g.lineStyle(1, 0x00f0ff, 0.08).strokeCircle(400, 225, 220);

      const eg = this.add.graphics();
      earth(eg, 400, 225, 68);
      this.tweens.add({ targets: eg, y: -6, yoyo: true, repeat: -1, duration: 4000, ease: 'Sine.easeInOut' });

      txt(this, 400, 36, 'SELECCIÓN DE DESTINO', 26, '#00f0ff', true).setOrigin(0.5).setShadow(0, 0, '#00f0ff', 12);
      txt(this, 400, 62, 'CENTRO DE CONTROL ESPACIAL - NASA', 12, '#94a3b8', true).setOrigin(0.5);

      const go = d => () => SG.wipeTo(this, 'Play', { dest: d });

      menuButton(this, 175, 215, 'LA LUNA', 'Satélite Natural', '🌕', go('moon'));
      menuButton(this, 625, 215, 'MARTE', 'Planeta Rojo', '🔴', go('mars'));
      menuButton(this, 400, 370, 'ESPACIO PROFUNDO', 'Sondas Lejanas', '🌌', go('deep'));

      this.add.rectangle(400, 426, 768, 32, 0x0b101d, 0.9).setStrokeStyle(1, 0x1e293b);
      txt(this, 35, 418, 'TELEMETRÍA GLOBAL:', 12, '#64748b', true);
      txt(this, 180, 418, 'Puntos: ' + Puntos.total(), 14, '#ffd166', true);
      txt(this, 330, 418, '|', 14, '#334155', true);
      txt(this, 350, 418, 'Misiones: ' + SG.doneMissions() + '/' + SG.totalMissions(), 14, '#7dff8a', true);

      const nb = this.add.rectangle(710, 426, 100, 24, 0x3f1d1d).setStrokeStyle(1, 0xf87171).setInteractive({ useHandCursor: true });
      txt(this, 710, 426, 'Reiniciar', 12, '#fca5a5', true).setOrigin(0.5);
      nb.on('pointerover', () => nb.setFillStyle(0x7f1d1d));
      nb.on('pointerout', () => nb.setFillStyle(0x3f1d1d));
      // Reinicia solo el progreso de ESTE juego (los puntos de otros juegos se conservan)
      nb.on('pointerup', () => { SG.State.reset(); this.scene.restart(); });
      wipeIn(this);
    }
  }

  class Play extends Phaser.Scene {
    constructor() { super('Play'); }
    init(d) { this.dest = d.dest; this.caughtNote = !!d.caught; this.caught = false; this.blackHole = null; this.bhTweens = []; this.bhTimer = null; this.bhSpeed = 28; this.targets = []; this.panelTimer = null; }
    create() {
      setUI(true);
      wipeIn(this);
      this.cfg = SG.DEST[this.dest];
      background(this, this.dest);
      this.keys = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
      this.space = this.input.keyboard.addKey('SPACE');
      this.cfg.missions.forEach(m => {
        const done = SG.State.isDone(m.id), s = this.add.image(m.x, m.y, done ? 'beaconDone' : 'beacon').setDepth(8);
        txt(this, m.x, m.y + 34, m.name, 13, '#ffffff', true).setOrigin(0.5, 0).setDepth(8).setShadow(1, 1, '#000', 3);
        if (!done) s.pulse = this.tweens.add({ targets: s, scale: 1.15, yoyo: true, repeat: -1, duration: 700 });
        this.targets.push({ id: m.id, name: m.name, pts: m.pts, fact: m.fact, title: m.name + ' completada', s, mission: true });
      });
      (this.cfg.extras || []).forEach(e => {
        const s = this.add.image(e.x, e.y, e.tex).setDepth(9);
        this.tweens.add({ targets: s, scale: 1.12, yoyo: true, repeat: -1, duration: 600 + rnd(0, 300) });
        if (e.wander) this.tweens.add({ targets: s, x: e.x + 80, yoyo: true, repeat: -1, duration: 3500, ease: 'Sine.easeInOut' });
        this.targets.push({ id: e.id, name: e.name, pts: e.pts, fact: e.fact, title: e.name + ' escaneado', s, follow: e.follow });
      });
      this.player = this.add.image(this.cfg.start[0], this.cfg.start[1], this.cfg.vehicle).setDepth(10);
      this.arrow = this.add.triangle(0, 0, 0, -9, 18, 0, 0, 9, 0xffd166).setDepth(12);
      this.cameras.main.setBounds(0, 0, WW, WH).startFollow(this.player, true, 0.1, 0.1);
      this.hud = txt(this, 10, 8, '', 16, '#ffd166', true).setDepth(40).setScrollFactor(0);
      this.title = txt(this, 400, 8, this.cfg.name, 18, '#ffffff', true).setOrigin(0.5, 0).setDepth(40).setScrollFactor(0);
      this.prompt = txt(this, 400, 425, '', 17, '#7dff8a', true).setOrigin(0.5).setDepth(50).setScrollFactor(0).setShadow(1, 1, '#000', 4);
      const box = this.add.rectangle(0, 0, 640, 76, 0x0b1226, 0.93).setStrokeStyle(2, 0x6cc6ff);
      this.pTitle = txt(this, 0, -26, '', 16, '#ffd166', true).setOrigin(0.5);
      this.pBody = txt(this, 0, 8, '', 15, '#ffffff').setOrigin(0.5).setAlign('center').setWordWrapWidth(610);
      this.panel = this.add.container(400, 84, [box, this.pTitle, this.pBody]).setDepth(50).setScrollFactor(0).setVisible(false);
      this.refreshHud();
      this.events.once('shutdown', () => this.destroyBlackHole());
      this.events.once('destroy', () => this.destroyBlackHole());
      if (this.caughtNote) this.showPanel('¡Atrapado por el agujero negro!', 'Perdiste ' + SG.PENALTY + ' puntos y volviste a la Luna. Tu progreso se conserva.', 5500);
      this.spawnBlackHole();
    }
    refreshHud() {
      const done = this.cfg.missions.filter(m => SG.State.isDone(m.id)).length;
      this.hud.setText('Puntos totales: ' + Puntos.total() + '\nMisiones: ' + done + '/' + this.cfg.missions.length);
    }
    showPanel(t, b, ms) {
      this.pTitle.setText(t); this.pBody.setText(b); this.panel.setVisible(true);
      if (this.panelTimer) this.panelTimer.remove(false);
      this.panelTimer = this.time.delayedCall(ms || 4500, () => this.panel && this.panel.setVisible(false));
    }
    float(x, y, t) {
      const f = txt(this, x, y, t, 20, '#7dff8a', true).setOrigin(0.5).setDepth(60);
      this.tweens.add({ targets: f, y: y - 40, alpha: 0, duration: 1000, onComplete: () => f.destroy() });
    }
    scan(t) {
      const ring = this.add.circle(t.s.x, t.s.y, 10).setStrokeStyle(3, 0x7dff8a).setDepth(11);
      this.tweens.add({ targets: ring, scale: 8, alpha: 0, duration: 650, onComplete: () => ring.destroy() });
      if (!SG.State.complete(t.id, t.pts)) return;
      this.float(t.s.x, t.s.y - 40, '+' + t.pts); this.refreshHud();
      if (t.mission) { if (t.s.pulse) { t.s.pulse.remove(); t.s.pulse = null; } t.s.setScale(1).setTexture('beaconDone'); }
      const all = SG.doneMissions() === SG.totalMissions();
      this.showPanel(all ? '¡Todas las misiones completadas!' : t.title, t.fact, all ? 6000 : 4500);
    }
    spawnBlackHole() {
      if (this.dest !== 'deep' || this.blackHole) return;
      const bh = this.add.image(120, 300, 'blackhole').setDepth(5);
      this.bhTweens.push(this.tweens.add({ targets: bh, angle: 360, duration: 6000, repeat: -1 }));
      this.bhTweens.push(this.tweens.add({ targets: bh, scale: 1.08, yoyo: true, repeat: -1, duration: 900 }));
      this.bhTimer = this.time.addEvent({ delay: 5000, loop: true, callback: () => { if (this.blackHole) this.bhSpeed += 3; } });
      this.blackHole = bh;
    }
    destroyBlackHole() {
      this.bhTweens.forEach(t => t && t.remove()); this.bhTweens = [];
      if (this.bhTimer) { this.bhTimer.remove(false); this.bhTimer = null; }
      if (this.blackHole) { this.tweens.killTweensOf(this.blackHole); this.blackHole.destroy(); this.blackHole = null; }
    }
    trap() {
      this.caught = true;
      SG.State.penalize(SG.PENALTY);
      this.tweens.add({ targets: this.player, x: this.blackHole.x, y: this.blackHole.y, scale: 0, angle: 360, duration: 800,
        onComplete: () => { this.destroyBlackHole(); SG.wipeTo(this, 'Play', { dest: 'moon', caught: true }); } });
    }
    update(time, delta) {
      const s = delta / 1000, K = this.keys, C = SG.Controls, p = this.player, D = Phaser.Math.Distance.Between;
      const scanKey = Phaser.Input.Keyboard.JustDown(this.space) || C.scan; C.scan = false;
      if (!this.caught) {
        const Wk = this.wasd;
        const dx = (K.left.isDown || Wk.left.isDown || C.left ? -1 : 0) + (K.right.isDown || Wk.right.isDown || C.right ? 1 : 0);
        const dy = (K.up.isDown || Wk.up.isDown || C.up ? -1 : 0) + (K.down.isDown || Wk.down.isDown || C.down ? 1 : 0);
        if (dx || dy) {
          const l = Math.hypot(dx, dy);
          p.x = Phaser.Math.Clamp(p.x + dx / l * 200 * s, 30, WW - 30); p.y = Phaser.Math.Clamp(p.y + dy / l * 200 * s, 30, WH - 30);
          p.rotation = Phaser.Math.Angle.RotateTo(p.rotation, Math.atan2(dy, dx), 0.18);
        }
        let near = null, nd = 75;
        this.targets.forEach(t => {
          const d = D(p.x, p.y, t.s.x, t.s.y);
          if (t.follow && d < 260 && d > 50) { const a = Math.atan2(p.y - t.s.y, p.x - t.s.x); t.s.x += Math.cos(a) * 34 * s; t.s.y += Math.sin(a) * 34 * s; }
          if (!SG.State.isDone(t.id) && d < nd) { nd = d; near = t; }
        });
        this.prompt.setText(near ? 'ESPACIO / Escanear: ' + near.name : '');
        if (near && scanKey) this.scan(near);
        const next = this.targets.filter(t => t.mission && !SG.State.isDone(t.id)).sort((a, b) => D(p.x, p.y, a.s.x, a.s.y) - D(p.x, p.y, b.s.x, b.s.y))[0];
        if (next) { const a = Math.atan2(next.s.y - p.y, next.s.x - p.x); this.arrow.setVisible(true).setPosition(p.x + Math.cos(a) * 55, p.y + Math.sin(a) * 55).setRotation(a); }
        else this.arrow.setVisible(false);
      }
      if (this.dest === 'deep' && this.blackHole && !this.caught) {
        const bh = this.blackHole, ang = Math.atan2(p.y - bh.y, p.x - bh.x);
        bh.x += Math.cos(ang) * this.bhSpeed * s; bh.y += Math.sin(ang) * this.bhSpeed * s;
        if (D(p.x, p.y, bh.x, bh.y) < 40) this.trap();
      }
    }
  }
  SG.Boot = Boot; SG.Menu = Menu; SG.Play = Play;
})(window.SpaceGame);

(function (SG) {
  'use strict';
  const root = document.getElementById('sg-root');
  if (!root || typeof Phaser === 'undefined') return;

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: 'sg-canvas', width: 800, height: 450, backgroundColor: '#000000',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { keyboard: { target: root } },
    scene: [SG.Boot, SG.Menu, SG.Play]
  });
  root.addEventListener('pointerdown', () => root.focus({ preventScroll: true }));

  root.querySelectorAll('[data-dir]').forEach(b => {
    const dir = b.dataset.dir, set = v => e => { e.preventDefault(); SG.Controls[dir] = v; b.classList.toggle('on', v); };
    b.addEventListener('pointerdown', set(true));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, set(false)));
    b.addEventListener('contextmenu', e => e.preventDefault());
  });

  const sc = document.getElementById('sg-scan');
  if (sc) {
    sc.addEventListener('pointerdown', e => { e.preventDefault(); SG.Controls.scan = true; sc.classList.add('on'); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => sc.addEventListener(ev, () => sc.classList.remove('on')));
  }

  // ----- Menú de pausa -----
  const playScene = () => game.scene.getScene('Play');
  const refocus = () => root.focus({ preventScroll: true });
  function openPause() {
    const s = playScene();
    if (!s || !game.scene.isActive('Play') || s._wiping) return;
    Object.keys(SG.Controls).forEach(k => (SG.Controls[k] = false));
    root.querySelectorAll('.on').forEach(b => b.classList.remove('on'));
    game.scene.pause('Play');
    root.classList.add('paused');
  }
  function closePause() {
    root.classList.remove('paused');
    game.scene.resume('Play');
    refocus();
  }
  const togglePause = () => (root.classList.contains('paused') ? closePause() : openPause());

  document.getElementById('sg-menu').addEventListener('click', e => { e.currentTarget.blur(); togglePause(); });
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape' && root.classList.contains('in-game')) { e.preventDefault(); togglePause(); }
  });
  document.getElementById('sg-pause').addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const s = playScene();
    closePause();
    if (act.dataset.act === 'restart') SG.wipeTo(s, 'Play', { dest: s.dest }, () => SG.State.resetDest(s.cfg));
    else if (act.dataset.act === 'menu') SG.wipeTo(s, 'Menu');
  });
})(window.SpaceGame);
