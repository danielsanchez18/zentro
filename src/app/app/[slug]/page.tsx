"use client";

import { Greeting } from "@/components/app/overview/Greeting";
import { KPIS } from "@/components/app/overview/KPIS";

export default function TenantHomePage() {

  return (
    <div className="space-y-5">
      
      <Greeting />
      <KPIS />
    </div>
  );
}