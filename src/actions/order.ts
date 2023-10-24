"use server";
import { prismaClient } from "@/lib/prisma";
import { CartProduct } from "@/providers/cart";

export const createOrder = async (
  cartProducts: CartProduct[],
  userId: string,
) => {
  const order = await prismaClient.order.create({
    data: {
      userId,
      status: "WAITTING_FOR_PAYMENT",
      orderProduct: {
        createMany: {
          data: cartProducts.map((product) => ({
            basePrice: product.basePrice,
            discountPercentage: product.discountPercentage,
            productId: product.id,
            quantity: product.quantity,
          })),
        },
      },
    },
  });

  return order;
};
