import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Order, Prisma } from "@prisma/client";
import OrderProductItem from "./order-product-item";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { computeProductTotalPrice } from "@/helpers/products";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      orderProduct: {
        include: {
          product: true;
        };
      };
    };
  }>;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const subtotal = useMemo(() => {
    return order.orderProduct.reduce((acc, orderProduct) => {
      return (
        acc + Number(orderProduct.product.basePrice) * orderProduct.quantity
      );
    }, 0);
  }, [order.orderProduct]);

  const total = useMemo(() => {
    return order.orderProduct.reduce((acc, product) => {
      const productWithTotalPrice = computeProductTotalPrice(product.product);
      return acc + productWithTotalPrice.totalPrice * product.quantity;
    }, 0);
  }, [order.orderProduct]);

  const totalDiscount = useMemo(() => {
    return subtotal - total;
  }, [subtotal, total]);

  return (
    <Card className="px-5">
      <Accordion type="single" className="w-full" collapsible>
        <AccordionItem value={order.id}>
          <AccordionTrigger>
            <div className="flex flex-col gap-1 text-left">
              <p>
                Pedido #{order.id.slice(14, 18)} com {order.orderProduct.length}{" "}
                produto(s)
              </p>
              <span className="text-sm opacity-60">
                feito em {format(order.createdAt, "dd/MM/y 'as' HH:mm")}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">
                  <p>Status</p>
                  <p className="text-secondary">{order.status}</p>
                </div>

                <div>
                  <p className="font-bold">Data</p>
                  <p className="opacity-60">
                    {format(order.createdAt, "dd/MM/yy")}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Pagamento</p>
                  <p className="opacity-60">Cartão</p>
                </div>
              </div>
              {order.orderProduct.map((orderProduct) => (
                <OrderProductItem
                  key={orderProduct.id}
                  orderProduct={orderProduct}
                />
              ))}
              <div className="flex w-full flex-col gap-1 text-xs">
                <Separator />

                <div className="flex w-full items-center justify-between text-xs">
                  <p>Subtotal</p>
                  <p>R$ {subtotal.toFixed(2)}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <p>Entrega</p>
                  <p>Grátis</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <p>Descontos</p>
                  <p>- R$ {totalDiscount.toFixed(2)}</p>
                </div>
                <Separator />

                <div className="flex items-center justify-between text-sm font-bold">
                  <p>Total</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderItem;
