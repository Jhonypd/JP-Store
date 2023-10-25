import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function getOrders(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getServerSession(authOptions);

  if (!user) {
    res.status(401).json({ message: "user not found" });
    return;
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

  res.status(200).json(orders);
}
