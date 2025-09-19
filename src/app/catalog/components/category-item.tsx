import {
  CATEGORY_ICON,
  CATEGORY_ICON_CATALOG,
} from "@/constants/category-icons";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryItemProps {
  category: Category;
}
const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="flex flex-col">
        <div className=" flex h-[150px] w-full items-center justify-center rounded-tl-lg rounded-tr-lg bg-gradient-to-r from-[rgba(50,190,55,100)] to-[rgba(27,86,30,100)]">
          {/* <Image
            src={category.imageUrl}
            alt={category.name}
            width={0}
            height={0}
            sizes="100vW"
            className="h-auto max-h-[70%] w-auto max-w-[80%]"
            style={{
              objectFit: "contain",
            }}
          /> */}

          <div className="flex h-12 w-12 items-center justify-center  ">
            <span className="text-lg font-semibold text-gray-900">
              {
                CATEGORY_ICON_CATALOG[
                  category.slug as keyof typeof CATEGORY_ICON
                ]
              }
            </span>
          </div>
        </div>
        <div className="rounded-bl-lg rounded-br-lg bg-accent py-3">
          <p className="text-center text-sm font-semibold">{category.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryItem;
