import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: 'Base Components',
    components: [
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      },
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      },
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      },
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      },
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      },
      {
        name: 'Accordion',
        nroElements: 8,
        url: '/docs/accordion',
        img: '/img/img-components/accordion-component.png',
      }
    ]
  }
];

export function Modules() {
  return (
    <div className="mt-20 space-y-10">

      {/* Title & Description */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h2 className="font-semibold text-3xl lg:text-4xl text-balance tracking-tight">
          Un <span className="text-primary">ecosistema</span> modular y flexible
        </h2>
        <p className="text-muted-foreground">
          Activa solo los módulos que necesitas y escala cuando lo requieras.
        </p>
      </div>

      {/* Components */}
      {categories.map((category, catIdx) => (
        <div key={catIdx} className="space-y-5">
          {/* Title */}
          {/* <h3 className="font-semibold text-lg text-foreground">{category.name}</h3> */}

          {/* Grid Components */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {category.components.map((component, compIdx) => (
              <Link
                key={compIdx}
                href={component.url}
                className="group w-full block border border-border rounded-xl outline outline-transparent hover:border-primary hover:outline-primary hover:shadow-lg dark:hover:shadow-primary/5 transition duration-300 overflow-hidden bg-card"
              >
                {/* Image */}
                <div className="relative pt-[50%] bg-muted overflow-hidden">
                    {/* Optional: Add Image here once you have the real images */}
                    {/* <Image src={component.img} alt={component.name} fill className="object-cover" /> */}
                </div>

                {/* Title & Description */}
                <div className="px-5 py-4 border-t border-border">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {component.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {component.nroElements} components
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
