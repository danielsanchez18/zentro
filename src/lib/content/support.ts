/**
 * Datos de contacto y soporte de Zentro.
 * Fuente única para la landing (Contacto, Footer, menú móvil, legales)
 * y para la Ayuda del Hub, para que nunca muestren datos distintos.
 */
export const SUPPORT = {
  whatsapp: {
    label: "+51 919 728 725",
    href: "https://wa.me/51919728725",
  },
  email: {
    label: "usezentroapp@gmail.com",
    href: "mailto:usezentroapp@gmail.com",
  },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/hi_zentro/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61594794815182" },
  ],
  responseTime: "Respondemos en un plazo de 24 a 48 horas hábiles.",
  /** Duración de la prueba gratuita que se promete en la landing. */
  trialDays: 30,
} as const;
