import { Product } from "@prisma/client";

export interface ProductWithTotalPrice extends Product {
  totalPrice: number;
}

export const computeProductTotalPrice = (
  product: Product,
): ProductWithTotalPrice => {
  if (product.discountPercentage === 0) {
    return {
      ...product,
      totalPrice: Number(product.basePrice.toNumber()),
    };
  }

  const totalDiscount =
    Number(product.basePrice.toNumber()) * (product.discountPercentage / 100);

  return {
    ...product,
    totalPrice: Number(product.basePrice.toNumber()) - totalDiscount,
  };
};
