import type { ReactNode } from "react";
import Link from "next/link";
import {
  Boxes,
  CreditCard,
  LifeBuoy,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type FaqCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  questions: { question: string; answer: ReactNode }[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    description: "Qué es Zentro y cómo se usa",
    icon: Sparkles,
    questions: [
      {
        question: "¿Qué es Zentro?",
        answer:
          "Zentro es una plataforma para gestionar tu negocio en un solo lugar: catálogo, inventario, POS, pedidos, CRM, reportes, presencia digital y más.",
      },
      {
        question: "¿Para qué tipo de negocio sirve?",
        answer: (
          <>
            Se adapta a comercio físico o digital, servicios profesionales,
            restaurantes y empresas omnicanal. Su diseño modular te permite
            activar solo lo que necesitas. Mira ejemplos en{" "}
            <Link href="/casos-de-uso">Casos de uso</Link>.
          </>
        ),
      },
      {
        question: "¿Necesito instalar algo para usarlo?",
        answer:
          "No. Zentro funciona 100% en la web. Puedes usarlo desde cualquier navegador en computadora, tablet o móvil con conexión a internet.",
      },
      {
        question: "¿Funciona en móvil y tablet?",
        answer:
          "Sí. Está optimizado para cualquier dispositivo, ideal para puntos de venta y para gestionar tu negocio sobre la marcha.",
      },
    ],
  },
  {
    id: "planes",
    label: "Precios y planes",
    description: "Prueba gratis, cambios y facturación",
    icon: CreditCard,
    questions: [
      {
        question: "¿Puedo probar Zentro gratis?",
        answer:
          "Sí. Crea tu cuenta y prueba Zentro 30 días gratis, sin tarjeta de crédito y sin compromiso.",
      },
      {
        question: "¿Puedo cambiar de plan cuando quiera?",
        answer: (
          <>
            Sí. Puedes subir o bajar de plan en cualquier momento. Los cambios
            se aplican según tu ciclo de facturación actual. Compara opciones en{" "}
            <Link href="/planes">Planes</Link>.
          </>
        ),
      },
      {
        question: "¿Puedo cancelar mi suscripción?",
        answer:
          "Sí. Puedes cancelar desde tu panel de suscripciones cuando quieras. No hay permanencia forzosa y mantienes el acceso hasta el final del periodo pagado.",
      },
      {
        question: "¿Cómo funciona la facturación?",
        answer:
          "Según el plan elegido, la facturación puede ser mensual o anual. Recibirás tu factura automáticamente por correo electrónico.",
      },
    ],
  },
  {
    id: "funcionalidades",
    label: "Funcionalidades",
    description: "Módulos, sucursales y canales",
    icon: Boxes,
    questions: [
      {
        question: "¿Qué módulos incluye Zentro?",
        answer: (
          <>
            Catálogo, Inventario, POS, Pedidos, Caja, CRM, Reportes y Presencia
            digital, además de configuración, roles y permisos. Activa solo los
            módulos que tu negocio necesita. Conoce cada uno en{" "}
            <Link href="/servicios">Servicios</Link>.
          </>
        ),
      },
      {
        question: "¿Funciona para varios locales o sucursales?",
        answer:
          "Sí. Gestionas inventario, POS, caja y ventas por sucursal, con un consolidado a nivel de organización para comparar el rendimiento de cada sede.",
      },
      {
        question: "¿Es compatible con venta online y física?",
        answer:
          "Sí. Zentro unifica las ventas del POS, tu tienda online y canales externos, todos sobre el mismo inventario.",
      },
      {
        question: "¿Qué diferencia hay entre Organización y Sucursal?",
        answer: (
          <>
            La <strong>Organización</strong> agrupa la configuración global:
            roles, permisos, presencia digital y precios base. La{" "}
            <strong>Sucursal</strong> es el día a día de cada sede: stock, POS,
            caja, compras y gastos.
          </>
        ),
      },
    ],
  },
  {
    id: "equipo",
    label: "Cuenta y equipo",
    description: "Organizaciones e invitaciones",
    icon: Users,
    questions: [
      {
        question: "¿Puedo tener varias organizaciones?",
        answer:
          "Sí. Con un solo usuario puedes crear varias organizaciones y alternar entre ellas desde tu panel principal.",
      },
      {
        question: "¿Cómo invito a mi equipo?",
        answer:
          "Desde Configuración → Invitaciones envías invitaciones por correo con un rol específico y su alcance: toda la organización o una sucursal.",
      },
    ],
  },
  {
    id: "soporte",
    label: "Seguridad y soporte",
    description: "Protección de datos y ayuda",
    icon: LifeBuoy,
    questions: [
      {
        question: "¿Mis datos están seguros?",
        answer:
          "Sí. Los datos de cada organización están aislados, las contraseñas se guardan cifradas, la información viaja cifrada y el acceso se controla con roles y permisos.",
      },
      {
        question: "¿Dónde puedo obtener ayuda?",
        answer: (
          <>
            En nuestro <Link href="/ayuda">Centro de ayuda</Link>, escribiéndonos
            desde <Link href="/contacto">Contacto</Link> o creando un ticket de
            soporte desde tu panel.
          </>
        ),
      },
    ],
  },
];
