/* =============================================================
   contenido.js  —  Aquí vive todo lo que se puede cambiar.
   Si quieres editar un texto, cámbialo AQUÍ. Nada más.
   ============================================================= */

const CONTENIDO = {

  /* --- Lo básico --- */
  nombre: "Carolina",
  apodo: "Cachetes",
  firma: "Tuyo, siempre — Jose David",

  /* --- Pantalla de inicio --- */
  hero: {
    saludo: "Para ti,",
    titulo: "Cachetes",
    subtitulo: "Hice una rosa que nunca se marchita, porque ninguna flor de verdad duraba lo que quiero quererte.",
    scroll: "desliza hacia abajo"
  },

  /* --- La carta (perdón, comunicación y amor) --- */
  carta: {
    titulo: "Lo que te quería decir",
    frase: "El amor no es no equivocarse nunca: es tener el valor de decirlo, la humildad de pedir perdón y la paciencia de volver a empezar contigo.",
    parrafos: [
      "Aprendí que perdonar no es olvidar lo que pasó, es decidir que lo nuestro vale más que el orgullo. Y contigo siempre vale más.",
      "Aprendí que callarme para no pelear era la manera más lenta de perderte. Prefiero mil conversaciones difíciles antes que un solo silencio que nos separe.",
      "Aprendí que hablar contigo, hasta cuando duele, es también una forma de amarte. Porque el que se queda a explicar, se queda.",
      "Y te amo así: sin adornos, sin condiciones, con mis errores y con todas las ganas de hacerlo mejor mañana."
    ]
  },

  /* --- Tarjetas que se voltean (haz clic para descubrirlas) --- */
  razones: {
    titulo: "Razones",
    subtitulo: "Toca cada una",
    tarjetas: [
      { frente: "Por tu risa",        reverso: "Porque cuando te ríes se me olvida cualquier problema que traía." },
      { frente: "Por tu paciencia",   reverso: "Porque me has esperado en días en los que ni yo me aguantaba." },
      { frente: "Por cómo hablamos",  reverso: "Porque contigo aprendí que decir 'me dolió' también es decir 'te quiero'." },
      { frente: "Por tus perdones",   reverso: "Porque me perdonaste cuando yo no sabía cómo perdonarme." },
      { frente: "Por tus cachetes",   reverso: "Por eso te digo Cachetes. Y por eso no te voy a decir de otra forma." },
      { frente: "Por lo que viene",   reverso: "Porque todavía nos faltan miles de días y quiero verlos todos contigo." }
    ]
  },

  /* --- Jardín interactivo --- */
  jardin: {
    titulo: "Siembra un jardín",
    subtitulo: "Toca la pantalla y mira lo que crece",
    mensajes: [
      "Te amo",
      "Perdóname",
      "Gracias por quedarte",
      "Hablemos siempre",
      "Eres mi calma",
      "Contigo aprendí",
      "Mi lugar favorito",
      "Siempre tú",
      "Te elijo hoy otra vez",
      "Mi Cachetes"
    ]
  },

  /* --- Final --- */
  final: {
    titulo: "Te amo, Cachetes",
    texto: "Si algún día dudas de cuánto, vuelve a abrir esta página. Aquí siempre va a estar floreciendo.",
    boton: "Presiona aquí"
  }
};

/* deja el contenido disponible para el resto de los scripts */
window.CONTENIDO = CONTENIDO;
