import { SUPPORT } from "@/lib/content/support";
import type { LegalDoc } from "./types";

export const terms: LegalDoc = {
  intro:
    "Estos términos y condiciones regulan el uso de la plataforma Zentro. Al acceder y utilizar nuestros servicios, aceptas cumplir con estos términos.",
  updatedAt: "octubre de 2026",
  sections: [
    {
      id: "uso-del-servicio",
      title: "Uso del servicio",
      paragraphs: [
        "Debes utilizar Zentro de acuerdo con la ley y respetando estos términos. No está permitido utilizarlo para fines ilegales o que perjudiquen a terceros.",
      ],
    },
    {
      id: "cuentas-y-seguridad",
      title: "Cuentas y seguridad",
      paragraphs: [
        "Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad que ocurra bajo tu cuenta.",
      ],
    },
    {
      id: "propiedad-intelectual",
      title: "Propiedad intelectual",
      paragraphs: [
        "Todo el contenido, marcas, logos y código de Zentro son propiedad de sus respectivos titulares y están protegidos por leyes de propiedad intelectual.",
      ],
    },
    {
      id: "modificaciones",
      title: "Modificaciones",
      paragraphs: [
        "Podemos modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor al publicarse en esta página.",
      ],
    },
    {
      id: "contacto",
      title: "Contacto",
      paragraphs: [
        `Si tienes dudas sobre estos términos, puedes escribirnos a ${SUPPORT.email.label} o desde nuestra página de contacto.`,
      ],
    },
  ],
};
