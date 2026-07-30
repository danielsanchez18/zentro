import { Features } from "@/components/landing/prices/Features";
import { Plans } from "@/components/landing/prices/Plans";
import { Clients } from "@/components/landing/shared/Clients";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Questions } from "@/components/landing/shared/Questions";

export default function PlanesPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">
          <Plans />
        </div>
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <Features />
          <Clients />
          <Questions />
          <CTA />
        </div>
      </div>
      <Footer />
    </>
  )
}
