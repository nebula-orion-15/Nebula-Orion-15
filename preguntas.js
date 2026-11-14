/* ==========================================================
   preguntas.js — BANCO DE PREGUNTAS Y CONFIGURACIÓN DE LA TRIVIA
   (bilingüe: español e inglés)

   ► Para AGREGAR una pregunta, copia un bloque completo { es: {...}, en: {...} }
     y cámbiale los textos. Para EDITAR, solo cambia el texto.
     Para QUITAR, borra el bloque completo (con su coma).

   Cada pregunta tiene una versión por idioma (es / en) con:
     pregunta     → el texto de la pregunta
     correcta     → la respuesta correcta
     incorrectas  → las respuestas equivocadas (mínimo 1, recomendado 3)
     dato         → (opcional) dato curioso que se muestra al responder

   Si a una pregunta le falta la versión "en", se mostrará en español.
   NO importa el orden de las respuestas: el juego las mezcla solo.
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
    es: {
      pregunta: '¿En qué año pisó el ser humano la Luna por primera vez?',
      correcta: '1969',
      incorrectas: ['1961', '1972', '1957'],
      dato: 'Apollo 11 aterrizó en el Mar de la Tranquilidad el 20 de julio de 1969.'
    },
    en: {
      pregunta: 'In what year did humans first set foot on the Moon?',
      correcta: '1969',
      incorrectas: ['1961', '1972', '1957'],
      dato: 'Apollo 11 landed in the Sea of Tranquility on July 20, 1969.'
    }
  },
  {
    es: {
      pregunta: '¿Quién fue el primer ser humano en caminar sobre la Luna?',
      correcta: 'Neil Armstrong',
      incorrectas: ['Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'],
      dato: 'Buzz Aldrin lo siguió unos 19 minutos después; Michael Collins esperó en órbita.'
    },
    en: {
      pregunta: 'Who was the first human to walk on the Moon?',
      correcta: 'Neil Armstrong',
      incorrectas: ['Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'],
      dato: 'Buzz Aldrin followed about 19 minutes later; Michael Collins waited in orbit.'
    }
  },
  {
    es: {
      pregunta: '¿Qué astronauta se quedó en órbita lunar durante el alunizaje del Apollo 11?',
      correcta: 'Michael Collins',
      incorrectas: ['Neil Armstrong', 'Buzz Aldrin', 'Alan Shepard'],
      dato: 'Collins pilotó el módulo de comando Columbia mientras sus compañeros estaban en la superficie.'
    },
    en: {
      pregunta: 'Which astronaut stayed in lunar orbit during the Apollo 11 landing?',
      correcta: 'Michael Collins',
      incorrectas: ['Neil Armstrong', 'Buzz Aldrin', 'Alan Shepard'],
      dato: 'Collins piloted the Columbia command module while his crewmates were on the surface.'
    }
  },
  {
    es: {
      pregunta: '¿Cuántas personas han caminado sobre la Luna?',
      correcta: '12',
      incorrectas: ['6', '10', '24'],
      dato: 'Fueron 12 astronautas en seis misiones Apollo, entre 1969 y 1972.'
    },
    en: {
      pregunta: 'How many people have walked on the Moon?',
      correcta: '12',
      incorrectas: ['6', '10', '24'],
      dato: 'It was 12 astronauts on six Apollo missions, between 1969 and 1972.'
    }
  },
  {
    es: {
      pregunta: '¿Qué misión usó por primera vez el Vehículo Lunar (Lunar Rover)?',
      correcta: 'Apollo 15',
      incorrectas: ['Apollo 11', 'Apollo 12', 'Apollo 8'],
      dato: 'Apollo 15 (1971) permitió a los astronautas explorar mucho más lejos de su módulo.'
    },
    en: {
      pregunta: 'Which mission first used the Lunar Roving Vehicle?',
      correcta: 'Apollo 15',
      incorrectas: ['Apollo 11', 'Apollo 12', 'Apollo 8'],
      dato: 'Apollo 15 (1971) let astronauts explore much farther from their module.'
    }
  },
  {
    es: {
      pregunta: '¿Qué misión aterrizó cerca de la sonda Surveyor 3 y recuperó piezas de ella?',
      correcta: 'Apollo 12',
      incorrectas: ['Apollo 11', 'Apollo 14', 'Apollo 17'],
      dato: 'Las piezas de Surveyor 3 se estudiaron en la Tierra para ver cómo resistió el ambiente lunar.'
    },
    en: {
      pregunta: 'Which mission landed near the Surveyor 3 probe and recovered parts of it?',
      correcta: 'Apollo 12',
      incorrectas: ['Apollo 11', 'Apollo 14', 'Apollo 17'],
      dato: 'Parts of Surveyor 3 were studied on Earth to see how it withstood the lunar environment.'
    }
  },
  {
    es: {
      pregunta: '¿Qué instrumento dejado en la Luna detectó los "lunamotos"?',
      correcta: 'Un sismógrafo',
      incorrectas: ['Un telescopio', 'Un magnetómetro solar', 'Un radar de superficie'],
      dato: 'Los sismómetros del programa Apollo registraron lunamotos que duraban hasta una hora.'
    },
    en: {
      pregunta: 'Which instrument left on the Moon detected "moonquakes"?',
      correcta: 'A seismometer',
      incorrectas: ['A telescope', 'A solar magnetometer', 'A surface radar'],
      dato: 'The Apollo seismometers recorded moonquakes lasting up to an hour.'
    }
  },
  {
    es: {
      pregunta: '¿Cómo se llamó el primer rover que rodó sobre Marte?',
      correcta: 'Sojourner',
      incorrectas: ['Curiosity', 'Opportunity', 'Spirit'],
      dato: 'Sojourner viajó con la misión Mars Pathfinder, que aterrizó en 1997.'
    },
    en: {
      pregunta: 'What was the first rover to roll on Mars called?',
      correcta: 'Sojourner',
      incorrectas: ['Curiosity', 'Opportunity', 'Spirit'],
      dato: 'Sojourner traveled with the Mars Pathfinder mission, which landed in 1997.'
    }
  },
  {
    es: {
      pregunta: '¿Qué dos rovers gemelos llegaron a Marte en 2004?',
      correcta: 'Spirit y Opportunity',
      incorrectas: ['Sojourner y Curiosity', 'Viking 1 y Viking 2', 'Perseverance e Ingenuity'],
      dato: 'Opportunity siguió funcionando casi 15 años, mucho más de lo planeado.'
    },
    en: {
      pregunta: 'Which twin rovers arrived on Mars in 2004?',
      correcta: 'Spirit and Opportunity',
      incorrectas: ['Sojourner and Curiosity', 'Viking 1 and Viking 2', 'Perseverance and Ingenuity'],
      dato: 'Opportunity kept working for almost 15 years, far longer than planned.'
    }
  },
  {
    es: {
      pregunta: '¿Cuál fue el primer helicóptero en volar en otro planeta?',
      correcta: 'Ingenuity',
      incorrectas: ['Dragonfly', 'Perseverance', 'Sojourner'],
      dato: 'Ingenuity hizo su primer vuelo en 2021 y completó 72 vuelos en total.'
    },
    en: {
      pregunta: 'What was the first helicopter to fly on another planet?',
      correcta: 'Ingenuity',
      incorrectas: ['Dragonfly', 'Perseverance', 'Sojourner'],
      dato: 'Ingenuity made its first flight in 2021 and completed 72 flights in total.'
    }
  },
  {
    es: {
      pregunta: '¿En qué cráter de Marte aterrizó el rover Perseverance?',
      correcta: 'Jezero',
      incorrectas: ['Gale', 'Gusev', 'Endeavour'],
      dato: 'Jezero albergó un antiguo lago, un lugar ideal para buscar señales de vida pasada.'
    },
    en: {
      pregunta: 'In which Martian crater did the Perseverance rover land?',
      correcta: 'Jezero',
      incorrectas: ['Gale', 'Gusev', 'Endeavour'],
      dato: 'Jezero once held an ancient lake, an ideal place to look for signs of past life.'
    }
  },
  {
    es: {
      pregunta: '¿Qué misión usó la gravedad de Marte en 2009 y luego orbitó Vesta y Ceres?',
      correcta: 'Dawn',
      incorrectas: ['Pioneer 10', 'Mariner 4', 'Voyager 2'],
      dato: 'Dawn fue la primera sonda en orbitar dos cuerpos distintos del cinturón de asteroides.'
    },
    en: {
      pregunta: "Which mission used Mars' gravity in 2009 and later orbited Vesta and Ceres?",
      correcta: 'Dawn',
      incorrectas: ['Pioneer 10', 'Mariner 4', 'Voyager 2'],
      dato: 'Dawn was the first probe to orbit two different bodies in the asteroid belt.'
    }
  },
  {
    es: {
      pregunta: '¿Qué sonda fue la primera en cruzar el cinturón de asteroides?',
      correcta: 'Pioneer 10',
      incorrectas: ['Voyager 1', 'Mariner 10', 'Galileo'],
      dato: 'Lanzada en 1972, Pioneer 10 sobrevoló Júpiter en 1973.'
    },
    en: {
      pregunta: 'Which probe was the first to cross the asteroid belt?',
      correcta: 'Pioneer 10',
      incorrectas: ['Voyager 1', 'Mariner 10', 'Galileo'],
      dato: 'Launched in 1972, Pioneer 10 flew past Jupiter in 1973.'
    }
  },
  {
    es: {
      pregunta: '¿Qué buscaba principalmente el telescopio espacial Kepler?',
      correcta: 'Exoplanetas',
      incorrectas: ['Agujeros negros', 'Asteroides cercanos', 'Agua en la Luna'],
      dato: 'Kepler descubrió miles de planetas fuera de nuestro sistema solar.'
    },
    en: {
      pregunta: 'What was the Kepler space telescope mainly looking for?',
      correcta: 'Exoplanets',
      incorrectas: ['Black holes', 'Near-Earth asteroids', 'Water on the Moon'],
      dato: 'Kepler discovered thousands of planets outside our solar system.'
    }
  },
  {
    es: {
      pregunta: '¿Qué telescopio espacial fue lanzado en 1990?',
      correcta: 'Hubble',
      incorrectas: ['James Webb', 'Kepler', 'Spitzer'],
      dato: 'El Hubble sigue regalándonos imágenes del universo después de más de 30 años.'
    },
    en: {
      pregunta: 'Which space telescope was launched in 1990?',
      correcta: 'Hubble',
      incorrectas: ['James Webb', 'Kepler', 'Spitzer'],
      dato: 'Hubble keeps giving us images of the universe after more than 30 years.'
    }
  },
  {
    es: {
      pregunta: '¿Cuál fue el primer satélite artificial de la historia?',
      correcta: 'Sputnik 1',
      incorrectas: ['Explorer 1', 'Vanguard 1', 'Telstar 1'],
      dato: 'La Unión Soviética lo lanzó en octubre de 1957 e inició la carrera espacial.'
    },
    en: {
      pregunta: 'What was the first artificial satellite in history?',
      correcta: 'Sputnik 1',
      incorrectas: ['Explorer 1', 'Vanguard 1', 'Telstar 1'],
      dato: 'The Soviet Union launched it in October 1957, starting the space race.'
    }
  },
  {
    es: {
      pregunta: '¿Qué animal fue el primer ser vivo en orbitar la Tierra?',
      correcta: 'Laika, una perra',
      incorrectas: ['Ham, un chimpancé', 'Félicette, una gata', 'Albert, un mono'],
      dato: 'Laika viajó a bordo del Sputnik 2 en 1957.'
    },
    en: {
      pregunta: 'Which animal was the first living being to orbit the Earth?',
      correcta: 'Laika, a dog',
      incorrectas: ['Ham, a chimpanzee', 'Félicette, a cat', 'Albert, a monkey'],
      dato: 'Laika flew aboard Sputnik 2 in 1957.'
    }
  },
  {
    es: {
      pregunta: '¿En qué año se fundó la NASA?',
      correcta: '1958',
      incorrectas: ['1947', '1961', '1969'],
      dato: 'La NASA nació en 1958 y comenzó a operar el 1 de octubre de ese año.'
    },
    en: {
      pregunta: 'In what year was NASA founded?',
      correcta: '1958',
      incorrectas: ['1947', '1961', '1969'],
      dato: 'NASA was created in 1958 and began operating on October 1 of that year.'
    }
  },
  {
    es: {
      pregunta: '¿Cuál es el planeta más grande del sistema solar?',
      correcta: 'Júpiter',
      incorrectas: ['Saturno', 'Neptuno', 'Urano'],
      dato: 'Júpiter es tan grande que cabrían más de 1,000 Tierras dentro de él.'
    },
    en: {
      pregunta: 'What is the largest planet in the solar system?',
      correcta: 'Jupiter',
      incorrectas: ['Saturn', 'Neptune', 'Uranus'],
      dato: 'Jupiter is so big that more than 1,000 Earths would fit inside it.'
    }
  },
  {
    es: {
      pregunta: '¿Cuál es el planeta más cercano al Sol?',
      correcta: 'Mercurio',
      incorrectas: ['Venus', 'Marte', 'Tierra'],
      dato: 'Mercurio da una vuelta completa al Sol en apenas 88 días terrestres.'
    },
    en: {
      pregunta: 'Which planet is closest to the Sun?',
      correcta: 'Mercury',
      incorrectas: ['Venus', 'Mars', 'Earth'],
      dato: 'Mercury goes around the Sun in just 88 Earth days.'
    }
  },
  {
    es: {
      pregunta: '¿Cómo se llaman las dos lunas de Marte?',
      correcta: 'Fobos y Deimos',
      incorrectas: ['Titán y Encélado', 'Ío y Europa', 'Tritón y Nereida'],
      dato: 'Son pequeñas y de forma irregular; quizá son asteroides capturados.'
    },
    en: {
      pregunta: "What are the names of Mars' two moons?",
      correcta: 'Phobos and Deimos',
      incorrectas: ['Titan and Enceladus', 'Io and Europa', 'Triton and Nereid'],
      dato: 'They are small and irregularly shaped; they may be captured asteroids.'
    }
  },
  {
    es: {
      pregunta: '¿Aproximadamente cuánto tarda la luz del Sol en llegar a la Tierra?',
      correcta: '8 minutos',
      incorrectas: ['8 segundos', '1 hora', '1 día'],
      dato: 'La luz recorre unos 150 millones de kilómetros en poco más de 8 minutos.'
    },
    en: {
      pregunta: 'About how long does sunlight take to reach Earth?',
      correcta: '8 minutes',
      incorrectas: ['8 seconds', '1 hour', '1 day'],
      dato: 'Light travels about 150 million kilometers in a little over 8 minutes.'
    }
  },
  {
    es: {
      pregunta: '¿Cómo se llama la galaxia en la que vive la Tierra?',
      correcta: 'Vía Láctea',
      incorrectas: ['Andrómeda', 'Triángulo', 'Sombrero'],
      dato: 'La Vía Láctea es una galaxia espiral con cientos de miles de millones de estrellas.'
    },
    en: {
      pregunta: 'What is the name of the galaxy Earth lives in?',
      correcta: 'Milky Way',
      incorrectas: ['Andromeda', 'Triangulum', 'Sombrero'],
      dato: 'The Milky Way is a spiral galaxy with hundreds of billions of stars.'
    }
  },
  {
    es: {
      pregunta: '¿Qué telescopio observa el universo en infrarrojo y fue lanzado en diciembre de 2021?',
      correcta: 'James Webb',
      incorrectas: ['Hubble', 'Chandra', 'Fermi'],
      dato: 'El James Webb está en una órbita a unos 1.5 millones de km de la Tierra.'
    },
    en: {
      pregunta: 'Which telescope observes the universe in infrared and was launched in December 2021?',
      correcta: 'James Webb',
      incorrectas: ['Hubble', 'Chandra', 'Fermi'],
      dato: 'The James Webb orbits about 1.5 million km from Earth.'
    }
  },
  {
    es: {
      pregunta: '¿Qué sonda es hoy el objeto humano más lejano de la Tierra?',
      correcta: 'Voyager 1',
      incorrectas: ['Pioneer 10', 'New Horizons', 'Cassini'],
      dato: 'Voyager 1 fue lanzada en 1977 y ya viaja por el espacio interestelar.'
    },
    en: {
      pregunta: 'Which probe is now the most distant human-made object from Earth?',
      correcta: 'Voyager 1',
      incorrectas: ['Pioneer 10', 'New Horizons', 'Cassini'],
      dato: 'Voyager 1 was launched in 1977 and is now traveling through interstellar space.'
    }
  }
];
