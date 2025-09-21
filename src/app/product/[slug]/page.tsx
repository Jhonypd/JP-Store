import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import ProductInfo from "./components/product-info";
import { computeProductTotalPrice } from "@/helpers/products";
import ProductList from "@/components/ui/product-horizontal-list";
import SectionTitle from "@/components/ui/section-title";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

const ProductDetailsPage = async ({
  params: { slug },
}: ProductDetailsPageProps) => {
  const product = await prismaClient.product.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!product) return null;

  const recommendedProducts = await prismaClient.category.findFirst({
    where: {
      id: product?.categoryId,
    },
    select: {
      products: { where: { id: { not: product?.id } }, take: 10 },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <ProductImages
        name={product.name}
        imageArrayBytes={product.imageArrayBytes}
      />
      <ProductInfo product={computeProductTotalPrice(product)} />
      <div>
        <SectionTitle>Produtos Recomendados</SectionTitle>
        <ProductList products={recommendedProducts?.products ?? []} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
