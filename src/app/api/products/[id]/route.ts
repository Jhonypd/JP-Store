// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateProductData {
  name?: string;
  basePrice?: number;
  discountPercentage?: number;
  description?: string;
  imageBytesArray?: number[][];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body: UpdateProductData = await request.json();

    const { imageBytesArray, ...otherData } = body;

    // Preparar dados para atualização
    const updateData: any = { ...otherData };

    // Se há imagens em bytes, remove as URLs e adiciona os bytes
    if (imageBytesArray && imageBytesArray.length > 0) {
      updateData.imageUrls = []; // Remove as URLs existentes
      updateData.imageArrayBytes = imageBytesArray.map((bytes) =>
        Buffer.from(bytes),
      ); // Adiciona os bytes como Buffer array
    }

    // Atualizar produto no banco
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
