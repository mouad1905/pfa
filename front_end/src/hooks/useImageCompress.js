import { useCallback } from "react";
import { compressImageFiles } from "../utils/compressImage";

export function useImageCompress() {
  const compress = useCallback(async (files, options) => {
    return compressImageFiles(files, options);
  }, []);

  return { compress };
}
