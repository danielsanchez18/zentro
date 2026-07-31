import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zentro.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zentro — Centraliza y multiplica tu negocio",
    template: "%s | Zentro",
  },
  description:
    "Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma. Prueba Zentro gratis.",
  keywords: [
    "gestión empresarial",
    "inventario",
    "tiendas online",
    "plataforma de ventas",
    "negocio digital",
    "Zentro",
  ],
  authors: [{ name: "Zentro" }],
  creator: "Zentro",
  publisher: "Zentro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Zentro",
    title: "Zentro — Centraliza y multiplica tu negocio",
    description:
      "Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentro — Centraliza y multiplica tu negocio",
    description:
      "Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
