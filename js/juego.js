(function () {
  'use strict';

  const ANCHO = 800;
  const ALTO = 600;
  const MUNDO_ANCHO = 2400;
  const MUNDO_ALTO = 1200;
  const VELOCIDAD = 230;
  const RADIO_ESCANEO = 95;
  const PUNTOS_MISION = 100;
  const PUNTOS_BONO = 500;

  const ZONAS = [
    { nombre: 'LUNA',              x: 0,    fondo: 0x7d8087, marca: 0xa6a9b0, color: '#e5e7eb', tinte: 0xe5e7eb },
    { nombre: 'MARTE',             x: 800,  fondo: 0x8f4529, marca: 0xb85d39, color: '#fdba74', tinte: 0xfdba74 },
    { nombre: 'ESPACIO PROFUNDO',  x: 1600, fondo: 0x0a0f2e, marca: 0xffffff, color: '#93c5fd', tinte: 0x93c5fd }
  ];

  const MISIONES = [
    { nombre: 'Apollo 11', zona: 0, x: 220, y: 300,
      dato: 'Año 1969. Neil Armstrong y Buzz Aldrin pisan la Luna el 20 de julio. Aterrizan en el Mar de la Tranquilidad.' },
    { nombre: 'Apollo 12', zona: 0, x: 560, y: 640,
      dato: 'Año 1969. La nave aterriza cerca de Surveyor 3. Los astronautas recuperan piezas de esa sonda.' },
    { nombre: 'Apollo 15', zona: 0, x: 250, y: 950,
      dato: 'Año 1971. Es la primera misión que usa el Vehículo Lunar Rover. Los astronautas recorren la superficie con él.' },
    { nombre: 'Surveyor 3', zona: 0, x: 690, y: 790,
      dato: 'Año 1967. La sonda aterriza en la Luna sin tripulación. Su pala analiza el suelo lunar.' },
    { nombre: 'Mars Pathfinder', zona: 1, x: 1000, y: 250,
      dato: 'Año 1997. La sonda aterriza en Marte con airbags. Lleva a Sojourner, el primer rover en Marte.' },
    { nombre: 'Spirit y Opportunity', zona: 1, x: 1380, y: 520,
      dato: 'Año 2004. Dos rovers gemelos aterrizan en Marte. Spirit calla en 2010. Opportunity opera hasta 2018.' },
    { nombre: 'Dawn Mission', zona: 1, x: 1100, y: 920,
      dato: 'Lanzada en 2007. Usa la gravedad de Marte en 2009. Orbita el asteroide Vesta y el planeta enano Ceres.' },
    { nombre: 'Ingenuity Mars', zona: 1, x: 1470, y: 1020,
      dato: 'Año 2021. El helicóptero hace el primer vuelo controlado con motor en otro planeta. Completa 72 vuelos.' },
    { nombre: 'Pioneer 10', zona: 2, x: 1900, y: 300,
      dato: 'Lanzada en 1972. Es la primera sonda que cruza el cinturón de asteroides. Sobrevuela Júpiter en 1973.' },
    { nombre: 'Kepler K2', zona: 2, x: 2250, y: 850,
      dato: 'Kepler pierde dos ruedas de reacción en 2013. En 2014 inicia la misión K2. Usa la presión de la luz solar para apuntar.' }
  ];

  const FUENTE = 'Trebuchet MS, Verdana, sans-serif';

  class EscenaJuego extends Phaser.Scene {
    constructor() { super('EscenaJuego'); }

    create() {
      this.puntos = 0;
      this.recogidas = 0;
      this.finalizado = false;
      this.temporizadorPanel = null;
      this.entrada = { izq: false, der: false, arr: false, aba: false };

      this.crearTexturas();
      this.crearMundo();
      this.crearMisiones();
      this.crearRover();
      this.crearHud();
      this.crearPanel();
      this.crearControlesTeclado();
      this.crearControlesTactiles();

      this.physics.world.setBounds(0, 0, MUNDO_ANCHO, MUNDO_ALTO);
      this.cameras.main.setBounds(0, 0, MUNDO_ANCHO, MUNDO_ALTO);
      this.cameras.main.startFollow(this.rover, true, 0.1, 0.1);

      this.mostrarPanel(
        'Misión: escanear 10 naves NASA',
        'Mueve el rover con flechas, WASD o los botones. Pulsa ESPACIO o ESCANEAR cerca de una baliza.',
        '#ffffff',
        8000
      );
    }

    crearTexturas() {
      if (this.textures.exists('rover')) return;
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      g.fillStyle(0x1f2937, 1);
      g.fillRect(4, 0, 10, 6);
      g.fillRect(4, 30, 10, 6);
      g.fillRect(26, 0, 10, 6);
      g.fillRect(26, 30, 10, 6);
      g.fillStyle(0xf3f4f6, 1);
      g.fillRoundedRect(2, 5, 40, 26, 5);
      g.fillStyle(0xf59e0b, 1);
      g.fillRect(12, 9, 14, 18);
      g.fillStyle(0x38bdf8, 1);
      g.fillCircle(36, 18, 5);
      g.lineStyle(2, 0x9ca3af, 1);
      g.strokeRoundedRect(2, 5, 40, 26, 5);
      g.generateTexture('rover', 46, 36);
      g.clear();

      g.fillStyle(0xffffff, 0.18);
      g.fillCircle(30, 30, 30);
      g.lineStyle(3, 0xffffff, 1);
      g.strokeCircle(30, 30, 22);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(30, 30, 9);
      g.generateTexture('baliza', 60, 60);
      g.clear();

      g.fillStyle(0xfacc15, 1);
      g.fillTriangle(0, 0, 18, 8, 0, 16);
      g.generateTexture('flecha', 18, 16);
      g.destroy();
    }

    crearMundo() {
      const g = this.add.graphics().setDepth(0);

      ZONAS.forEach((z, i) => {
        g.fillStyle(z.fondo, 1);
        g.fillRect(z.x, 0, 800, MUNDO_ALTO);

        if (i < 2) {
          for (let n = 0; n < 45; n++) {
            const cx = Phaser.Math.Between(z.x + 30, z.x + 770);
            const cy = Phaser.Math.Between(30, MUNDO_ALTO - 30);
            const r = Phaser.Math.Between(8, 38);
            g.fillStyle(z.marca, 0.35);
            g.fillCircle(cx, cy, r);
            g.lineStyle(2, z.marca, 0.7);
            g.strokeCircle(cx, cy, r);
          }
        } else {
          for (let n = 0; n < 260; n++) {
            const sx = Phaser.Math.Between(z.x, z.x + 800);
            const sy = Phaser.Math.Between(0, MUNDO_ALTO);
            g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.25, 1));
            g.fillRect(sx, sy, Phaser.Math.Between(1, 3), Phaser.Math.Between(1, 3));
          }
        }

        if (i > 0) {
          g.lineStyle(4, 0xffffff, 0.35);
          g.lineBetween(z.x, 0, z.x, MUNDO_ALTO);
        }

        this.add.text(z.x + 400, 34, z.nombre, {
          fontFamily: FUENTE, fontSize: '44px', fontStyle: 'bold', color: z.color
        }).setOrigin(0.5, 0).setAlpha(0.3).setDepth(1);
      });
    }

    crearMisiones() {
      this.misiones = MISIONES.map((m) => {
        const zona = ZONAS[m.zona];
        const baliza = this.add.image(m.x, m.y, 'baliza').setTint(zona.tinte).setDepth(2);
        this.tweens.add({
          targets: baliza, scale: 1.25, alpha: 0.7,
          duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        const etiqueta = this.add.text(m.x, m.y + 44, m.nombre, {
          fontFamily: FUENTE, fontSize: '15px', fontStyle: 'bold',
          color: '#ffffff', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(3);
        return Object.assign({}, m, { baliza, etiqueta, escaneada: false });
      });
    }

    crearRover() {
      this.rover = this.physics.add.sprite(100, 600, 'rover').setDepth(5);
      this.rover.setCollideWorldBounds(true);
      this.rover.setDrag(0);
      this.anguloObjetivo = 0;

      this.flecha = this.add.image(0, 0, 'flecha').setDepth(4);
      this.pulso = this.add.graphics().setDepth(4);
    }

    crearHud() {
      const estilo = { fontFamily: FUENTE, fontSize: '18px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
      this.txtPuntos = this.add.text(14, 10, '', estilo).setScrollFactor(0).setDepth(10);
      this.txtMisiones = this.add.text(ANCHO - 14, 10, '', estilo).setOrigin(1, 0).setScrollFactor(0).setDepth(10);
      this.txtZona = this.add.text(14, 36, '', Object.assign({}, estilo, { fontSize: '14px' })).setScrollFactor(0).setDepth(10);
      this.txtGuia = this.add.text(ANCHO - 14, 36, '', Object.assign({}, estilo, { fontSize: '14px' })).setOrigin(1, 0).setScrollFactor(0).setDepth(10);
      this.actualizarHud();
    }

    actualizarHud() {
      this.txtPuntos.setText('PUNTOS: ' + this.puntos);
      this.txtMisiones.setText('MISIONES: ' + this.recogidas + '/' + MISIONES.length);
    }

    crearPanel() {
      const fondo = this.add.rectangle(ANCHO / 2, 140, 760, 128, 0x0f172a, 0.93).setStrokeStyle(3, 0xffffff);
      this.panelTitulo = this.add.text(30, 92, '', { fontFamily: FUENTE, fontSize: '20px', fontStyle: 'bold', color: '#ffffff' });
      this.panelCuerpo = this.add.text(30, 124, '', {
        fontFamily: FUENTE, fontSize: '17px', color: '#e5e7eb',
        wordWrap: { width: 730 }, lineSpacing: 4
      });
      this.panel = this.add.container(0, 0, [fondo, this.panelTitulo, this.panelCuerpo])
        .setScrollFactor(0).setDepth(15).setVisible(false);
    }

    mostrarPanel(titulo, cuerpo, color, duracion) {
      if (this.temporizadorPanel) this.temporizadorPanel.remove(false);
      this.panelTitulo.setText(titulo).setColor(color);
      this.panelCuerpo.setText(cuerpo);
      this.panel.setVisible(true);
      this.temporizadorPanel = this.time.delayedCall(duracion || 7000, () => this.panel.setVisible(false));
    }

    crearControlesTeclado() {
      const K = Phaser.Input.Keyboard.KeyCodes;
      this.teclas = this.input.keyboard.addKeys({
        izq: K.LEFT, der: K.RIGHT, arr: K.UP, aba: K.DOWN,
        a: K.A, d: K.D, w: K.W, s: K.S,
        espacio: K.SPACE, reiniciar: K.R
      });
      this.input.keyboard.addCapture('LEFT,RIGHT,UP,DOWN,SPACE');
    }

    crearBoton(x, y, radio, etiqueta, alPulsar, alSoltar, tamanoTexto) {
      const circulo = this.add.circle(x, y, radio, 0xffffff, 0.22)
        .setStrokeStyle(3, 0xffffff, 0.8)
        .setScrollFactor(0).setDepth(20)
        .setInteractive();
      this.add.text(x, y, etiqueta, {
        fontFamily: FUENTE, fontSize: (tamanoTexto || 22) + 'px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

      circulo.on('pointerdown', () => { circulo.setFillStyle(0xfacc15, 0.5); alPulsar(); });
      const soltar = () => { circulo.setFillStyle(0xffffff, 0.22); if (alSoltar) alSoltar(); };
      circulo.on('pointerup', soltar);
      circulo.on('pointerout', soltar);
    }

    crearControlesTactiles() {
      this.input.addPointer(3);
      const cx = 100, cy = 495, d = 64, r = 29;
      this.crearBoton(cx, cy - d, r, '▲', () => this.entrada.arr = true, () => this.entrada.arr = false);
      this.crearBoton(cx, cy + d, r, '▼', () => this.entrada.aba = true, () => this.entrada.aba = false);
      this.crearBoton(cx - d, cy, r, '◀', () => this.entrada.izq = true, () => this.entrada.izq = false);
      this.crearBoton(cx + d, cy, r, '▶', () => this.entrada.der = true, () => this.entrada.der = false);
      this.crearBoton(ANCHO - 90, 510, 52, 'ESCANEAR', () => this.escanear(), null, 13);
    }

    update() {
      if (this.finalizado) {
        if (Phaser.Input.Keyboard.JustDown(this.teclas.reiniciar)) this.scene.restart();
        return;
      }

      const t = this.teclas;
      const dx = ((t.der.isDown || t.d.isDown || this.entrada.der) ? 1 : 0)
               - ((t.izq.isDown || t.a.isDown || this.entrada.izq) ? 1 : 0);
      const dy = ((t.aba.isDown || t.s.isDown || this.entrada.aba) ? 1 : 0)
               - ((t.arr.isDown || t.w.isDown || this.entrada.arr) ? 1 : 0);

      if (dx !== 0 || dy !== 0) {
        const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(VELOCIDAD);
        this.rover.setVelocity(v.x, v.y);
        this.anguloObjetivo = Math.atan2(dy, dx);
      } else {
        this.rover.setVelocity(0, 0);
      }
      this.rover.rotation = Phaser.Math.Angle.RotateTo(this.rover.rotation, this.anguloObjetivo, 0.18);

      if (Phaser.Input.Keyboard.JustDown(t.espacio)) this.escanear();

      this.actualizarGuia();
    }

    misionMasCercana() {
      let mejor = null, distMin = Infinity;
      this.misiones.forEach((m) => {
        if (m.escaneada) return;
        const d = Phaser.Math.Distance.Between(this.rover.x, this.rover.y, m.x, m.y);
        if (d < distMin) { distMin = d; mejor = m; }
      });
      return mejor ? { mision: mejor, distancia: distMin } : null;
    }

    actualizarGuia() {
      const zona = ZONAS[Math.min(2, Math.floor(this.rover.x / 800))];
      this.txtZona.setText('Zona: ' + zona.nombre).setColor(zona.color);

      const cercana = this.misionMasCercana();
      if (!cercana) { this.flecha.setVisible(false); this.txtGuia.setText(''); return; }

      const ang = Phaser.Math.Angle.Between(this.rover.x, this.rover.y, cercana.mision.x, cercana.mision.y);
      this.flecha.setVisible(cercana.distancia > 140);
      this.flecha.setPosition(this.rover.x + Math.cos(ang) * 56, this.rover.y + Math.sin(ang) * 56);
      this.flecha.setRotation(ang);
      this.txtGuia.setText('Cercana: ' + cercana.mision.nombre + ' (' + Math.round(cercana.distancia) + ' m)');
    }

    escanear() {
      if (this.finalizado) return;

      const onda = { r: 10, a: 0.8 };
      this.tweens.add({
        targets: onda, r: RADIO_ESCANEO, a: 0, duration: 450,
        onUpdate: () => {
          this.pulso.clear();
          this.pulso.lineStyle(4, 0x38bdf8, onda.a);
          this.pulso.strokeCircle(this.rover.x, this.rover.y, onda.r);
        },
        onComplete: () => this.pulso.clear()
      });

      const objetivo = this.misiones.find((m) =>
        !m.escaneada &&
        Phaser.Math.Distance.Between(this.rover.x, this.rover.y, m.x, m.y) <= RADIO_ESCANEO
      );

      if (objetivo) {
        this.recolectar(objetivo);
      } else {
        this.mostrarPanel('Sin señal', 'No hay misión en el rango de escaneo. Acércate a una baliza.', '#fca5a5', 2500);
      }
    }

    recolectar(m) {
      m.escaneada = true;
      m.baliza.setTint(0x4ade80);
      this.tweens.killTweensOf(m.baliza);
      m.baliza.setScale(1).setAlpha(1);
      m.etiqueta.setColor('#86efac');

      this.puntos += PUNTOS_MISION;
      this.recogidas += 1;
      this.actualizarHud();

      const flota = this.add.text(m.x, m.y - 30, '+' + PUNTOS_MISION, {
        fontFamily: FUENTE, fontSize: '26px', fontStyle: 'bold', color: '#fde047', stroke: '#000000', strokeThickness: 5
      }).setOrigin(0.5).setDepth(8);
      this.tweens.add({
        targets: flota, y: m.y - 100, alpha: 0, duration: 1100,
        onComplete: () => flota.destroy()
      });

      this.mostrarPanel(m.nombre, m.dato, ZONAS[m.zona].color, 7500);

      if (this.recogidas === MISIONES.length) {
        this.time.delayedCall(2500, () => this.finalizar());
      }
    }

    finalizar() {
      this.finalizado = true;
      this.rover.setVelocity(0, 0);
      this.puntos += PUNTOS_BONO;
      this.actualizarHud();
      this.panel.setVisible(false);

      const capa = this.add.rectangle(ANCHO / 2, ALTO / 2, ANCHO, ALTO, 0x000000, 0.8)
        .setScrollFactor(0).setDepth(30).setInteractive();
      this.add.text(ANCHO / 2, 200, 'MISIÓN CUMPLIDA', {
        fontFamily: FUENTE, fontSize: '48px', fontStyle: 'bold', color: '#fde047'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
      this.add.text(ANCHO / 2, 285, 'Escaneaste las 10 misiones.\nBono final: +' + PUNTOS_BONO + '\nPuntos totales: ' + this.puntos, {
        fontFamily: FUENTE, fontSize: '26px', color: '#ffffff', align: 'center', lineSpacing: 8
      }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
      this.add.text(ANCHO / 2, 430, 'Pulsa R o toca la pantalla para jugar otra vez', {
        fontFamily: FUENTE, fontSize: '18px', color: '#93c5fd'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(31);

      capa.on('pointerdown', () => this.scene.restart());
    }
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: ANCHO,
    height: ALTO,
    backgroundColor: '#05070f',
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: { mode: Phaser.Scale.NONE },
    input: { activePointers: 4 },
    scene: [EscenaJuego]
  });
})();
