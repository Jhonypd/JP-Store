import ProductItem from "@/components/ui/product-item";
import { computeProductTotalPrice } from "@/helpers/products";
import { Product } from "@prisma/client";

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="[&::-webkit-scrollbar]:hidden flex w-full gap-4 overflow-x-auto px-5">
      {products.map((product) => (
        <div className="max-w-[170px] w-[170px]">
          <ProductItem key={product.id} product={computeProductTotalPrice(product)} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
