import { Product } from "@prisma/client";

export interface ProductWithTotalPrice extends Omit<Product, "basePrice"> {
  basePrice: number;
  totalPrice: number;
}

export const computeProductTotalPrice = (
  product: Product,
): ProductWithTotalPrice => {
  const basePrice = Number(product.basePrice);

  if (product.discountPercentage === 0) {
    return {
      ...product,
      basePrice,
      totalPrice: basePrice,
    };
  }

  const totalDiscount = basePrice * (product.discountPercentage / 100);

  return {
    ...product,
    basePrice,
    totalPrice: basePrice - totalDiscount,
  };
};
