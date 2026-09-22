"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormsStore } from "@/stores/forms-store";
import { FormsHeader } from "./FormsHeader";
import { FormsKpis } from "./FormsKpis";
import { FormsList } from "./FormsList";
import { FormTemplateDialog } from "../shared/FormTemplateDialog";

export function FormsModule() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const forms = useFormsStore((state) => state.forms);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <FormsHeader onCreate={() => setTemplatesOpen(true)} />
      <FormsKpis forms={forms} />
      <FormsList forms={forms} />
      <FormTemplateDialog
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        onSelect={(type) => {
          setTemplatesOpen(false);
          router.push(`/app/${params.slug}/formularios/agregar?plantilla=${type}`);
        }}
      />
    </div>
  );
}
