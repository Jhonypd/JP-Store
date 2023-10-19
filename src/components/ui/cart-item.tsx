import { CartProduct } from "@/providers/cart";
import Image from 'next/image'

interface CartItemProps {
    product: CartProduct
}

const CartItem = ({ product }: CartItemProps) => {
    return (
        <div className="flex items-center">
            <div className="bg-accent flex items-center justify-center rounded-ld">
                <Image
                    src={product.imageUrls[0]} alt={""}
                />
            </div>
            <div></div>
        </div>
    );
}

export default CartItem;