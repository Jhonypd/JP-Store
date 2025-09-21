"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { resolveProductImages } from "@/helpers/images";

interface ProductImagesProps {
  name: string;
  imageArrayBytes?: any[];
}

const ProductImages = ({ imageArrayBytes, name }: ProductImagesProps) => {
  const finalImages = useMemo(
    () => resolveProductImages(imageArrayBytes),
    [imageArrayBytes],
  );

  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (finalImages.length > 0) {
      setCurrentImage(finalImages[0]);
    }
  }, [finalImages]);

  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
  };

  if (finalImages.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex h-[380px] w-full items-center justify-center bg-accent">
          <div className="flex h-32 w-32 items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              {name
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()
                .substring(0, 3)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex h-[380px] w-full items-center justify-center bg-accent">
        <Image
          src={currentImage}
          alt={name}
          height={0}
          width={0}
          sizes="100vw"
          className="mx-auto h-auto max-h-[80%] w-auto max-w-[70%] md:w-[500px]"
          style={{ objectFit: "contain" }}
          priority={true}
        />
      </div>

      {finalImages.length > 1 && (
        <div className="mt-8 grid grid-cols-4 gap-4 px-5">
          {finalImages.map((imageUrl, index) => (
            <button
              key={index}
              className={`flex h-[100px] items-center justify-center rounded-lg bg-accent transition-all
                          ${
                            imageUrl === currentImage
                              ? "border-2 border-solid border-primary ring-2 ring-primary/20"
                              : "border-2 border-transparent hover:border-primary/50"
                          }`}
              onClick={() => handleImageClick(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`${name} - Imagem ${index + 1}`}
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain"
                onError={(e) => {
                  console.error(`Erro ao carregar thumbnail ${index}:`, e);
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
