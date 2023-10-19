import { ShapesIcon, ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { useContext } from "react";
import { CartContext } from "@/providers/cart";

const Cart = () => {

    const { products } = useContext(CartContext)

    return (
        <div className="">
            <Badge className="w-fit px-3 py-[0.375rem] gap-1 text-base uppercase border-primary" variant='outline'>
                <ShoppingCartIcon size={16} />
                catálogo
            </Badge>
            {products.map((product) => (
                <h1 key={product.id}>{product.name}</h1>
            ))}
        </div>
    );
}

export default Cart;