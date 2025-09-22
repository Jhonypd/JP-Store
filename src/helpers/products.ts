import { Product } from "@prisma/client";

export interface ProductWithTotalPrice
  extends Omit<Product, "basePrice" | "imageUrls"> {
  basePrice: number;
  totalPrice: number;
}

export const computeProductTotalPrice = (
  product: Product,
): ProductWithTotalPrice => {
  const basePrice = Number(product.basePrice);

  const totalDiscount =
    product.discountPercentage > 0
      ? basePrice * (product.discountPercentage / 100)
      : 0;

  return {
    ...product,
    basePrice,
    totalPrice: basePrice - totalDiscount,
  };
};
