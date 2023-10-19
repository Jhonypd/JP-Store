"use client"
import { Button } from "@/components/ui/button";
import DiscountBadge from "@/components/ui/discount-badge";
import { ProductWithTotalPrice } from "@/helpers/products";
import { ArrowLeft, ArrowRight, TruckIcon } from "lucide-react";
import { useState } from "react";

interface ProductInfoProps {
    product: Pick<
        ProductWithTotalPrice,
        "basePrice"
        | "description"
        | "discountPercentage"
        | "totalPrice"
        | 'name'
    >
}

const ProductInfo = ({ product: { name, basePrice, description, discountPercentage, totalPrice } }: ProductInfoProps) => {

    const [quantity, setQuantity] = useState(1)

    const handleDecreaseQuantityClick = () => {
        setQuantity((prev) => (prev === 1 ? prev : prev - 1))
    }
    const handleIncreaseQuantityClick = () => {
        setQuantity((prev) => prev + 1)
    }

    return (
        <div className="flex flex-col px-5">

            <h2 className="text-lg">{name}</h2>

            <div className="flex items-center gap-2">

                <h1 className="text-xl font-bold">R$ {totalPrice.toFixed(2)}</h1>

                {discountPercentage > 0 && (
                    <DiscountBadge>
                        {discountPercentage}
                    </DiscountBadge>
                )}

            </div>
            {discountPercentage > 0 && (
                <p className="opacity-75 text-sm line-through">
                    R$ {Number(basePrice).toFixed(2)}
                </p>
            )}
            <div className="flex items-center gap-2 mt-4">
                <Button size={'icon'} variant={'outline'} onClick={handleDecreaseQuantityClick}>
                    <ArrowLeft />
                </Button>

                <span>{quantity}</span>

                <Button size={'icon'} variant={'outline'} onClick={handleIncreaseQuantityClick}>
                    <ArrowRight />
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="font-bold">Descrição</h3>
                <p className="text-sm opacity-60 text-justify">{description}</p>
            </div>

            <Button className="mt-8 uppercase bg-secondary font-bold">
                Adicionar ao carrinho
            </Button>

            <div className="rounded-lg bg-accent flex items-center justify-between px-5 py-2 mt-5">
                <div className="flex items-center gap-3">
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
    );
}

export default ProductInfo;