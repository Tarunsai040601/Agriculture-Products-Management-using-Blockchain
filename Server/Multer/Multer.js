const multer = require("multer");

const cloudinary = require("../Cloudinary/Cloudinary.js");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("cloudinary:", cloudinary.config());

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const storage = new CloudinaryStorage({

  cloudinary: cloudinary,

  params: async (req, file) => {

    console.log("file:", file);

    return {

      folder: "uploads",

      allowed_formats: ["jpg", "png", "jpeg", "webp"],

      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,

    };

  },

});

const uploads = multer({

  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("only jpg, jpeg, png, webp files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

module.exports = uploads;