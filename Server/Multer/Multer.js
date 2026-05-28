const multer = require("multer");

const cloudinary = require("../Cloudinary/Cloudinary.js");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("cloudinary:", cloudinary.config());

const storage = new CloudinaryStorage({

  cloudinary: cloudinary,

  params: async (req, file) => {

    console.log("file:", file);

    return {

      folder: "uploads/images",

      allowed_formats: ["jpg", "png", "jpeg", "webp"],

      public_id: Date.now() + "-" + file.originalname,

    };

  },

});

const uploads = multer({

  storage: storage,

});

module.exports = uploads;