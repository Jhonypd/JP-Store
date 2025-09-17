import { ProductWithTotalPrice } from "@/helpers/products";
import Image from "next/image";
import Link from "next/link";
import DiscountBadge from "./discount-badge";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: ProductWithTotalPrice;
  className?: string;
}

const ProductItem = ({ product, className }: ProductItemProps) => {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("flex min-w-[150px] flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="relative flex h-[170px] w-full items-center justify-center rounded-lg bg-accent">

                   
          {product.imageUrls.length === 0 ? (
  <div className="flex justify-center items-center h-full">
    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
      <span className="text-xl font-semibold text-gray-700">
        {product.name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase()
          .substring(0, 3)}
      </span>
    </div>
  </div>
) : (
  <>
    <Image
      className="h-auto max-h-[70%] w-auto max-w-[80%]"
      src={product.imageUrls[0]}
      alt={product.name}
      height={0}
      width={0}
      sizes="100vw"
      priority={true}
      style={{
        objectFit: "contain",
      }}
    />
    {product.discountPercentage > 0 && (
      <DiscountBadge className="absolute left-3 top-3">
        {product.discountPercentage}
      </DiscountBadge>
    )}
  </>
)}
        </div>
        <div className="flex flex-col gap-1">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
            {product.name}
          </p>
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {product.discountPercentage > 0 ? (
              <>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold lg:text-lg">
                  R$ {product.totalPrice.toFixed(2)}
                </p>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs line-through opacity-75 lg:text-sm">
                  R$ {Number(product.basePrice).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
                R$ {Number(product.basePrice.toFixed(2))}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
