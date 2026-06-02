const express = require("express");
const {
  fetchDealers,
  createDealer,
  deleteDealer,
  dealers,
} = require("../../Controllers/DealerController/dealerController.js");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware.js");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware.js");
const dealerRoute = express.Router();

// fetch the dealer
dealerRoute.get(
  "/get-dealer",
  authMiddleware,
  roleMiddleware(["admin"]),
  fetchDealers,
);

// create the dealer
dealerRoute.post(
  "/post-dealer",
  authMiddleware,
  roleMiddleware(["admin"]),
  createDealer,
);

// delete dealer
dealerRoute.delete(
  "/delete-dealer",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteDealer,
);

dealerRoute.get("/getDealers", dealers);

// modules exports
module.exports = dealerRoute;
