export type SupplierStatus = "activo" | "inactivo";

export interface InventorySupplier {
  id: string;
  businessName: string;
  tradeName: string;
  documentNumber: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
  productCount: number;
  leadTimeDays: number;
  monthlyEntries: number;
  paymentTerms: string;
  lastEntryAt: string | null;
}

export const inventorySuppliers: InventorySupplier[] = [
  { id: "sup_1", businessName: "Distribuidora Andina S.A.C.", tradeName: "Andina Foods", documentNumber: "20601234567", contactName: "Mariana Torres", phone: "+51 987 214 630", email: "ventas@andinafoods.pe", address: "Av. Argentina 2840, Lima", status: "activo", productCount: 18, leadTimeDays: 2, monthlyEntries: 7, paymentTerms: "Crédito a 30 días", lastEntryAt: "2026-08-29T15:20:00.000Z" },
  { id: "sup_2", businessName: "Alimentos del Pacífico E.I.R.L.", tradeName: "Pacífico", documentNumber: "20548712639", contactName: "Carlos Mendoza", phone: "+51 955 408 122", email: "pedidos@pacifico.pe", address: "Jr. Huallaga 618, Lima", status: "activo", productCount: 12, leadTimeDays: 3, monthlyEntries: 5, paymentTerms: "Contado", lastEntryAt: "2026-08-27T11:10:00.000Z" },
  { id: "sup_3", businessName: "Lácteos Santa Rosa S.A.C.", tradeName: "Santa Rosa", documentNumber: "20607894512", contactName: "Lucía Salazar", phone: "+51 944 613 870", email: "comercial@santarosa.pe", address: "Av. Industrial 920, Ate", status: "activo", productCount: 9, leadTimeDays: 1, monthlyEntries: 9, paymentTerms: "Crédito a 15 días", lastEntryAt: "2026-09-01T09:45:00.000Z" },
  { id: "sup_4", businessName: "Empaques y Suministros Lima S.R.L.", tradeName: "Pack Lima", documentNumber: "20491263875", contactName: "Jorge Paredes", phone: "+51 933 740 205", email: "contacto@packlima.pe", address: "Calle Los Telares 188, La Victoria", status: "activo", productCount: 7, leadTimeDays: 4, monthlyEntries: 3, paymentTerms: "Crédito a 30 días", lastEntryAt: "2026-08-20T18:30:00.000Z" },
  { id: "sup_5", businessName: "Frutas y Verduras El Huerto S.A.C.", tradeName: "El Huerto", documentNumber: "20603182749", contactName: "Andrea Rojas", phone: "+51 966 251 419", email: "pedidos@elhuerto.pe", address: "Mercado Mayorista, Santa Anita", status: "activo", productCount: 15, leadTimeDays: 1, monthlyEntries: 12, paymentTerms: "Contado", lastEntryAt: "2026-09-02T07:15:00.000Z" },
  { id: "sup_6", businessName: "Importaciones Nova S.A.C.", tradeName: "Nova Imports", documentNumber: "20596321487", contactName: "Diego Chávez", phone: "+51 922 105 680", email: "ventas@novaimports.pe", address: "Av. Elmer Faucett 4450, Callao", status: "inactivo", productCount: 5, leadTimeDays: 8, monthlyEntries: 0, paymentTerms: "Crédito a 45 días", lastEntryAt: "2026-05-14T14:00:00.000Z" },
  { id: "sup_7", businessName: "Carnes Selectas del Sur S.A.C.", tradeName: "Selectas", documentNumber: "20604571826", contactName: "Renzo Vidal", phone: "+51 977 820 341", email: "operaciones@selectas.pe", address: "Av. Separadora Industrial 1540, Ate", status: "activo", productCount: 11, leadTimeDays: 2, monthlyEntries: 6, paymentTerms: "Crédito a 15 días", lastEntryAt: "2026-08-31T10:25:00.000Z" },
  { id: "sup_8", businessName: "Bebidas Metropolitanas S.A.", tradeName: "Metro Bebidas", documentNumber: "20184579631", contactName: "Paola Núñez", phone: "+51 988 337 512", email: "canalhoreca@metrobebidas.pe", address: "Av. Néstor Gambetta 680, Callao", status: "inactivo", productCount: 8, leadTimeDays: 5, monthlyEntries: 0, paymentTerms: "Contado", lastEntryAt: null },
];
