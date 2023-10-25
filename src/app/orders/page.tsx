import { Badge } from "@/components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import { ShoppingBagIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import OrderItem from "./components/order-item";
import Loading from "@/components/ui/loading";

export const dynamic = "force-dynamic";

async function OrderPage() {
  const user = getServerSession();

  if (!user) {
    return <Loading />;
  }

  const orders = await prismaClient.order.findMany({
    where: {
      userId: (user as any).id,
    },
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="p-5">
      <Badge
        className="w-fit gap-1 border-2 border-primary px-3 py-[0.375rem] text-base uppercase"
        variant={"outline"}
      >
        <ShoppingBagIcon size={16} />
        Meus Pedidos
      </Badge>
      <div className="mt-5 flex flex-col gap-5">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default OrderPage;
