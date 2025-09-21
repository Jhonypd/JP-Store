// helpers/images.ts - Versão melhorada

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

    return null;
  } catch (error) {
    console.error("Erro ao processar imageArrayBytes:", error);
    return null;
  }
};

// Detecta o tipo MIME da imagem pelos magic bytes
function detectImageType(uint8Array: Uint8Array): string {
  if (uint8Array.length < 4) return "image/jpeg"; // fallback

  // PNG: 89 50 4E 47
  if (
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4e &&
    uint8Array[3] === 0x47
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (
    uint8Array[0] === 0xff &&
    uint8Array[1] === 0xd8 &&
    uint8Array[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  if (
    uint8Array[0] === 0x52 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x46 &&
    uint8Array.length > 12 &&
    uint8Array[8] === 0x57 &&
    uint8Array[9] === 0x45 &&
    uint8Array[10] === 0x42 &&
    uint8Array[11] === 0x50
  ) {
    return "image/webp";
  }

  // GIF: 47 49 46 38
  if (
    uint8Array[0] === 0x47 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x38
  ) {
    return "image/gif";
  }

  return "image/jpeg"; // fallback para JPEG
}

// Valida se os bytes realmente representam uma imagem
function validateImageBytes(uint8Array: Uint8Array): boolean {
  if (!uint8Array || uint8Array.length === 0) {
    return false;
  }

  if (uint8Array.length < 10) {
    return false;
  }

  // Verifica se não é só zeros
  const hasContent = uint8Array.some((byte) => byte !== 0);
  if (!hasContent) {
    return false;
  }

  return true;
}

export function bytesToDataUrl(bytes: any, type?: string): string {
  try {
    let uint8Array: Uint8Array;

    // Converter para Uint8Array
    if (bytes instanceof Uint8Array) {
      uint8Array = bytes;
    } else if (Array.isArray(bytes)) {
      uint8Array = new Uint8Array(bytes);
    } else if (bytes?.type === "Buffer" && Array.isArray(bytes.data)) {
      uint8Array = new Uint8Array(bytes.data);
    } else if (bytes instanceof Buffer) {
      uint8Array = new Uint8Array(bytes);
    } else {
      return "";
    }

    // Validar os dados
    if (!validateImageBytes(uint8Array)) {
      return "";
    }

    // Detectar tipo automaticamente se não fornecido
    const mimeType = type || detectImageType(uint8Array);

    const blob = new Blob([uint8Array as any], { type: mimeType });
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
  type?: string,
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
