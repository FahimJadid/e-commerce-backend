const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadImgToCloudinary = async (fileToUploads) => {
//   // return await new Promise((resolve) => {
//   //   cloudinary.uploader.upload(fileToUploads, (result) => {
//   //     // return resolve({ url: result.secure_url }, { resource_type: "auto" });
//   //     return resolve(result);
//   //   });
//   // });
//   return await cloudinary.uploader.upload(fileToUploads, {
//     resource_type: "auto",
//     secure_url: true,
//   });
// };

const uploadImgToCloudinary = async (fileToUploads) => {
  const { secure_url, resource_type } = await cloudinary.uploader.upload(
    fileToUploads,
    {
      resource_type: "auto",
      secure_url: true,
    }
  );

  return { secure_url, resource_type };
};

module.exports = uploadImgToCloudinary;
