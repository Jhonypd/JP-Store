import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

interface UpdateProductData {
  name?: string;
  basePrice?: number;
  discountPercentage?: number;
  description?: string;
  imageBytesArray?: number[][];
}

// Função para redimensionar corretamente
async function processImageWithSharp(buffer: Buffer): Promise<Buffer> {
  try {
    console.log("Redimensionando imagem...");

    return await sharp(buffer)
      .resize(800, 800, {
        fit: "contain",
        background: { r: 23, g: 23, b: 23, alpha: 1 }, // Fundo preto sólido
      })
      .jpeg({ quality: 90 }) // JPEG ao invés de PNG
      .toBuffer();
  } catch (error) {
    console.error("Erro no redimensionamento:", error);
    throw error;
  }
}

// Função para remover/pintar fundo branco
async function removeWhiteBackground(buffer: Buffer): Promise<Buffer> {
  try {
    console.log("Removendo fundo branco...");

    const { data, info } = await sharp(buffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    console.log(`Processando ${width}x${height} com ${channels} canais`);

    let pixelsModificados = 0;

    // Processar cada pixel
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Se é branco/quase branco (RGB > 230), pintar de preto
      if (r > 230 && g > 230 && b > 230) {
        data[i] = 23; // R = 23 (preto)
        data[i + 1] = 23; // G = 23 (preto)
        data[i + 2] = 23; // B = 23 (preto)
        pixelsModificados++;
      }
    }

    console.log(`${pixelsModificados} pixels brancos pintados de preto`);

    if (pixelsModificados === 0) {
      console.log("Nenhum pixel branco encontrado");
      return buffer;
    }

    // Criar imagem final
    return await sharp(data, {
      raw: { width, height, channels },
    })
      .webp({ quality: 90 })
      .toBuffer();
  } catch (error) {
    console.error("Erro na remoção de fundo:", error);
    return buffer;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body: UpdateProductData = await request.json();
    const { imageBytesArray, ...otherData } = body;
    const updateData: any = { ...otherData };

    if (imageBytesArray && imageBytesArray.length > 0) {
      console.log(`Processando ${imageBytesArray.length} imagens...`);

      const processedImages = await Promise.all(
        imageBytesArray.map(async (bytes, index) => {
          console.log(
            `Processando imagem ${index + 1}/${imageBytesArray.length}`,
          );

          const originalBuffer = Buffer.from(bytes);

          // 1. Redimensionar primeiro
          const resizedBuffer = await processImageWithSharp(originalBuffer);

          // 2. Remover/pintar fundo branco
          const finalBuffer = await removeWhiteBackground(resizedBuffer);

          console.log(`Imagem ${index + 1} concluída`);
          return finalBuffer;
        }),
      );

      updateData.imageUrls = [];
      updateData.imageArrayBytes = processedImages;
      console.log("Todas as imagens processadas!");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      processedImages: imageBytesArray ? imageBytesArray.length : 0,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
