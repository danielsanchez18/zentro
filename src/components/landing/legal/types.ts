export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type LegalDoc = {
  intro: string;
  // Fecha fija: actualizar solo cuando cambie el contenido legal
  updatedAt: string;
  sections: LegalSection[];
};
