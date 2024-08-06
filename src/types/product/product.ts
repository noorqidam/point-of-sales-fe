import { ProductCategory } from "@/types/product-category/product_category";

export interface Product {
  id?: number;
  productName: string;
  productDescription: string;
  productImage: string;
  stock: number;
  category: ProductCategory;
}
