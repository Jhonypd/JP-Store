import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";
import { ShoppingBagIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import OrderItem from "./components/order-item";
import Loading from "@/components/ui/loading";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function OrderPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-5">
        <h2 className="font-bold">Acesso Negado!</h2>
        <p className="text-sm opacity-60">Faça login para ver seus pedidos</p>
      </div>
    );
  }

  const handleLoginClick = async () => {
    await signIn();
  };

  const orders = await prismaClient.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log(orders);
  console.log(session.user);

  if (!orders) {
    return <Loading />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col">
          <p>Você ainda não tem pedidos!</p>
          <Link href={"/deals"}>
            <Button className="mt-5" variant={"outline"}>
              Fazer compras
            </Button>
          </Link>
        </div>
      </div>
    );
  }
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
