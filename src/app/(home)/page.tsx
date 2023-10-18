import Image from "next/image";
import Categories from "./components/catergories";
import { prismaClient } from "@/lib/prisma";
import ProductList from "./components/product-horizontal-list";

export default async function Home() {
  const deals = await prismaClient.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
  });
  return (
    <div className="py-5">
      <Image
        src="/banner-home-1.png"
        height={0}
        width={0}
        alt="Até 55% de desconto esse mes"
        className="h-auto w-full px-5"
        sizes="100vw"
      />

      <div className="mt-8 px-5">
        <Categories />
      </div>

      <div className="mt-8">
        <p className="mb-3 pl-5 font-bold uppercase">Ofertas</p>
        <ProductList products={deals} />
      </div>

      <Image
        src="/banner-home-2.png"
        height={0}
        width={0}
        alt="Até 55% de desconto em mouses"
        className="h-auto w-full px-5"
        sizes="100vw"
      />
    </div>
  );
}
