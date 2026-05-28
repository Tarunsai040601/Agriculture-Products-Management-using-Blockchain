const express = require("express");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware.js");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware.js");
const {
  Getallitems,
  PostItems,
  getByname,
  updatebyName,
  deletebyName,
} = require("../../Controllers/FarmerpostController/FarmerPostController.js");
const uploads = require("../../Multer/Multer.js");
const farmerPostRouter = express.Router();

// get-farmer-post
farmerPostRouter.get(
  "/getPost",
  authMiddleware,
  roleMiddleware(["farmer"]),
  Getallitems,
);

// post-farmer-items
farmerPostRouter.post(
  "/postitem",
  authMiddleware,
  roleMiddleware(["farmer"]),
  uploads.single("image"),
  PostItems,
);

// get-items based on name
farmerPostRouter.get(
  "/getname",
  authMiddleware,
  roleMiddleware(["farmer"]),
  getByname,
);

// update iteams based on name
farmerPostRouter.patch(
  "/update",
  authMiddleware,
  roleMiddleware(["farmer"]),
  uploads.single("image"),
  updatebyName,
);

// delete items backend on name
farmerPostRouter.delete(
  "/delete",
  authMiddleware,
  roleMiddleware(["farmer"]),
  deletebyName,
);

module.exports = farmerPostRouter;
