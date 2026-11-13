/* ==========================================================
   preguntas.js — BANCO DE PREGUNTAS Y CONFIGURACIÓN DE LA TRIVIA

   ► Para AGREGAR una pregunta, copia un bloque { ... } y cámbiale
     los textos. Para EDITAR, solo cambia el texto. Para QUITAR,
     borra el bloque completo (con su coma).

   Cada pregunta tiene:
     pregunta     → el texto de la pregunta
     correcta     → la respuesta correcta
     incorrectas  → las respuestas equivocadas (mínimo 1, recomendado 3)
     dato         → (opcional) dato curioso que se muestra al responder

   NO importa el orden: el juego mezcla las respuestas solo,
   así que la correcta nunca queda siempre en la misma posición.
   ========================================================== */

window.TRIVIA_CONFIG = {
  numPreguntas: 10,     // preguntas por partida (se eligen al azar del banco)
  tiempoMin: 5,         // mínimo de segundos que se puede elegir
  tiempoMax: 60,        // máximo de segundos que se puede elegir
  tiempoDefecto: 15,    // segundos por pregunta al abrir el juego
  puntosAcierto: 50,    // puntos base por respuesta correcta
  bonoRapidez: 25,      // puntos extra máximos por responder rápido
  segundosPeligro: 5    // cuando queden estos segundos (o menos) empiezan las pulsaciones rojas
};

