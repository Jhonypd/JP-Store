import { ShapesIcon, ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { useContext } from "react";
import { CartContext } from "@/providers/cart";
import CartItem from "./cart-item";
import { computeProductTotalPrice } from "@/helpers/products";

const Cart = () => {

    const { products } = useContext(CartContext)

    return (
        <div className="flex flex-col gap-8">
            <Badge className="w-fit px-3 py-[0.375rem] gap-1 text-base uppercase border-primary" variant='outline'>
                <ShoppingCartIcon size={16} />
                catálogo
            </Badge>
            <div className="flex flex-col gap-5">
                {products.map((product) => (
                    <CartItem key={product.id} product={computeProductTotalPrice(product as any) as any} />
                ))}
            </div>
        </div>
    );
}

export default Cart;