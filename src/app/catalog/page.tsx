import { Badge } from "@/components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import { ShapesIcon } from "lucide-react";
import CategoryItem from "./components/category-item";


const CatalogPage = async () => {

    const categries = await prismaClient.category.findMany({})
    return (
        <div className="p-5 flex flex-col gap-8">
            <Badge className="w-fit px-3 py-[0.375rem] gap-1 text-base uppercase border-primary" variant='outline'>
                <ShapesIcon size={16} />
                catálogo
            </Badge>

            <div className="grid grid-cols-2 gap-8">
                {categries.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                ))}
            </div>
        </div>);
}

export default CatalogPage;