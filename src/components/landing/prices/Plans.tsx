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
        <h1 className="text-4xl sm:text-5xl font-semibold uppercase text-foreground">
          Precios sencillos y transparentes
        </h1>
        <p className="text-foreground max-sm:text-sm md:text-lg">
          Sea cual sea tu situación, nuestras ofertas se adaptan a tus
          necesidades.
        </p>
      </div>

      {/* Monthly and yearly switch */}
      <div className="w-fit flex items-center gap-x-3 mx-auto">
        <p
          className={`text-sm transition-colors ${!isAnnual ? "text-foreground font-semibold" : "text-muted-foreground"}`}
        >
          Mensual
        </p>
        <label
          htmlFor="hs-basic-usage"
          className="relative inline-block w-11 h-6 cursor-pointer"
        >
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
        <p
          className={`text-sm transition-colors ${isAnnual ? "text-foreground font-semibold" : "text-muted-foreground"}`}
        >
          Anual
        </p>
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
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  {plan.highlighted && (
                    <Button
                      variant="default"
                      size="xs"
                      className="rounded-full"
                    >
                      Mas popular
                    </Button>
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
                <Button variant="glass" className="w-full rounded-full">
                  Empezar ahora
                </Button>
              ) : (
                <Button variant="default" className="w-full rounded-full">
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
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-5 gap-y-3 w-fit mx-auto border border-border bg-card rounded-xl px-5 py-5 shadow-sm">
        {/* <MessageSquare className="max-sm:row-span-2 size-8 text-primary" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="max-sm:row-span-2 size-8 text-primary"
        >
          <g clipPath="url(#clip0_4418_9398)">
            <path
              d="M22 6.25V11.35C22 12.62 21.58 13.69 20.83 14.43C20.09 15.18 19.02 15.6 17.75 15.6V17.41C17.75 18.09 16.99 18.5 16.43 18.12L15.46 17.48C15.55 17.17 15.59 16.83 15.59 16.47V12.4C15.59 10.36 14.23 9 12.19 9H5.39999C5.25999 9 5.13 9.01002 5 9.02002V6.25C5 3.7 6.7 2 9.25 2H17.75C20.3 2 22 3.7 22 6.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.59 12.4V16.47C15.59 16.83 15.55 17.17 15.46 17.48C15.09 18.95 13.87 19.87 12.19 19.87H9.47L6.45 21.88C6 22.19 5.39999 21.86 5.39999 21.32V19.87C4.37999 19.87 3.53 19.53 2.94 18.94C2.34 18.34 2 17.49 2 16.47V12.4C2 10.5 3.18 9.19002 5 9.02002C5.13 9.01002 5.25999 9 5.39999 9H12.19C14.23 9 15.59 10.36 15.59 12.4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_9398">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div className="space-y-1">
          <h4 className="font-medium font-sans">
            ¿Necesitas un plan personalizado?
          </h4>
          <p className="text-sm text-muted-foreground">
            Podemos personalizar un plan que se adapte a tus necesidades.
          </p>
        </div>
        <div className="self-center">
          <Button
            variant="glass"
            className="py-1.5 h-fit rounded-full hover:bg-muted"
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}
