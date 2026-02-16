if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "StaySphereListings",
    allowed_formats: ["jpeg", "png", "jpg","avif"]
  }
});

module.exports = {
  cloudinary,
  storage
};
