import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { computeProductTotalPrice } from "@/helpers/products";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 },
      );
    }

    // Buscar ou criar carrinho do usuário
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    // Se não existir carrinho, criar um novo
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          CartItem: {
            include: {
              Product: true,
            },
          },
        },
      });
    }

    // Transformar os dados para o formato esperado pelo frontend
    const products = cart.CartItem.map((item) => {
      const productWithTotalPrice = computeProductTotalPrice(item.Product);
      return {
        ...productWithTotalPrice,
        quantity: item.quantity || 1,
      };
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
