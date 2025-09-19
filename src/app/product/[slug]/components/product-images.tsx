"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

interface ProductImagesProps {
  name: string;
  imagesUrls: string[];
  imageArrayBytes?: Buffer[];
}

const ProductImages = ({
  imagesUrls,
  imageArrayBytes,
  name,
}: ProductImagesProps) => {
  // Função corrigida para converter bytes em Data URL
  const bytesToDataUrl = (bytes: Buffer): string => {
    try {
      const uint8Array = new Uint8Array(bytes);

      // Método mais eficiente para arrays grandes
      let binaryString = "";
      const chunkSize = 8192; // Processar em chunks para evitar stack overflow

      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }

      const base64 = btoa(binaryString);
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Erro ao converter bytes para DataURL:", error);
      return ""; // Retorna string vazia em caso de erro
    }
  };

  // Memoizar as imagens finais para usar
  const finalImages = useMemo(() => {
    // Priorizar bytes sobre URLs
    if (imageArrayBytes && imageArrayBytes.length > 0) {
      return imageArrayBytes
        .map((bytes) => {
          const dataUrl = bytesToDataUrl(bytes);
          return dataUrl !== "" ? dataUrl : null; // Filtrar conversões com erro
        })
        .filter((url): url is string => url !== null); // Remove nulls
    }

    // Se não há bytes, usar URLs
    if (imagesUrls && imagesUrls.length > 0) {
      return imagesUrls;
    }

    // Se não há nem bytes nem URLs
    return [];
  }, [imageArrayBytes, imagesUrls]);

  const [currentImage, setCurrentImage] = useState<string>("");

  // Definir imagem atual quando as imagens finais mudarem
  useEffect(() => {
    if (finalImages.length > 0) {
      setCurrentImage(finalImages[0]);
    }
  }, [finalImages]);

  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
  };

  // Se não há imagens, mostrar placeholder
  if (finalImages.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex h-[380px] w-full items-center justify-center bg-accent">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300">
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
          style={{
            objectFit: "contain",
          }}
          priority={true}
          onError={(e) => {
            console.error("Erro ao carregar imagem:", e);
          }}
        />
      </div>

      {/* Mostrar thumbnails apenas se há mais de uma imagem */}
      {finalImages.length > 1 && (
        <div className="mt-8 grid grid-cols-4 gap-4 px-5">
          {finalImages.map((imageUrl, index) => (
            <button
              key={`${index}`} // Usar índice como key é mais seguro
              className={`flex h-[100px] items-center justify-center rounded-lg bg-accent transition-all
                          ${
                            imageUrl === currentImage
                              ? "border-2 border-solid border-primary ring-2 ring-primary/20"
                              : "border-2 border-transparent hover:border-primary/50"
                          }
                          `}
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
