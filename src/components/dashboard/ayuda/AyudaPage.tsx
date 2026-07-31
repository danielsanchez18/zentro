import { ContactSection } from "@/components/dashboard/ayuda/ContactSection";
import { FaqAccordion } from "@/components/dashboard/ayuda/FaqAccordion";
import {
  SearchInput,
  SupportForm,
} from "@/components/dashboard/ayuda/SupportForm";

export const AyudaPage = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-medium">Ayuda y soporte</h1>
          <p className="text-sm text-muted-foreground">
            Todo lo que necesitas para resolver tus dudas.
          </p>
        </div>
        <div className="max-w-md">
          <SearchInput />
        </div>
      </div>

      <ContactSection />

      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-base font-medium">
          Preguntas frecuentes
        </h2>
        <div className="mt-4">
          <FaqAccordion />
        </div>
      </section>

      <SupportForm />
    </div>
  );
};
