"use client";
import { useState, useEffect, useMemo } from "react";
import ImageProduct from "@/components/ui/image-product";

interface ProductImagesProps {
  name: string;
  imageArrayBytes?: any[];
}

const ProductImages = ({ imageArrayBytes, name }: ProductImagesProps) => {
  // Filtra e valida as imagens antes de usar
  const validImages = useMemo(() => {
    if (!imageArrayBytes || imageArrayBytes.length === 0) {
      return [];
    }

    return imageArrayBytes.filter((imageBytes) => {
      // Verifica se não é null, undefined ou array vazio
      if (!imageBytes) return false;

      if (Array.isArray(imageBytes)) {
        return imageBytes.length > 0;
      }

      if (imageBytes instanceof Buffer || imageBytes instanceof Uint8Array) {
        return imageBytes.length > 0;
      }

      return false;
    });
  }, [imageArrayBytes]);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (validImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [validImages]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Se não há imagens válidas, mostrar placeholder
  if (validImages.length === 0) {
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
      {/* Imagem Principal */}
      <div className="flex h-[380px] w-full items-center justify-center bg-accent">
        <ImageProduct
          imageBytes={validImages[currentImageIndex]}
          productName={name}
          className="mx-auto h-auto max-h-[80%] w-auto max-w-[70%] md:w-[500px]"
          priority={true}
          onError={() => {
            console.error("Erro ao carregar imagem principal:", name);
          }}
        />
      </div>

      {/* Thumbnails - só mostra se há mais de uma imagem */}
      {validImages.length > 1 && (
        <div className="mt-8 grid grid-cols-4 gap-4 px-5">
          {validImages.map((imageBytes, index) => (
            <button
              key={index}
              className={`flex h-[100px] items-center justify-center rounded-lg bg-accent transition-all
                          ${
                            index === currentImageIndex
                              ? "border-2 border-solid border-primary ring-2 ring-primary/20"
                              : "border-2 border-transparent hover:border-primary/50"
                          }`}
              onClick={() => handleImageClick(index)}
            >
              <ImageProduct
                imageBytes={imageBytes}
                productName={`${name} - Thumbnail ${index + 1}`}
                className="h-auto max-h-[70%] w-auto max-w-[80%]"
                onError={() => {
                  console.error(`Erro ao carregar thumbnail ${index}:`, name);
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
