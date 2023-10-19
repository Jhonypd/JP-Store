'use client'
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
    name: string;
    imagesUrls: string[]
}

const ProductImages = ({ imagesUrls, name }: ProductImagesProps) => {
    const [currentImage, setCurrentImage] = useState(imagesUrls[0])
    return (
        <div className="flex flex-col">

            <div className="bg-accent h-[380px] w-full items-center justify-center flex" >
                <Image
                    src={currentImage}
                    alt={name}
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="h-auto max-w-[70%] max-h-[80%] w-auto"
                    style={{
                        objectFit: 'contain'
                    }}
                />
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8 px-5">
                {imagesUrls.map((imageUrl) => (
                    <button
                        key={imageUrl}
                        className={`flex items-center justify-center rounded-lg bg-accent h-[100px] 
                        ${imageUrl === currentImage &&
                            "border-2 border-solid border-primary"
                            }
                        `}
                        onClick={() => setCurrentImage(imageUrl)}
                    >
                        <Image
                            src={imageUrl}
                            alt={name}
                            height={0}
                            width={0}
                            sizes="100vw"
                            className="h-auto max-w-[80%] max-h-[70%] w-auto"
                        />
                    </button>
                ))
                }
            </div>

        </div>

    );
}

export default ProductImages;