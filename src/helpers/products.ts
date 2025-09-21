import { Product } from "@prisma/client";
import { bytesToDataUrl } from "@/helpers/images";

export interface ProductWithTotalPrice
  extends Omit<Product, "basePrice" | "imageUrls"> {
  basePrice: number;
  totalPrice: number;
}

export const computeProductTotalPrice = (
  product: Product,
): ProductWithTotalPrice => {
  const basePrice = Number(product.basePrice);

  const image =
    product.imageArrayBytes && product.imageArrayBytes.length > 0
      ? bytesToDataUrl(product.imageArrayBytes[0])
      : null;

  const totalDiscount =
    product.discountPercentage > 0
      ? basePrice * (product.discountPercentage / 100)
      : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    discountPercentage: product.discountPercentage,
    // todos os outros campos que não quer omitir
    basePrice,
    totalPrice: basePrice - totalDiscount,
    imageArrayBytes: product.imageArrayBytes,
  };
};
