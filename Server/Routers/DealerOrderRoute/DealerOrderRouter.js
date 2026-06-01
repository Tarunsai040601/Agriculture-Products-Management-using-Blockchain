const express = require("express");
const authMiddleware = require("../../Middlewares/AuthMiddleWares/authMiddleware.js");
const roleMiddleware = require("../../Middlewares/RoleMiddleWares/roleMiddleware.js");
const {
  placeDealerOrder,
  getFarmerOrders,
  getDealerOrders,
  updateDealerOrderStatus,
} = require("../../Controllers/DealerOrderController/dealerOrderController.js");

const dealerOrderRouter = express.Router();

dealerOrderRouter.post(
  "/place",
  authMiddleware,
  roleMiddleware(["farmer"]),
  placeDealerOrder,
);

dealerOrderRouter.get(
  "/farmer-orders",
  authMiddleware,
  roleMiddleware(["farmer"]),
  getFarmerOrders,
);

dealerOrderRouter.get(
  "/dealer-orders",
  authMiddleware,
  roleMiddleware(["dealer"]),
  getDealerOrders,
);

dealerOrderRouter.patch(
  "/:orderId/status",
  authMiddleware,
  roleMiddleware(["dealer"]),
  updateDealerOrderStatus,
);

module.exports = dealerOrderRouter;
