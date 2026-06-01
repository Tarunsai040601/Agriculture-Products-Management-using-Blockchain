const CustomerOrderModel = require("../../Models/customer_orders/customer_order_schema.js");
const itemsSchema = require("../../Models/farmer_posts/farmer_post_schema.js");

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

    return res.status(200).json({
      status: true,
      message: "your orders fetched successfully",
      total_orders: orders.length,
      data: orders,
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

    if (order.orderStatus !== "accepted") {
      return res.status(400).json({
        status: false,
        message: `order must be accepted before dealer can receive (current: ${order.orderStatus})`,
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
  markDealerReceived,
  markDeliveredToCustomer,
};
