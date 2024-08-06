export const ListModules: Array<Module> = [
  { id: 1, name: "Mengatur User", pages: [] },
  { id: 2, name: "Mengatur Product Category", pages: [] },
  { id: 3, name: "Mengatur Product", pages: [] },
  { id: 4, name: "Mengatur Transaksi", pages: [] },
];

export interface Module {
  id: number;
  name: string;
  pages?: Array<string>;
}
