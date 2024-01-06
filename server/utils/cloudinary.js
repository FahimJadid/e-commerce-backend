const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImgToCloudinary = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (uploadResult) => {
      resolve({ url: uploadResult.secure_url, resource_type: "auto" });
    });
  });
};

module.exports = uploadImgToCloudinary;
