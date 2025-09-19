import { Button } from "@/components/ui/button";
import CardsItem from "../components/cards-item";
import { add, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import ProductCategoriesAccordion from "../components/product-categories-accordion";
export const dynamic = "force-dynamic";
const ProductDetailsPage = async () => {
  const categories = await prismaClient.category.findMany({
    include: {
      products: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-4 px-2 py-4 md:gap-6 md:py-6">
      <Button className="">Adicionar produto</Button>

      <div className="flex flex-col gap-6 lg:flex-row">
        <CardsItem
          title="Total vendas"
          description="Vendas nos últimos 30 dias"
          dateBase={`${format(add(new Date(), { days: -30 }), "dd'-'MMM", { locale: ptBR })} a ${format(new Date(), "dd'-'MMM", { locale: ptBR })}`}
          value={"R$ 1.000,00"}
        />
      </div>

      <div className="flex flex-col">
        <Badge
          className="w-fit gap-1 border-primary px-3 py-[0.375rem] text-base uppercase"
          variant="outline"
        >
          Produtos
        </Badge>

        <ProductCategoriesAccordion categories={categories} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
