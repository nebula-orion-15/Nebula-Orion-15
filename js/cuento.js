const historia = {
  inicio: {
    texto: "Año 2035. Eres una unidad de reconocimiento enviada al Mar de la Tranquilidad en la Luna. Frente a ti yace el módulo de descenso del Apollo 11, cubierto por una fina capa de polvo lunar intacta desde 1969.",
    opciones: [
      { texto: "Escanear el sismógrafo pasivo", destino: "sismografo" },
      { texto: "Viajar hacia el cráter donde descansa Surveyor 3", destino: "surveyor" }
    ]
  },
  sismografo: {
    texto: "Tus sensores detectan los restos del experimento sísmico. Gracias a este equipo abandonado, la Tierra supo que la Luna tiene 'lunamotos' que duran hasta una hora.",
    opciones: [
      { texto: "Continuar hacia Marte", destino: "marte" },
      { texto: "Volver al inicio", destino: "inicio" }
    ]
  },
  surveyor: {
    texto: "Encuentras la sonda Surveyor 3, aterrizada en 1967. Aún se distinguen las marcas donde los astronautas del Apollo 12 retiraron su cámara para estudiarla en la Tierra.",
    opciones: [
      { texto: "Continuar hacia Marte", destino: "marte" },
      { texto: "Volver al inicio", destino: "inicio" }
    ]
  },
  marte: {
    texto: "Tras cruzar el espacio interplanetario, aterrizas en el cráter Jezero de Marte. A lo lejos divisas las aspas inmóviles del helicóptero Ingenuity, que logró 72 vuelos históricos antes de retirarse en 2024.",
    opciones: [
      { texto: "Ir a jugar el simulador de escaneo", destino: "ir_juego" },
      { texto: "Reiniciar la historia", destino: "inicio" }
    ]
  }
};

function cargarEscena(clave) {
  if (clave === "ir_juego") {
    window.location.href = "juego.html";
    return;
  }

  const nodo = historia[clave];
  const textoEl = document.getElementById("story-text");
  const opcionesEl = document.getElementById("story-choices");

  if (!nodo || !textoEl || !opcionesEl) return;

  textoEl.textContent = nodo.texto;
  opcionesEl.innerHTML = "";

  nodo.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = op.texto;
    btn.onclick = () => cargarEscena(op.destino);
    opcionesEl.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarEscena("inicio");
});
