import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Order, Prisma } from "@prisma/client";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      orderProduct: true;
    };
  }>;
}

const OrderItem = ({ order }: OrderItemProps) => {
  return (
    <Card className="mt-4 px-5">
      <Accordion type="single" className="w-full" collapsible>
        <AccordionItem value={order.id}>
          <AccordionTrigger>
            <div className="felx-col flex gap-1 text-left">
              Pedido com {order.orderProduct.length} produto(s)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between">
              <div className="font-bold">
                <p>Status</p>
                <p className="text-secondary">{order.status}</p>
              </div>

              <div>
                <p className="font-bold">Data</p>
                <p className="opacity-60">
                  {format(order.createdAt, "dd/MM/y")}
                </p>
              </div>

              <div>
                <p className="font-bold">Pagamento</p>
                <p className="opacity-60">Cartaão</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderItem;
