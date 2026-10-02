import type { Metadata } from "next";
import { oswald } from "./fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: {
    default: "Zentro — Tu negocio, en un solo lugar",
    template: "%s | Zentro",
  },
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${oswald.variable} landing-scope min-h-screen flex flex-col font-sans antialiased`}
    >
      {children}
    </div>
  );
}
