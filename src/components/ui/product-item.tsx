import { ProductWithTotalPrice } from "@/helpers/products";
import Image from "next/image";
import Link from "next/link";
import DiscountBadge from "./discount-badge";

interface ProductItemProps {
  product: ProductWithTotalPrice;
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="flex flex-col gap-4">
        <div className="relative flex h-[170px] w-full items-center justify-center rounded-lg bg-accent">
          <Image
            className="h-auto max-h-[70%] w-auto max-w-[80%]"
            src={product.imageUrls[0]}
            alt={product.name}
            height={0}
            width={0}
            sizes="100vw"
            style={{
              objectFit: "contain",
            }}
          />
          {product.discountPercentage > 0 && (
            <DiscountBadge className="absolute top-3 left-3">
              {product.discountPercentage}
            </DiscountBadge>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
            {product.name}
          </p>
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {product.discountPercentage > 0 ? (
              <>
                <p className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                  R$ {product.totalPrice.toFixed(2)}
                </p>
                <p className="text-xs line-through opacity-75 overflow-hidden text-ellipsis whitespace-nowrap">
                  R$ {Number(product.basePrice).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                R$ {product.basePrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div></Link>
  );
};

export default ProductItem;