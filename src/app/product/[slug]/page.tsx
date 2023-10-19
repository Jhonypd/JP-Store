import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";

interface ProductDetailsPageProps {
    params: {
        slug: string
    }
}
const ProductDetailsPage = async ({ params: { slug } }: { params: { slug: string } }) => {
    const product = await prismaClient.product.findFirst({
        where: {
            slug: slug
        }
    })
    if (!product) return null
    return (
        <div>
            <ProductImages name={product.name} imagesUrls={product.imageUrls} />
        </div>

    );
}

export default ProductDetailsPage;