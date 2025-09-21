// Array para armazenar URLs criadas, para poder limpar depois
const createdBlobUrls = new Set<string>();

export const getFirstImageBytes = (
  imageArrayBytes: any,
): Buffer | Uint8Array | number[] | null => {
  if (!imageArrayBytes) return null;

  try {
    // Se é um array de arrays (múltiplas imagens), pega a primeira
    if (Array.isArray(imageArrayBytes) && Array.isArray(imageArrayBytes[0])) {
      return imageArrayBytes[0];
    }

    // Se é um array simples (uma única imagem)
    if (Array.isArray(imageArrayBytes)) {
      return imageArrayBytes;
    }

    // Se é Buffer ou Uint8Array diretamente
    if (
      imageArrayBytes instanceof Buffer ||
      imageArrayBytes instanceof Uint8Array
    ) {
      return imageArrayBytes;
    }

    // Se é string (base64 ou data URL)
    if (typeof imageArrayBytes === "string") {
      // Se é data URL, extrair apenas a parte base64
      if (imageArrayBytes.startsWith("data:")) {
        const base64 = imageArrayBytes.split(",")[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }

      // Se é base64 puro
      try {
        const binaryString = atob(imageArrayBytes);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      } catch (e) {
        console.error("Erro ao decodificar base64:", e);
        return null;
      }
    }

    console.error(
      "Formato de imageArrayBytes não reconhecido:",
      typeof imageArrayBytes,
    );
    return null;
  } catch (error) {
    console.error("Erro ao processar imageArrayBytes:", error);
    return null;
  }
};

export function bytesToDataUrl(bytes: any, type = "image/webp"): string {
  try {
    let uint8Array: Uint8Array;

    if (bytes instanceof Uint8Array) {
      uint8Array = bytes;
    } else if (Array.isArray(bytes)) {
      uint8Array = new Uint8Array(bytes);
    } else if (bytes?.type === "Buffer" && Array.isArray(bytes.data)) {
      uint8Array = new Uint8Array(bytes.data);
    } else {
      throw new Error("Formato de bytes inválido");
    }

    const blob = new Blob([uint8Array as any], { type });
    const url = URL.createObjectURL(blob);

    // Armazena a URL para limpeza futura
    createdBlobUrls.add(url);

    return url;
  } catch (error) {
    console.error("Erro ao converter bytes para Blob URL:", error);
    return "";
  }
}

export function resolveProductImages(
  imageArrayBytes?: any[],
  imagesUrls?: string[],
  type = "image/webp",
): string[] {
  if (imageArrayBytes && imageArrayBytes.length > 0) {
    return imageArrayBytes
      .map((bytes) => bytesToDataUrl(bytes, type))
      .filter((url): url is string => url !== "");
  }

  if (imagesUrls && imagesUrls.length > 0) {
    return imagesUrls;
  }

  return [];
}

/**
 * Limpa todas as URLs Blob criadas para liberar memória
 */
export function revokeAllBlobUrls() {
  createdBlobUrls.forEach((url) => URL.revokeObjectURL(url));
  createdBlobUrls.clear();
}
