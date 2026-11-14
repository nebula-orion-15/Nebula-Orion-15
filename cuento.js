/* ==========================================================
   cuento.js — Historia interactiva (bilingüe)
   Cada texto tiene versión en español (es) e inglés (en).
   Para agregar una escena, copia un bloque y cambia las claves.
   ========================================================== */
const historia = {
  inicio: {
    texto: {
      es: "Año 2035. Eres una unidad de reconocimiento enviada al Mar de la Tranquilidad en la Luna. Frente a ti yace el módulo de descenso del Apollo 11, cubierto por una fina capa de polvo lunar intacta desde 1969.",
      en: "Year 2035. You are a reconnaissance unit sent to the Sea of Tranquility on the Moon. Before you lies the Apollo 11 descent module, covered by a thin layer of lunar dust untouched since 1969."
    },
    opciones: [
      { texto: { es: "Escanear el sismógrafo pasivo", en: "Scan the passive seismometer" }, destino: "sismografo" },
      { texto: { es: "Viajar hacia el cráter donde descansa Surveyor 3", en: "Travel to the crater where Surveyor 3 rests" }, destino: "surveyor" }
    ]
  },
  sismografo: {
    texto: {
      es: "Tus sensores detectan los restos del experimento sísmico. Gracias a este equipo abandonado, la Tierra supo que la Luna tiene 'lunamotos' que duran hasta una hora.",
      en: "Your sensors detect the remains of the seismic experiment. Thanks to this abandoned equipment, Earth learned that the Moon has 'moonquakes' that last up to an hour."
    },
    opciones: [
      { texto: { es: "Continuar hacia Marte", en: "Continue to Mars" }, destino: "marte" },
      { texto: { es: "Volver al inicio", en: "Back to the start" }, destino: "inicio" }
    ]
  },
  surveyor: {
    texto: {
      es: "Encuentras la sonda Surveyor 3, aterrizada en 1967. Aún se distinguen las marcas donde los astronautas del Apollo 12 retiraron su cámara para estudiarla en la Tierra.",
      en: "You find the Surveyor 3 probe, which landed in 1967. You can still make out the marks where the Apollo 12 astronauts removed its camera to study it back on Earth."
    },
    opciones: [
      { texto: { es: "Continuar hacia Marte", en: "Continue to Mars" }, destino: "marte" },
      { texto: { es: "Volver al inicio", en: "Back to the start" }, destino: "inicio" }
    ]
  },
  marte: {
    texto: {
      es: "Tras cruzar el espacio interplanetario, aterrizas en el cráter Jezero de Marte. A lo lejos divisas las aspas inmóviles del helicóptero Ingenuity, que logró 72 vuelos históricos antes de retirarse en 2024.",
      en: "After crossing interplanetary space, you land in Mars's Jezero crater. In the distance you spot the motionless blades of the Ingenuity helicopter, which made 72 historic flights before retiring in 2024."
    },
    opciones: [
      { texto: { es: "Ir a la sección de juegos", en: "Go to the games section" }, destino: "ir_juego" },
      { texto: { es: "Reiniciar la historia", en: "Restart the story" }, destino: "inicio" }
    ]
  }
};

let escenaActual = "inicio";

function cargarEscena(clave, animar) {
  if (clave === "ir_juego") {
    window.location.href = "juegos.html";
    return;
  }

  const nodo = historia[clave];
  const textoEl = document.getElementById("story-text");
  const opcionesEl = document.getElementById("story-choices");
  const cajaEl = document.getElementById("story-container");

  if (!nodo || !textoEl || !opcionesEl) return;

  escenaActual = clave;
  textoEl.textContent = Idioma.pick(nodo.texto);
  opcionesEl.innerHTML = "";

  nodo.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = Idioma.pick(op.texto);
    btn.onclick = () => cargarEscena(op.destino, true);
    opcionesEl.appendChild(btn);
  });

  // Reinicia la animación de entrada en cada escena nueva
  if (cajaEl && animar) {
    cajaEl.classList.remove("swap");
    void cajaEl.offsetWidth;
    cajaEl.classList.add("swap");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarEscena("inicio", true);
});

// Al cambiar de idioma se vuelve a pintar la escena actual (sin perder el progreso)
document.addEventListener("langchange", () => cargarEscena(escenaActual, false));
