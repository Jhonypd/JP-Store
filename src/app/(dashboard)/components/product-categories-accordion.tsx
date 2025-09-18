"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORY_ICON } from "@/constants/category-icons";
import ProductItem from "@/components/ui/product-item";
import { computeProductTotalPrice } from "@/helpers/products";
import { Product } from "@prisma/client";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface ProductCategoriesAccordionProps {
  categories: Category[];
}

const ProductCategoriesAccordion = ({
  categories,
}: ProductCategoriesAccordionProps) => {
  const [categoriesState, setCategoriesState] = useState(categories);

  const handleProductUpdate = (
    categoryId: string,
    productId: string,
    updatedProduct: any,
  ) => {
    setCategoriesState((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            products: category.products.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  name: updatedProduct.name,
                  basePrice: updatedProduct.basePrice,
                  discountPercentage: updatedProduct.discountPercentage,
                  description: updatedProduct.description,
                  // Se nova imagem foi adicionada, limpar URLs
                  ...(updatedProduct.imageBytesArray && {
                    imageUrls: [],
                    imageArrayBytes: updatedProduct.imageBytesArray.map(
                      (bytes: any) => Buffer.from(bytes),
                    ),
                  }),
                };
              }
              return product;
            }),
          };
        }
        return category;
      }),
    );
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-8">
      {categoriesState.map((category) => (
        <Accordion
          key={category.id}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="no-underline hover:no-underline">
              <div className="flex items-center gap-4">
                {CATEGORY_ICON[category.slug as keyof typeof CATEGORY_ICON]}
                <span className="text-xs font-bold">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.products.length} produto
                  {category.products.length !== 1 ? "s" : ""})
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 text-balance">
              {category.products.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-8">
                  {category.products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={computeProductTotalPrice(product)}
                      layout="horizontal"
                      editable
                      onEditProduct={(updatedProduct) => {
                        handleProductUpdate(
                          category.id,
                          product.id,
                          updatedProduct,
                        );
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Nenhum produto encontrado nesta categoria
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ProductCategoriesAccordion;
