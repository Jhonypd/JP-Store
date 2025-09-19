"use client";

import { ProductWithTotalPrice } from "@/helpers/products";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Edit, Save, X, Upload, Camera } from "lucide-react";
import DiscountBadge from "./discount-badge";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "./scroll-area";

interface ProductItemProps {
  product: ProductWithTotalPrice;
  className?: string;
  layout?: "vertical" | "horizontal";
  editable?: boolean;
  onEditProduct?: (
    updatedProduct: Partial<ProductWithTotalPrice> & {
      imageBytesArray?: number[][];
    },
  ) => void;
}

const ProductItem = ({
  product,
  className,
  layout = "vertical",
  editable = false,
  onEditProduct,
}: ProductItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageBytesArray, setImageBytesArray] = useState<number[][]>([]);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: product.name,
    basePrice: product.basePrice.toString(),
    discountPercentage: product.discountPercentage.toString(),
    description: product.description || "",
  });

  // Função corrigida para converter bytes em Data URL
  const bytesToDataUrl = (bytes: Buffer | Uint8Array): string => {
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

  // Definir a fonte da imagem atual na inicialização
  useEffect(() => {
    if (product.imageArrayBytes && product.imageArrayBytes.length > 0) {
      // Se tem imagem em bytes, usar ela
      const dataUrl = bytesToDataUrl(product.imageArrayBytes[0]);
      if (dataUrl !== "") {
        setCurrentImageSrc(dataUrl);
      } else {
        setCurrentImageSrc(null);
      }
    } else if (product.imageUrls && product.imageUrls.length > 0) {
      // Se não tem bytes mas tem URL, usar URL
      setCurrentImageSrc(product.imageUrls[0]);
    } else {
      setCurrentImageSrc(null);
    }
  }, [product]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} não é uma imagem válida.`);
        return false;
      }

      // Verificar tamanho (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} deve ter no máximo 5MB.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviewImages: string[] = [];
    const newImageBytesArray: number[][] = [];
    let processedCount = 0;

    validFiles.forEach((file, index) => {
      // Para preview das imagens
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newPreviewImages[index] = result;
          processedCount++;

          if (processedCount === validFiles.length * 2) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages]);
            setImageBytesArray((prev) => [...prev, ...newImageBytesArray]);
          }
        }
      };
      reader.readAsDataURL(file);

      // Para converter em array de bytes
      const bytesReader = new FileReader();
      bytesReader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        if (buffer) {
          const bytes = Array.from(new Uint8Array(buffer));
          newImageBytesArray[index] = bytes;
          processedCount++;

          if (processedCount === validFiles.length * 2) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages]);
            setImageBytesArray((prev) => [...prev, ...newImageBytesArray]);
          }
        }
      };
      bytesReader.readAsArrayBuffer(file);
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageBytesArray((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setPreviewImages([]);
    setImageBytesArray([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const updatedData = {
        name: formData.name,
        basePrice: parseFloat(formData.basePrice) || 0,
        discountPercentage: parseInt(formData.discountPercentage) || 0,
        description: formData.description,
        ...(imageBytesArray.length > 0 && { imageBytesArray }),
      };

      // Fazer chamada para API
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      const result = await response.json();

      if (result.success) {
        // Chamar callback se fornecido
        if (onEditProduct) {
          onEditProduct(updatedData);
        }

        // Atualizar imagem atual se nova imagem foi adicionada
        if (imageBytesArray.length > 0 && previewImages.length > 0) {
          setCurrentImageSrc(previewImages[0]);
        }

        setIsSheetOpen(false);
        setPreviewImages([]);
        setImageBytesArray([]);

        // Resetar form data com valores atualizados
        setFormData({
          name: updatedData.name,
          basePrice: updatedData.basePrice.toString(),
          discountPercentage: updatedData.discountPercentage.toString(),
          description: updatedData.description,
        });
      } else {
        throw new Error(result.error || "Erro ao atualizar produto");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSheetOpen(true);
  };

  const ProductContent = () => (
    <>
      {/* Imagem */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-accent",
          layout === "vertical" ? "h-[170px] w-full" : "h-[100px] w-[100px]",
        )}
      >
        {!currentImageSrc ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center  ">
              <span className="text-xl font-semibold text-gray-700">
                {product.name
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()
                  .substring(0, 3)}
              </span>
            </div>
          </div>
        ) : (
          <>
            <Image
              className={cn(
                "h-auto w-auto object-contain",
                layout === "vertical"
                  ? "max-h-[70%] max-w-[80%]"
                  : "max-h-[80%] max-w-[80%]",
              )}
              src={currentImageSrc}
              alt={product.name}
              height={0}
              width={0}
              sizes="100vw"
              priority
              onError={(e) => {
                console.error("Erro ao carregar imagem principal:", e);
                setCurrentImageSrc(null);
              }}
            />
            {product.discountPercentage > 0 && (
              <DiscountBadge
                className={cn(
                  "absolute",
                  layout === "vertical" ? "right-2 top-2" : "right-1 top-1",
                )}
              >
                {product.discountPercentage}
              </DiscountBadge>
            )}
          </>
        )}

        {/* Botão de edição */}
        {editable && (
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "absolute opacity-0 transition-opacity group-hover:opacity-100",
              layout === "vertical" ? "bottom-2 right-2" : "bottom-1 right-1",
            )}
            onClick={handleEditClick}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
          {product.name}
        </p>
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {product.discountPercentage > 0 ? (
            <>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold lg:text-lg">
                R$ {Number(product.totalPrice).toFixed(2)}
              </p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs line-through opacity-75 lg:text-sm">
                R$ {Number(product.basePrice).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
              R$ {Number(product.basePrice).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {editable ? (
        <div
          className={cn(
            "group flex cursor-pointer",
            layout === "vertical"
              ? "min-w-[150px] flex-col gap-4"
              : "w-full flex-row items-center gap-4 p-2",
            className,
          )}
        >
          <ProductContent />
        </div>
      ) : (
        <Link
          href={`/product/${product.slug}`}
          className={cn(
            "flex",
            layout === "vertical"
              ? "min-w-[150px] flex-col gap-4"
              : "w-full flex-row items-center gap-4 p-2",
            className,
          )}
        >
          <ProductContent />
        </Link>
      )}

      {/* Sheet para edição */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] overflow-hidden sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Editar Produto</SheetTitle>
            <SheetDescription>
              Faça as alterações necessárias no produto e clique em salvar.
            </SheetDescription>
          </SheetHeader>

          <div className="grid h-fit gap-4 overflow-y-auto py-4">
            <ScrollArea className="h-full">
              {/* Upload de Imagem */}
              <div className="grid gap-2">
                <Label>Imagens do Produto</Label>
                <div className="flex flex-col gap-2">
                  {/* Preview das imagens existentes */}
                  {previewImages.length > 0 && (
                    <div className="mb-2 grid grid-cols-2 gap-2">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <div className="relative h-24 w-full overflow-hidden rounded-lg border">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-contain"
                              onError={(e) => {
                                console.error(
                                  `Erro ao carregar preview ${index}:`,
                                  e,
                                );
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Area de upload */}
                  <div
                    className="relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                    onClick={handleImageClick}
                  >
                    {previewImages.length === 0 && currentImageSrc && (
                      <div className="relative h-full w-full">
                        <Image
                          src={currentImageSrc}
                          alt={product.name}
                          fill
                          className="rounded-lg object-contain"
                          onError={(e) => {
                            console.error(
                              "Erro ao carregar imagem no upload:",
                              e,
                            );
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <div className="flex flex-col items-center text-white">
                            <Camera className="mb-1 h-6 w-6" />
                            <span className="text-xs">Alterar</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {(previewImages.length > 0 || !currentImageSrc) && (
                      <div className="flex flex-col items-center text-gray-500">
                        <Upload className="mb-2 h-8 w-8" />
                        <p className="text-center text-sm">
                          {previewImages.length > 0
                            ? "Adicionar mais imagens"
                            : "Clique para selecionar imagens"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          PNG, JPG até 5MB cada
                        </p>
                      </div>
                    )}
                  </div>

                  {previewImages.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllImages}
                      className="w-full"
                    >
                      Remover todas as imagens
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="basePrice">Preço Base</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    handleInputChange("basePrice", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    handleInputChange("discountPercentage", e.target.value)
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Digite a descrição do produto"
                  rows={4}
                />
              </div>
            </ScrollArea>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductItem;
