import { OrderStatus } from "@prisma/client";

export const getOrdersStatus = (orderStatus: OrderStatus) => {
  return {
    [OrderStatus.PAYMENT_CONFINRMED]: "Pago",
    [OrderStatus.WAITTING_FOR_PAYMENT]: "Pedente",
  }[orderStatus];
};
