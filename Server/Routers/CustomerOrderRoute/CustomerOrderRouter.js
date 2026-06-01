const express = require("express");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware.js");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware.js");
const {
  placeCustomerOrder,
  getCustomerOrders,
  getFarmerCustomerOrders,
  acceptCustomerOrder,
  markDealerReceived,
  markDeliveredToCustomer,
} = require("../../Controllers/CustomerOrderController/customerOrderController.js");

const customerOrderRouter = express.Router();

customerOrderRouter.post(
  "/place",
  authMiddleware,
  roleMiddleware(["customer"]),
  placeCustomerOrder,
);

customerOrderRouter.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware(["customer"]),
  getCustomerOrders,
);

customerOrderRouter.get(
  "/farmer-orders",
  authMiddleware,
  roleMiddleware(["farmer"]),
  getFarmerCustomerOrders,
);

customerOrderRouter.patch(
  "/accept/:orderId",
  authMiddleware,
  roleMiddleware(["farmer"]),
  acceptCustomerOrder,
);

customerOrderRouter.patch(
  "/dealer-received/:orderId",
  authMiddleware,
  roleMiddleware(["farmer"]),
  markDealerReceived,
);

customerOrderRouter.patch(
  "/deliver/:orderId",
  authMiddleware,
  roleMiddleware(["farmer"]),
  markDeliveredToCustomer,
);

module.exports = customerOrderRouter;
