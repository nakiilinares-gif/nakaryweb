// Contenido inicial de la web (el de tu página de Gemini). Todo se puede editar desde el panel.
export const DEFAULT_LOGO = 'https://lh3.googleusercontent.com/d/1MMuaT-13lxdtzwUkGIQgNUOua6OYkLbm';
export const DEFAULT_FOTO = 'https://lh3.googleusercontent.com/d/1HzFWKQ0K-wX8--s_sLp2ikNlqEOSkqfJ';

export const DEFAULT_SITE = {
  brandSubtitle: 'COACH & PERSONAL TRAINER WELLNESS',

  heroLinea1: 'Diseña tu',
  heroLinea2: 'mejor versión',
  heroTexto: 'Selecciona una categoría para comenzar tu transformación:',

  filosofiaA: 'No se trata de cambiar quién eres, sino de',
  filosofiaB: 'liberar',
  filosofiaC: 'a la mujer fuerte que ya vive en ti.',
  filosofiaTexto:
    'Creo en un enfoque donde la estética es el resultado natural de una salud óptima. Mi compromiso es guiarte hacia una transformación sostenible, inteligente y profundamente empoderadora.',
  stats: [
    { valor: '100%', etiqueta: 'Compromiso' },
    { valor: '+Resultados', etiqueta: 'Método ECI' },
  ],

  servicios: [
    {
      icono: 'apple',
      titulo: 'Nutrición Consciente',
      desc: 'Aprende a nutrir tu cuerpo sin restricciones, enfocándote en alimentos reales que potencien tu energía y salud.',
      detalle: 'Guía alimenticia personalizada, educación nutricional y recetas saludables.',
      enlace: '#planes',
    },
    {
      icono: 'dumbbell',
      titulo: 'Planes de Entrenamiento',
      desc: 'Servicios presenciales y online diseñados bajo el método ECI para resultados serios y guiados.',
      detalle: 'Evaluación inicial, pesaje, seguimiento y planes personalizados.',
      enlace: '#planes',
    },
    {
      icono: 'camera',
      titulo: 'Evolución & Resultados',
      desc: 'Mira el impacto real de la constancia. Galería de procesos y testimonios de transformación integral.',
      detalle: 'Casos de éxito, cambios físicos y evolución de hábitos.',
      enlace: '#resultados',
    },
  ],

  planes: [
    {
      nombre: 'Entrenamiento Presencial',
      badge: 'Sede Valencia',
      icono: 'users',
      descripcion: 'Acompañamiento directo y corrección técnica en tiempo real.',
      precio: '70',
      moneda: '€',
      periodo: '/ Mes',
      tituloLista: 'Metodología Incluida',
      items: [
        'Asistencia 5 días a la semana',
        'Evaluación antropométrica inicial',
        'Pesaje y control de medidas mensual',
        'Corrección de postura y técnica ECI',
      ],
      idealPara:
        'Mujeres que buscan máxima disciplina, motivación grupal y supervisión constante para evitar lesiones y asegurar resultados.',
      boton: 'Quiero Empezar Presencial',
      destacado: true,
    },
    {
      nombre: 'Asesoría Online',
      badge: 'Sin Fronteras',
      icono: 'globe',
      descripcion: 'Entrena desde donde estés con una estructura profesional.',
      precio: '60',
      moneda: '€',
      periodo: '/ Mes',
      tituloLista: 'Soporte & Herramientas',
      items: [
        'Plan de entrenamiento vía WhatsApp',
        'Guía de ejercicios con videos/fotos',
        'Check-in semanal de progresos',
        'Resolución de dudas técnica online',
        'Adaptación del plan a tu espacio/equipo',
      ],
      idealPara:
        'Personas con horarios rotativos o que viajan mucho, que ya tienen una base de disciplina pero necesitan un plan experto para avanzar.',
      boton: 'Solicitar Plan Online',
      destacado: false,
    },
  ],

  whatsapp: 'https://wa.me/message/YONGDDTHAIDLP1',
  instagram: 'https://www.instagram.com/nakilinares',
  email: 'nakiilinares@gmail.com',
};

export const DEFAULT_CASOS = [
  {
    id: 'inicial-1',
    orden: 1,
    nombre: 'Proceso 1',
    imagen: 'https://lh3.googleusercontent.com/d/1sMwQMQrSghgp3N4nt7aJvFNHPHpS0ccn',
    testimonio: 'Transformación integral enfocada en salud y bienestar.',
    visible: true,
  },
  {
    id: 'inicial-2',
    orden: 2,
    nombre: 'Proceso 2',
    imagen: 'https://lh3.googleusercontent.com/d/1GFGJReANDm0B7ZumUIhtLE1po453qJwH',
    testimonio: 'El poder de entrenar con intención y estructura.',
    visible: true,
  },
];
