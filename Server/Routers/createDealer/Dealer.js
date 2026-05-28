const express = require("express");
const {
  fetchDealers,
  createDealer,
} = require("../../Controllers/DealerController/dealerController");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware");
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

// modules exports
module.exports = dealerRoute;
