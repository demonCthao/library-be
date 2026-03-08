// src/middlewares/upload.ts

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const createUploader = (folder: string) => {
  const uploadDir = path.join(
    __dirname,
    "../../uploads",
    folder
  );

  // Tự tạo folder nếu chưa tồn tại
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only images allowed"));
      } else {
        cb(null, true);
      }
    },
  });
};