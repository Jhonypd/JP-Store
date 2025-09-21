import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { bytesToDataUrl } from "@/helpers/images";

interface ImageProductProps {
  imageBytes?: Buffer | Uint8Array | number[] | null;
  productName: string;
  className?: string;
  alt?: string;
  priority?: boolean;
  onError?: () => void;
}

const ImageProduct = ({
  imageBytes,
  productName,
  className,
  alt,
  priority = false,
  onError,
}: ImageProductProps) => {
  const [imageError, setImageError] = useState(false);

  // Usa sua função helper que já retorna blob URL
  const blobUrl = useMemo(() => {
    if (!imageBytes || imageError) return null;
    return bytesToDataUrl(imageBytes);
  }, [imageBytes, imageError]);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Gerar iniciais do nome do produto como fallback
  const getProductInitials = () => {
    return productName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 3);
  };

  // Se não há imagem ou houve erro, mostrar placeholder
  if (!blobUrl || imageError) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-lg bg-accent",
          className,
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center">
          <span className="text-xl font-semibold text-gray-700">
            {getProductInitials()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      className={cn("h-auto w-auto object-contain", className)}
      src={blobUrl}
      alt={alt || productName}
      height={0}
      width={0}
      sizes="100vw"
      priority={priority}
      onError={handleImageError}
    />
  );
};

export default ImageProduct;
