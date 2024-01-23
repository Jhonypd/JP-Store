import Categories from "./components/catergories";
import { prismaClient } from "@/lib/prisma";
import ProductList from "@/components/ui/product-horizontal-list";
import SectionTitle from "../../components/ui/section-title";
import PromoBanner from "./components/promo-banner";

export default async function Home() {
  const deals = await prismaClient.product.findMany({
    distinct: ["name"],
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
  });
  const keyboards = await prismaClient.product.findMany({
    distinct: ["name"],
    where: {
      category: {
        slug: "keyboards",
      },
    },
  });

  const mouses = await prismaClient.product.findMany({
    distinct: ["name"],
    where: {
      category: {
        slug: "mouses",
      },
    },
  });

  return (
    <div className="flex flex-col gap-8 py-8">
      <PromoBanner
        src="/banner-home-1.png"
        priority={true}
        alt="Até 55% de desconto esse mes"
      />

      <div className="mt-8 px-5">
        <Categories />
      </div>

      <div className="mt-8">
        <SectionTitle>Ofertas</SectionTitle>
        <ProductList products={deals} />
      </div>

      <PromoBanner
        src="/banner-home-2.png"
        alt="Até 55% de desconto em mouses"
      />

      <div className="mt-8">
        <SectionTitle>Teclados</SectionTitle>
        <ProductList products={keyboards} />
      </div>

      <PromoBanner
        src="/banner-home-3.png"
        alt="Até 55% de desconto em mouses"
      />

      <div className="mt-8">
        <SectionTitle>Mouses</SectionTitle>
        <ProductList products={mouses} />
      </div>
    </div>
  );
}
