const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const MAX_OUTPUT_BYTES = 900 * 1024;

/**
 * Compresse une image avant envoi (réduit erreur "POST data is too large").
 */
export async function compressImage(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error(`Format non supporté : ${file?.type || "inconnu"}. Utilisez JPG, PNG ou WEBP.`);
  }
  if (file.size <= 400 * 1024 && !file.type.includes("heic")) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    const timeoutId = setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve(file);
    }, 8000);

    img.onload = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width === 0 || height === 0) {
        resolve(file);
        return;
      }
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const tryBlob = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size > MAX_OUTPUT_BYTES && quality > 0.5) {
              tryBlob(quality - 0.12);
              return;
            }
            const base = file.name.replace(/\.[^.]+$/, "") || "photo";
            resolve(
              new File([blob], `${base}.jpg`, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
          },
          "image/jpeg",
          quality
        );
      };

      tryBlob(JPEG_QUALITY);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export async function compressImageFiles(files, maxCount = 8) {
  const slice = files.slice(0, maxCount);
  return Promise.all(slice.map((f) => compressImage(f)));
}
