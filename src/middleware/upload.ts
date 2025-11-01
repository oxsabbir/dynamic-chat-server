import { File } from "buffer";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const memoryStorage = multer.memoryStorage();

const fileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // limit the file to 10mb
});
