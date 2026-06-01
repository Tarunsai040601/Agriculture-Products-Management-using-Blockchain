const express = require("express");
const {
  fetchFarmers,
  createFarmer,
  deleteFarmer,
} = require("../../Controllers/createFarmerController/createFarmer.js");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware.js");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware.js");
const FarmerRouter = express.Router();

// fetch all farmers
FarmerRouter.get(
  "/get-Farmer",
  authMiddleware,
  roleMiddleware(["admin"]),
  fetchFarmers,
);

// create farmer
FarmerRouter.post(
  "/create-farmer",
  authMiddleware,
  roleMiddleware(["admin"]),
  createFarmer,
);

// delete faramer
FarmerRouter.delete(
  "/delete-farmer",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteFarmer,
);

// module exports
module.exports = FarmerRouter;
