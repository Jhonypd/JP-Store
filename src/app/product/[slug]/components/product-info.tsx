"use client";
import { Button } from "@/components/ui/button";
import DiscountBadge from "@/components/ui/discount-badge";
import { toast } from "sonner";
import { ProductWithTotalPrice } from "@/helpers/products";
import { CartContext } from "@/providers/cart";
import { ArrowLeft, ArrowRight, TruckIcon, Check } from "lucide-react";
import { useContext, useState } from "react";

interface ProductInfoProps {
  product: ProductWithTotalPrice;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  const { addProductToCart } = useContext(CartContext);

  const handleDecreaseQuantityClick = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleIncreaseQuantityClick = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCartClick = async () => {
    try {
      addProductToCart({ ...product, quantity });

      toast("Item adicionado com sucesso!", {
        description: `${product.name} adicionado.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col px-5">
      <h2 className="text-lg">{product.name}</h2>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">
          R$ {Number(product.totalPrice).toFixed(2)}
        </h1>

        {product.discountPercentage > 0 && (
          <DiscountBadge>{product.discountPercentage}</DiscountBadge>
        )}
      </div>
      {product.discountPercentage > 0 && (
        <p className="text-sm line-through opacity-75">
          R$ {Number(product.basePrice).toFixed(2)}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={handleDecreaseQuantityClick}
        >
          <>
            <ArrowLeft />
          </>
        </Button>

        <span>{quantity}</span>

        <Button
          size={"icon"}
          variant={"outline"}
          onClick={handleIncreaseQuantityClick}
        >
          <>
            <ArrowRight />
          </>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold">Descrição</h3>
        <p className="text-justify text-sm opacity-60">{product.description}</p>
      </div>

      <div className="flex flex-col md:mt-5 md:flex-row md:items-center md:justify-around">
        <Button
          onClick={handleAddToCartClick}
          className="mt-8 bg-secondary font-bold uppercase hover:bg-primary md:max-w-[280px]"
        >
          Adicionar ao carrinho
        </Button>

        <div className="mt-5 flex items-center justify-between rounded-lg bg-accent px-5 py-2 md:max-w-[350px]">
          <div className="flex items-center  gap-3">
            <TruckIcon />
            <div className="flex flex-col">
              <p className="text-xs">
                Entrega via <span className="font-bold">JPpacket &reg;</span>
              </p>
              <p className="text-xs text-secondary">
                Envio para <span className="font-bold">todo Brasil</span>
              </p>
            </div>
          </div>
          <p className="text-xs font-bold">Frete grátis</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
