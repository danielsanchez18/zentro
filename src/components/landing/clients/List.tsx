import Link from "next/link";

const clients = [
  {
    name: 'Company 1',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 2',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 3',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 4',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 5',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 6',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 7',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 8',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 9',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 10',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 11',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 12',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 13',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 14',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  },
  {
    name: 'Company 15',
    description: 'Email marketing and automation platform',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2024/08/notion-symbol.png'
  }
];

export function List() {
  return (
    <section className="pb-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client, index) => (
          <Link
            key={index}
            href="/"
            className="relative h-48 sm:h-52 bg-card rounded-2xl border border-border hover:shadow-sm dark:hover:shadow-neutral-900/50 hover:bg-muted group overflow-hidden transition-colors"
          >
            {/* Background pattern */}
            <div className="w-full before:absolute before:size-full before:bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:before:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] before:bg-size-[20px_20px]"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-5 h-full z-10">
              <div className="h-12 mb-3 translate-y-2 group-hover:-translate-y-2 transition-transform duration-250">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.imageUrl}
                  alt={client.name}
                  className="h-full object-contain dark:invert dark:opacity-80"
                />
              </div>

              <p className="text-sm text-foreground text-center translate-y-2 group-hover:-translate-y-2 transition-transform duration-250">
                {client.description}
              </p>

              <span className="absolute bottom-7 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-250 text-sm text-primary underline underline-offset-4">
                Leer más
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
