const CustomerOrderModel = require("../../Models/customer_orders/customer_order_schema.js");
const DealerOrderModel = require("../../Models/dealer_orders/dealer_order_schema.js");
const authSchema = require("../../Models/AuthSchema/authSchema.js");
const itemsSchema = require("../../Models/farmer_posts/farmer_post_schema.js");
const {
  reconcileDealerOrdersForCustomer,
} = require("../DealerOrderController/dealerOrderController.js");
const {
  notifyOrderAcceptance,
  notifyOrderCompletion,
} = require("../../Services/whatsappService.js");

const placeCustomerOrder = async (req, res) => {
  try {
    const {
      customerName,
      phoneNo,
      homeAddress,
      productName,
      quantity,
      farmerName,
    } = req.body;

    if (
      !customerName ||
      !phoneNo ||
      !homeAddress ||
      !productName ||
      !quantity ||
      !farmerName
    ) {
      return res.status(400).json({
        status: false,
        message:
          "customerName, phoneNo, homeAddress, productName, quantity and farmerName are required",
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        status: false,
        message: "quantity must be a positive whole number",
      });
    }

    const productExists = await itemsSchema.findOne({
      product: productName.trim(),
      createdBy: farmerName.trim(),
    });

    if (!productExists) {
      return res.status(404).json({
        status: false,
        message: "product not found",
      });
    }

    const newOrder = await CustomerOrderModel.create({
      customerName: customerName.trim(),
      phoneNo: phoneNo.trim(),
      homeAddress: homeAddress.trim(),
      productName: productName.trim(),
      quantity: qty,
      farmerName: farmerName.trim(),
      productCost: productExists.cost,
      productImage: productExists.image,
      customerEmail: req.user.email,
    });

    return res.status(201).json({
      status: true,
      message: "order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log("placeCustomerOrder_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to place order",
      error_message: error.message,
    });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const orders = await CustomerOrderModel.find({
      customerEmail: req.user.email,
    }).sort({ createdAt: -1 });

    await reconcileDealerOrdersForCustomer(orders);

    const refreshed = await CustomerOrderModel.find({
      customerEmail: req.user.email,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "your orders fetched successfully",
      total_orders: refreshed.length,
      data: refreshed,
    });
  } catch (error) {
    console.log("getCustomerOrders_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to fetch your orders",
      error_message: error.message,
    });
  }
};

const getFarmerCustomerOrders = async (req, res) => {
  try {
    const orders = await CustomerOrderModel.find({
      farmerName: req.user.name,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "customer orders fetched successfully",
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    console.log("getFarmerCustomerOrders_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to fetch customer orders",
      error_message: error.message,
    });
  }
};

const acceptCustomerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "order id is required",
      });
    }

    const order = await CustomerOrderModel.findOne({
      _id: orderId,
      farmerName: req.user.name,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "order not found",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        status: false,
        message: `order is already ${order.orderStatus}`,
      });
    }

    order.orderStatus = "accepted";
    await order.save();

    // Send WhatsApp notification to customer
    try {
      await notifyOrderAcceptance(
        order.phoneNo,
        order.customerName,
        order.productName,
        order.farmerName
      );
    } catch (waError) {
      console.error("WhatsApp notification failed:", waError.message);
    }

    return res.status(200).json({
      status: true,
      message: "order accepted successfully",
      data: order,
    });
  } catch (error) {
    console.log("acceptCustomerOrder_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to accept order",
      error_message: error.message,
    });
  }
};

const acceptAndAssignToDealer = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { dealerName, dealerEmail } = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "order id is required",
      });
    }

    if (!dealerName || !dealerEmail) {
      return res.status(400).json({
        status: false,
        message: "dealerName and dealerEmail are required",
      });
    }

    const dealer = await authSchema.findOne({
      name: dealerName.trim(),
      email: dealerEmail.trim(),
      role: "dealer",
    });

    if (!dealer) {
      return res.status(404).json({
        status: false,
        message: "dealer not found",
      });
    }

    const order = await CustomerOrderModel.findOne({
      _id: orderId,
      farmerName: req.user.name,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "order not found",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        status: false,
        message: `only pending orders can be assigned (current: ${order.orderStatus})`,
      });
    }

    order.dealerName = dealer.name;
    order.dealerEmail = dealer.email;
    order.orderStatus = "assigned_to_dealer";
    await order.save();

    await DealerOrderModel.create({
      customerName: order.customerName,
      phoneNo: order.phoneNo,
      homeAddress: order.homeAddress,
      productName: order.productName,
      dealerName: dealer.name,
      dealerEmail: dealer.email,
      farmerName: req.user.name,
      customerOrderId: order._id,
    });

    // Send WhatsApp notification to customer
    try {
      await notifyOrderAcceptance(
        order.phoneNo,
        order.customerName,
        order.productName,
        order.farmerName
      );
    } catch (waError) {
      console.error("WhatsApp notification failed:", waError.message);
    }

    return res.status(200).json({
      status: true,
      message: "order accepted and assigned to dealer successfully",
      data: order,
    });
  } catch (error) {
    console.log("acceptAndAssignToDealer_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to accept and assign order",
      error_message: error.message,
    });
  }
};

const markDealerReceived = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "order id is required",
      });
    }

    const order = await CustomerOrderModel.findOne({
      _id: orderId,
      farmerName: req.user.name,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "order not found",
      });
    }

    const canMarkReceived = ["accepted", "assigned_to_dealer"].includes(
      order.orderStatus,
    );

    if (!canMarkReceived) {
      return res.status(400).json({
        status: false,
        message: `order must be assigned to dealer before marking received (current: ${order.orderStatus})`,
      });
    }

    order.orderStatus = "dealer_received";
    await order.save();

    return res.status(200).json({
      status: true,
      message: "dealer received order successfully",
      data: order,
    });
  } catch (error) {
    console.log("markDealerReceived_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to update dealer received status",
      error_message: error.message,
    });
  }
};

const markDeliveredToCustomer = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "order id is required",
      });
    }

    const order = await CustomerOrderModel.findOne({
      _id: orderId,
      farmerName: req.user.name,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "order not found",
      });
    }

    if (order.orderStatus !== "dealer_received") {
      return res.status(400).json({
        status: false,
        message: `order must be received by dealer first (current: ${order.orderStatus})`,
      });
    }

    order.orderStatus = "delivered";
    await order.save();

    // Send WhatsApp notification to customer when order is delivered
    try {
      await notifyOrderCompletion(
        order.phoneNo,
        order.customerName,
        order.productName
      );
    } catch (waError) {
      console.error("WhatsApp notification failed:", waError.message);
    }

    return res.status(200).json({
      status: true,
      message: "order delivered to customer successfully",
      data: order,
    });
  } catch (error) {
    console.log("markDeliveredToCustomer_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to mark order as delivered",
      error_message: error.message,
    });
  }
};

module.exports = {
  placeCustomerOrder,
  getCustomerOrders,
  getFarmerCustomerOrders,
  acceptCustomerOrder,
  acceptAndAssignToDealer,
  markDealerReceived,
  markDeliveredToCustomer,
};
