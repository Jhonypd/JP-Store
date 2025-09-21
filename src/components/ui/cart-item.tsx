"use client";

import { CartContext, CartProduct } from "@/providers/cart";
import { ArrowLeft, ArrowRight, TrashIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { useContext } from "react";
import ImageProduct from "./image-product";
import { getFirstImageBytes } from "@/helpers/images";

interface CartItemProps {
  product: CartProduct;
}

const CartItem = ({ product }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

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
    <div className="flex w-full items-center justify-between">
      <div className="flex  flex-nowrap items-center gap-4 overflow-hidden">
        <div className="rounded-ld flex h-[77px] w-[77px] items-center justify-center bg-accent">
          {product.imageArrayBytes ? (
            <ImageProduct
              imageBytes={getFirstImageBytes(product.imageArrayBytes)}
              productName={product.name}
              priority={true}
              alt={product.name}
              className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain"
            />
          ) : (
            // Placeholder caso não haja imagem
            <div className="flex h-12 w-12 items-center justify-center">
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
        <div className="flex flex-col overflow-hidden">
          <p className="max-w-40 truncate text-ellipsis text-nowrap text-xs">
            {product.name}
          </p>
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
