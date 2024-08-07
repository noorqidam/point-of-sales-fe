import { User } from "@/types/auth/user";

export interface Transaction {
  id?: number;
  transactionType: string;
  transactionDate: string;
  user: User;
  details: Details[];
}

export type Details = {
  id: number;
  quantity: string;
  product: Product;
};

export type Product = {
  id?: number;
  productName: string;
  productDescription: string;
  productImage: string;
  stock: number;
};
