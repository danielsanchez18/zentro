"use client";

import { useState, useEffect } from "react";
import { Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price_monthly: 0,
    price_annual: 0,
    features: [
      "5 GB Cloud Storage",
      "5 API Requests/min",
      "1 Team Member",
      "1 Project Template",
      "50 Build Minutes/month",
      "Email Support",
      "Basic Analytics",
    ],
    highlighted: false,
  },
  {
    name: "Startup",
    price_monthly: 15,
    price_annual: 30,
    features: [
      "5 GB Cloud Storage",
      "5 API Requests/min",
      "1 Team Member",
      "1 Project Template",
      "50 Build Minutes/month",
      "Email Support",
      "Basic Analytics",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price_monthly: 45,
    price_annual: 90,
    features: [
      "5 GB Cloud Storage",
      "5 API Requests/min",
      "1 Team Member",
      "1 Project Template",
      "50 Build Minutes/month",
      "Email Support",
      "Basic Analytics",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price_monthly: 199,
    price_annual: 399,
    features: [
      "5 GB Cloud Storage",
      "5 API Requests/min",
      "1 Team Member",
      "1 Project Template",
      "50 Build Minutes/month",
      "Email Support",
      "Basic Analytics",
    ],
    highlighted: false,
  },
];

const AnimatedPrice = ({ targetPrice }: { targetPrice: number }) => {
  const [current, setCurrent] = useState(targetPrice);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const initial = current;

    if (initial === targetPrice) return;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setCurrent(Math.round(initial + (targetPrice - initial) * progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetPrice]);

  return <span>{current}</span>;
};

export function Plans() {
  const [isAnnual, setIsAnnual] = useState(true);

  const toggleAnnualPricing = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <section className="py-20 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3 sm:space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          Precios sencillos y transparentes
        </h1>
        <p className="text-foreground max-sm:text-sm md:text-lg">
          Sea cual sea tu situación, nuestras ofertas se adaptan a tus necesidades.
        </p>
      </div>

      {/* Monthly and yearly switch */}
      <div className="w-fit flex items-center gap-x-3 mx-auto">
        <p className={`text-sm transition-colors ${!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Mensual</p>
        <label htmlFor="hs-basic-usage" className="relative inline-block w-11 h-6 cursor-pointer">
          <input
            type="checkbox"
            id="hs-basic-usage"
            className="peer sr-only"
            checked={isAnnual}
            onChange={toggleAnnualPricing}
          />
          <span className="absolute inset-0 bg-muted rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-primary dark:peer-checked:bg-primary peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
          <span className="absolute top-1/2 inset-s-0.5 -translate-y-1/2 size-5 bg-white rounded-full transition-transform duration-200 ease-in-out dark:peer-checked:bg-background peer-checked:translate-x-full"></span>
        </label>
        <p className={`text-sm transition-colors ${isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Anual</p>
      </div>

      {/* Plans */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => {
          const targetPrice = isAnnual ? plan.price_annual : plan.price_monthly;

          return (
            <article
              key={index}
              className={`w-full bg-card border ${
                plan.highlighted ? "" : "border-border"
              } rounded-xl p-5 space-y-7 relative`}
            >
              <div>
                <div className="flex items-center gap-x-3">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  {plan.highlighted && (
                    <p className="text-xs font-medium text-white rounded-full bg-primary px-2 py-1">
                      Más popular
                    </p>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Lo mejor para desarrolladores individuales
                </p>

                <div className="text-4xl font-semibold text-foreground flex gap-x-2 mt-5">
                  <span className="text-sm mt-1">S/.</span>
                  <AnimatedPrice targetPrice={targetPrice} />
                  <span className="text-sm font-normal self-end mb-1">PEN</span>
                </div>

                <p className="text-muted-foreground text-[13px] mt-1">
                  /{isAnnual ? "anual" : "mensual"} para una persona
                </p>
              </div>

              {plan.name === "Free" ? (
                <Button variant="outline" className="w-full rounded-full bg-card hover:bg-muted">
                  Empezar ahora
                </Button>
              ) : (
                <Button className="w-full shadow-sm rounded-full hover:shadow-md transition">
                  Empezar ahora
                </Button>
              )}

              <div className="border-t border-border pt-5 gap-y-3 grid">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-x-3">
                    <Check className="size-4 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {/* Contact */}
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-5 gap-y-3 w-fit mx-auto border border-border bg-card rounded-xl px-5 py-5 items-center shadow-sm">
        <MessageSquare className="max-sm:row-span-2 size-8 text-primary" />
        <div className="space-y-1">
          <h4 className="font-medium font-sans">¿Necesitas un plan personalizado?</h4>
          <p className="text-sm text-muted-foreground">
            Podemos personalizar un plan que se adapte a tus necesidades.
          </p>
        </div>
        <div className="self-center">
          <Button variant="outline" className="py-1.5 h-fit rounded-full hover:bg-muted">
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}