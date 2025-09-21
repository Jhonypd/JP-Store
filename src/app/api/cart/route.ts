import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { error: "Dados obrigatórios: userId, productId, quantity" },
        { status: 400 },
      );
    }

    // Buscar ou criar carrinho do usuário
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Verificar se o produto já existe no carrinho
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (existingCartItem) {
      // Se já existe, atualizar a quantidade
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: (existingCartItem.quantity || 0) + quantity,
        },
      });
    } else {
      // Se não existe, criar novo item
      await prisma.cartItem.create({
        data: {
          id: `${cart.id}-${productId}`, // ID composto para evitar duplicatas
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Produto adicionado ao carrinho",
    });
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Dados obrigatórios: userId, productId, quantity" },
        { status: 400 },
      );
    }

    // Buscar carrinho do usuário
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Carrinho não encontrado" },
        { status: 404 },
      );
    }

    // Buscar item no carrinho
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item não encontrado no carrinho" },
        { status: 404 },
      );
    }

    // Atualizar quantidade
    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return NextResponse.json({
      success: true,
      message: "Quantidade atualizada",
    });
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Dados obrigatórios: userId, productId" },
        { status: 400 },
      );
    }

    // Buscar carrinho do usuário
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Carrinho não encontrado" },
        { status: 404 },
      );
    }

    // Buscar e remover item do carrinho
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item não encontrado no carrinho" },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({
      success: true,
      message: "Produto removido do carrinho",
    });
  } catch (error) {
    console.error("Erro ao remover produto do carrinho:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
