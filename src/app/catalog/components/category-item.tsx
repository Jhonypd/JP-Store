import { Category } from "@prisma/client";
import Image from 'next/image'
import Link from "next/link";

interface CateryItemProps {
    category: Category
}
const CateryItem = ({ category }: CateryItemProps) => {
    return (
        <Link href={`/category/${category.slug}`}>
            <div className="flex flex-col">
                <div className=" to-[rgba(27,86,30,100)] bg-gradient-to-r from-[rgba(50,190,55,100)] rounded-tl-lg rounded-tr-lg w-full h-[150px] flex items-center justify-center">
                    <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={0}
                        height={0}
                        sizes="100vW"
                        className="h-auto max-h-[70%] w-auto max-w-[80%]"
                        style={{
                            objectFit: 'contain'
                        }}
                    />
                </div>
                <div className="bg-accent py-3 roudend-br-lg rounded-bl-lg">
                    <p className="text-center text-sm font-semibold">{category.name}</p>
                </div>
            </div>
        </Link>
    );
}

export default CateryItem;