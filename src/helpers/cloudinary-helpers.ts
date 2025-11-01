import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const uploadFile = function (
  fileBuffer: Express.Multer.File | undefined,
  folder: string
): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) reject(null);
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(fileBuffer?.buffer);
  });
};
