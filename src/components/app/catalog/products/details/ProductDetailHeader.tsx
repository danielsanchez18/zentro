import Link from "next/link";

interface ProductDetailHeaderProps {
  name: string;
  slug: string;
}

export function ProductDetailHeader({ name, slug }: ProductDetailHeaderProps) {
  return (
    <header>
      <Link
        href={`/app/${slug}/catalogo`}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Regresar
      </Link>
      <h1 className="mt-1 text-xl font-medium tracking-tight text-foreground">
        {name}
      </h1>
    </header>
  );
}
