import { compressImageFiles } from "../utils/compressImage";

export const prepareImages = async (files, options) => {
  return compressImageFiles(files, options);
};
