"use client";

import { CartContext, CartProduct } from "@/providers/cart";
import { ArrowLeft, ArrowRight, TrashIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { useContext, useMemo } from "react";

interface CartItemProps {
  product: CartProduct;
}

const CartItem = ({ product }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

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
    // Verificar se o produto tem imageArrayBytes
    if (product.imageArrayBytes && product.imageArrayBytes.length > 0) {
      const dataUrl = bytesToDataUrl(product.imageArrayBytes[0] as any);
      return dataUrl !== "" ? dataUrl : null;
    }

    // Se não há bytes, usar URLs se existirem
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }

    // Se não há nem bytes nem URLs
    return null;
  }, [product.imageArrayBytes, product.imageUrls]);

  const handleDecreaseProductQuantityClick = () => {
    decreaseProductQuantity(product.id);
  };

  const handleIncreaseProductQuantityClick = () => {
    increaseProductQuantity(product.id);
  };

  const handleRemoveProductFromCartClick = () => {
    removeProductFromCart(product.id);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-ld flex h-[77px] w-[77px] items-center justify-center bg-accent">
          {imageSource ? (
            <Image
              src={imageSource}
              alt={product.name}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain"
              onError={(e) => {
                console.error("Erro ao carregar imagem do carrinho:", e);
              }}
            />
          ) : (
            // Placeholder caso não haja imagem
            <div className="flex h-12 w-12 items-center justify-center  bg-gray-300">
              <span className="text-xs font-semibold text-gray-700">
                {product.name
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()
                  .substring(0, 3)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-xs">{product.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">
              R$ {product.totalPrice.toFixed(2)}
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-xs line-through opacity-75">
                R$ {Number(product.basePrice).toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size={"icon"}
              variant={"outline"}
              className="h-8 w-8"
              onClick={handleDecreaseProductQuantityClick}
            >
              <ArrowLeft size={16} />
            </Button>

            <span className="text-xs">{product.quantity}</span>

            <Button
              size={"icon"}
              variant={"outline"}
              className="h-8 w-8"
              onClick={handleIncreaseProductQuantityClick}
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant={"outline"}
        size={"icon"}
        onClick={handleRemoveProductFromCartClick}
      >
        <TrashIcon size={16} />
      </Button>
    </div>
  );
};

export default CartItem;
