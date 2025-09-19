"use client";
import { computeProductTotalPrice } from "@/helpers/products";
import { OrderProduct, Prisma } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";

interface OrderProductItemProps {
  orderProduct: Prisma.OrderProductGetPayload<{
    include: {
      product: true;
    };
  }>;
}

const OrderProductItem = ({ orderProduct }: OrderProductItemProps) => {
  const productWithTotalPrice = computeProductTotalPrice(orderProduct.product);

  // Função para converter bytes em Data URL
  const bytesToDataUrl = (bytes: Buffer): string => {
    try {
      const uint8Array = new Uint8Array(bytes);

      // Método mais eficiente para arrays grandes
      let binaryString = "";
      const chunkSize = 8192; // Processar em chunks para evitar stack overflow

      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }

      const base64 = btoa(binaryString);
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Erro ao converter bytes para DataURL:", error);
      return ""; // Retorna string vazia em caso de erro
    }
  };

  // Determinar a fonte da imagem a ser exibida
  const imageSource = useMemo(() => {
    // Priorizar imageArrayBytes se existir
    if (
      orderProduct.product.imageArrayBytes &&
      orderProduct.product.imageArrayBytes.length > 0
    ) {
      const dataUrl = bytesToDataUrl(
        orderProduct.product.imageArrayBytes[0] as any,
      );
      return dataUrl !== "" ? dataUrl : null;
    }

    // Se não há bytes, usar URLs se existirem
    if (
      orderProduct.product.imageUrls &&
      orderProduct.product.imageUrls.length > 0
    ) {
      return orderProduct.product.imageUrls[0];
    }

    // Se não há nem bytes nem URLs
    return null;
  }, [orderProduct.product.imageArrayBytes, orderProduct.product.imageUrls]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[77px] w-[100px] items-center justify-center rounded-lg bg-accent">
        {imageSource ? (
          <Image
            src={imageSource}
            alt={orderProduct.product.name}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto max-h-[80%] w-auto max-w-[80%] object-contain"
            onError={(e) => {
              console.error("Erro ao carregar imagem do produto:", e);
            }}
          />
        ) : (
          // Placeholder caso não haja imagem
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
            <span className="text-xs font-semibold text-gray-700">
              {orderProduct.product.name
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()
                .substring(0, 3)}
            </span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-fit rounded-md bg-accent px-3 py-1">
          <p className="text-[10px]">
            Vendido e entregue por: <span className="font-bold">JP Store</span>
          </p>
        </div>
        <p>{orderProduct.product.name}</p>
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold">
              R$ {productWithTotalPrice.totalPrice.toFixed(2)}
            </p>

            {productWithTotalPrice.discountPercentage > 0 && (
              <p className="text-xs line-through opacity-60">
                R$ {Number(productWithTotalPrice.basePrice).toFixed(2)}
              </p>
            )}
          </div>
          <p className="text-[.6rem] opacity-60">
            Qntd: {orderProduct.quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductItem;
