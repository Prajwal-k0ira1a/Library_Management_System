import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// User profile image storage
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "library-users",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});
const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Book image storage
const bookStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "library-books",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 700, crop: "fill" }],
  },
});
const uploadBookImages = multer({
  storage: bookStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { cloudinary, uploadUserImage, uploadBookImages };
