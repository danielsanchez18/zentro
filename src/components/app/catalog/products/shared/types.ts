export interface ProductVariantDraft {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  weight: string;
  description: string;
  price: string;
  compareAtPrice: string;
  available: boolean;
  scheduledAt?: string;
  categoryId: string;
  subcategoryId: string;
  vendor: string;
  tags: string;
  images: File[];
  variants: ProductVariantDraft[];
}
