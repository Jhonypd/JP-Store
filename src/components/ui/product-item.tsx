"use client";

import { ProductWithTotalPrice } from "@/helpers/products";
import Link from "next/link";
import { useState } from "react";
import { Edit } from "lucide-react";
import DiscountBadge from "./discount-badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageProduct from "./image-product";
import { getFirstImageBytes } from "@/helpers/images";
import ProductEditSheet from "./product-edit-sheet";

interface ProductItemProps {
  product: ProductWithTotalPrice;
  className?: string;
  layout?: "vertical" | "horizontal";
  editable?: boolean;
  onEditProduct?: (
    updatedProduct: Partial<ProductWithTotalPrice> & {
      imageBytesArray?: number[][];
    },
  ) => void;
}

const ProductItem = ({
  product,
  className,
  layout = "vertical",
  editable = false,
  onEditProduct,
}: ProductItemProps) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditSheetOpen(true);
  };

  const ProductContent = () => (
    <>
      {/* Imagem */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-accent",
          layout === "vertical" ? "h-[170px] w-full" : "h-[100px] w-[100px]",
        )}
      >
        <ImageProduct
          imageBytes={getFirstImageBytes(product.imageArrayBytes)}
          productName={product.name}
          className={cn(
            layout === "vertical"
              ? "max-h-[70%] max-w-[80%]"
              : "max-h-[80%] max-w-[80%]",
          )}
          priority={true}
          onError={() => {
            console.error("Erro ao carregar imagem do produto:", product.name);
          }}
        />

        {product.discountPercentage > 0 && (
          <DiscountBadge
            className={cn(
              "absolute",
              layout === "vertical" ? "right-2 top-2" : "right-1 top-1",
            )}
          >
            {product.discountPercentage}
          </DiscountBadge>
        )}

        {/* Botão de edição */}
        {editable && (
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "absolute opacity-0 transition-opacity group-hover:opacity-100",
              layout === "vertical" ? "bottom-2 right-2" : "bottom-1 right-1",
            )}
            onClick={handleEditClick}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {product.name}
        </p>
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {product.discountPercentage > 0 ? (
            <>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold lg:text-lg">
                R$ {Number(product.totalPrice).toFixed(2)}
              </p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs line-through opacity-75 lg:text-sm">
                R$ {Number(product.basePrice).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
              R$ {Number(product.basePrice).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {editable ? (
        <div
          className={cn(
            "group flex cursor-pointer",
            layout === "vertical"
              ? "min-w-[150px] flex-col gap-4"
              : "w-full flex-row items-center gap-4 p-2",
            className,
          )}
        >
          <ProductContent />
        </div>
      ) : (
        <Link
          href={`/product/${product.slug}`}
          className={cn(
            "flex",
            layout === "vertical"
              ? "min-w-[150px] flex-col gap-4"
              : "w-full flex-row items-center gap-4 p-2",
            className,
          )}
        >
          <ProductContent />
        </Link>
      )}

      {/* Sheet de Edição */}
      {editable && (
        <ProductEditSheet
          product={product}
          isOpen={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          onEditProduct={onEditProduct}
        />
      )}
    </>
  );
};

export default ProductItem;
