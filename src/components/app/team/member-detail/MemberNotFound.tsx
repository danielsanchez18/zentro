import { MemberBackLink } from "./MemberBackLink";

/** Estado 404 del detalle: integrante inexistente. */
export const MemberNotFound = ({ slug }: { slug: string }) => (
  <div className="w-full px-5 md:px-7 xl:px-10 py-7">
    <MemberBackLink slug={slug} />
    <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      No encontramos a este integrante.
    </div>
  </div>
);