window.PREGUNTAS_TRIVIA = [
  {
    pregunta: '¿En qué año pisó el ser humano la Luna por primera vez?',
    correcta: '1969',
    incorrectas: ['1961', '1972', '1957'],
    dato: 'Apollo 11 aterrizó en el Mar de la Tranquilidad el 20 de julio de 1969.'
  },
  {
    pregunta: '¿Quién fue el primer ser humano en caminar sobre la Luna?',
    correcta: 'Neil Armstrong',
    incorrectas: ['Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'],
    dato: 'Buzz Aldrin lo siguió unos 19 minutos después; Michael Collins esperó en órbita.'
  },
  {
    pregunta: '¿Qué astronauta se quedó en órbita lunar durante el alunizaje del Apollo 11?',
    correcta: 'Michael Collins',
    incorrectas: ['Neil Armstrong', 'Buzz Aldrin', 'Alan Shepard'],
    dato: 'Collins pilotó el módulo de comando Columbia mientras sus compañeros estaban en la superficie.'
  },
  {
    pregunta: '¿Cuántas personas han caminado sobre la Luna?',
    correcta: '12',
    incorrectas: ['6', '10', '24'],
    dato: 'Fueron 12 astronautas en seis misiones Apollo, entre 1969 y 1972.'
  },
  {
    pregunta: '¿Qué misión usó por primera vez el Vehículo Lunar (Lunar Rover)?',
    correcta: 'Apollo 15',
    incorrectas: ['Apollo 11', 'Apollo 12', 'Apollo 8'],
    dato: 'Apollo 15 (1971) permitió a los astronautas explorar mucho más lejos de su módulo.'
  },
  {
    pregunta: '¿Qué misión aterrizó cerca de la sonda Surveyor 3 y recuperó piezas de ella?',
    correcta: 'Apollo 12',
    incorrectas: ['Apollo 11', 'Apollo 14', 'Apollo 17'],
    dato: 'Las piezas de Surveyor 3 se estudiaron en la Tierra para ver cómo resistió el ambiente lunar.'
  },
  {
    pregunta: '¿Qué instrumento dejado en la Luna detectó los "lunamotos"?',
    correcta: 'Un sismógrafo',
    incorrectas: ['Un telescopio', 'Un magnetómetro solar', 'Un radar de superficie'],
    dato: 'Los sismómetros del programa Apollo registraron lunamotos que duraban hasta una hora.'
  },
  {
    pregunta: '¿Cómo se llamó el primer rover que rodó sobre Marte?',
    correcta: 'Sojourner',
    incorrectas: ['Curiosity', 'Opportunity', 'Spirit'],
    dato: 'Sojourner viajó con la misión Mars Pathfinder, que aterrizó en 1997.'
  },
  {
    pregunta: '¿Qué dos rovers gemelos llegaron a Marte en 2004?',
    correcta: 'Spirit y Opportunity',
    incorrectas: ['Sojourner y Curiosity', 'Viking 1 y Viking 2', 'Perseverance e Ingenuity'],
    dato: 'Opportunity siguió funcionando casi 15 años, mucho más de lo planeado.'
  },
  {
    pregunta: '¿Cuál fue el primer helicóptero en volar en otro planeta?',
    correcta: 'Ingenuity',
    incorrectas: ['Dragonfly', 'Perseverance', 'Sojourner'],
    dato: 'Ingenuity hizo su primer vuelo en 2021 y completó 72 vuelos en total.'
  },
  {
    pregunta: '¿En qué cráter de Marte aterrizó el rover Perseverance?',
    correcta: 'Jezero',
    incorrectas: ['Gale', 'Gusev', 'Endeavour'],
    dato: 'Jezero albergó un antiguo lago, un lugar ideal para buscar señales de vida pasada.'
  },
  {
    pregunta: '¿Qué misión usó la gravedad de Marte en 2009 y luego orbitó Vesta y Ceres?',
    correcta: 'Dawn',
    incorrectas: ['Pioneer 10', 'Mariner 4', 'Voyager 2'],
    dato: 'Dawn fue la primera sonda en orbitar dos cuerpos distintos del cinturón de asteroides.'
  },
  {
    pregunta: '¿Qué sonda fue la primera en cruzar el cinturón de asteroides?',
    correcta: 'Pioneer 10',
    incorrectas: ['Voyager 1', 'Mariner 10', 'Galileo'],
    dato: 'Lanzada en 1972, Pioneer 10 sobrevoló Júpiter en 1973.'
  },
  {
    pregunta: '¿Qué buscaba principalmente el telescopio espacial Kepler?',
    correcta: 'Exoplanetas',
    incorrectas: ['Agujeros negros', 'Asteroides cercanos', 'Agua en la Luna'],
    dato: 'Kepler descubrió miles de planetas fuera de nuestro sistema solar.'
  },
  {
    pregunta: '¿Qué telescopio espacial fue lanzado en 1990?',
    correcta: 'Hubble',
    incorrectas: ['James Webb', 'Kepler', 'Spitzer'],
    dato: 'El Hubble sigue regalándonos imágenes del universo después de más de 30 años.'
  },
  {
    pregunta: '¿Cuál fue el primer satélite artificial de la historia?',
    correcta: 'Sputnik 1',
    incorrectas: ['Explorer 1', 'Vanguard 1', 'Telstar 1'],
    dato: 'La Unión Soviética lo lanzó en octubre de 1957 e inició la carrera espacial.'
  },
  {
    pregunta: '¿Qué animal fue el primer ser vivo en orbitar la Tierra?',
    correcta: 'Laika, una perra',
    incorrectas: ['Ham, un chimpancé', 'Félicette, una gata', 'Albert, un mono'],
    dato: 'Laika viajó a bordo del Sputnik 2 en 1957.'
  },
  {
    pregunta: '¿En qué año se fundó la NASA?',
    correcta: '1958',
    incorrectas: ['1947', '1961', '1969'],
    dato: 'La NASA nació en 1958 y comenzó a operar el 1 de octubre de ese año.'
  },
  {
    pregunta: '¿Cuál es el planeta más grande del sistema solar?',
    correcta: 'Júpiter',
    incorrectas: ['Saturno', 'Neptuno', 'Urano'],
    dato: 'Júpiter es tan grande que cabrían más de 1,000 Tierras dentro de él.'
  },
  {
    pregunta: '¿Cuál es el planeta más cercano al Sol?',
    correcta: 'Mercurio',
    incorrectas: ['Venus', 'Marte', 'Tierra'],
    dato: 'Mercurio da una vuelta completa al Sol en apenas 88 días terrestres.'
  },
  {
    pregunta: '¿Cómo se llaman las dos lunas de Marte?',
    correcta: 'Fobos y Deimos',
    incorrectas: ['Titán y Encélado', 'Ío y Europa', 'Tritón y Nereida'],
    dato: 'Son pequeñas y de forma irregular; quizá son asteroides capturados.'
  },
  {
    pregunta: '¿Aproximadamente cuánto tarda la luz del Sol en llegar a la Tierra?',
    correcta: '8 minutos',
    incorrectas: ['8 segundos', '1 hora', '1 día'],
    dato: 'La luz recorre unos 150 millones de kilómetros en poco más de 8 minutos.'
  },
  {
    pregunta: '¿Cómo se llama la galaxia en la que vive la Tierra?',
    correcta: 'Vía Láctea',
    incorrectas: ['Andrómeda', 'Triángulo', 'Sombrero'],
    dato: 'La Vía Láctea es una galaxia espiral con cientos de miles de millones de estrellas.'
  },
  {
    pregunta: '¿Qué telescopio observa el universo en infrarrojo y fue lanzado en diciembre de 2021?',
    correcta: 'James Webb',
    incorrectas: ['Hubble', 'Chandra', 'Fermi'],
    dato: 'El James Webb está en una órbita a unos 1.5 millones de km de la Tierra.'
  },
  {
    pregunta: '¿Qué sonda es hoy el objeto humano más lejano de la Tierra?',
    correcta: 'Voyager 1',
    incorrectas: ['Pioneer 10', 'New Horizons', 'Cassini'],
    dato: 'Voyager 1 fue lanzada en 1977 y ya viaja por el espacio interestelar.'
  }
];
