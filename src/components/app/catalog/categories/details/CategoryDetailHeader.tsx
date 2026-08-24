import Link from "next/link";

interface CategoryDetailHeaderProps {
  name: string;
  slug: string;
}

export function CategoryDetailHeader({ name, slug }: CategoryDetailHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <Link
          href={`/app/${slug}/catalogo`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Regresar
        </Link>
        <h1 className="text-xl font-medium text-foreground">{name}</h1>
      </div>
    </header>
  );
}
