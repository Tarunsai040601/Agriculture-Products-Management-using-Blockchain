const DealerOrderModel = require("../../Models/dealer_orders/dealer_order_schema.js");
const CustomerOrderModel = require("../../Models/customer_orders/customer_order_schema.js");
const itemsSchema = require("../../Models/farmer_posts/farmer_post_schema.js");
const {
  notifyOrderCompletion,
} = require("../../Services/whatsappService.js");

const trim = (value) => (value || "").trim();

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findLinkedCustomerOrder = async (dealerOrder) => {
  if (dealerOrder.customerOrderId) {
    const byId = await CustomerOrderModel.findById(dealerOrder.customerOrderId);
    if (byId) return byId;
  }

  const phone = trim(dealerOrder.phoneNo);
  const product = trim(dealerOrder.productName);
  const customer = trim(dealerOrder.customerName);
  const farmer = trim(dealerOrder.farmerName);
  const address = trim(dealerOrder.homeAddress).toLowerCase();
  const dealerEmail = trim(dealerOrder.dealerEmail).toLowerCase();
  const dealerName = trim(dealerOrder.dealerName).toLowerCase();

  const candidates = await CustomerOrderModel.find({
    phoneNo: phone,
    productName: { $regex: new RegExp(`^${escapeRegex(product)}$`, "i") },
    customerName: { $regex: new RegExp(`^${escapeRegex(customer)}$`, "i") },
    farmerName: { $regex: new RegExp(`^${escapeRegex(farmer)}$`, "i") },
  }).sort({ createdAt: -1 });

  for (const order of candidates) {
    if (trim(order.homeAddress).toLowerCase() !== address) continue;

    const orderDealerEmail = trim(order.dealerEmail).toLowerCase();
    const orderDealerName = trim(order.dealerName).toLowerCase();

    if (dealerEmail && orderDealerEmail === dealerEmail) return order;
    if (dealerName && orderDealerName === dealerName) return order;
  }

  return (
    candidates.find(
      (order) => trim(order.homeAddress).toLowerCase() === address,
    ) || null
  );
};

const STATUS_RANK = {
  pending: 0,
  accepted: 1,
  assigned_to_dealer: 2,
  dealer_received: 3,
  delivered: 4,
  cancelled: -1,
};

const customerStatusFromDealer = (dealerStatus) => {
  if (dealerStatus === "received") return "dealer_received";
  if (dealerStatus === "completed") return "delivered";
  return null;
};

const syncCustomerOrderStatus = async (dealerOrder, dealerStatus) => {
  const customerOrder = await findLinkedCustomerOrder(dealerOrder);
  if (!customerOrder) return null;

  const nextStatus = customerStatusFromDealer(dealerStatus);
  if (!nextStatus) return customerOrder;

  if (["delivered", "cancelled"].includes(customerOrder.orderStatus)) {
    return customerOrder;
  }

  const currentRank = STATUS_RANK[customerOrder.orderStatus] ?? 0;
  const nextRank = STATUS_RANK[nextStatus] ?? 0;

  if (nextRank > currentRank) {
    customerOrder.orderStatus = nextStatus;
    await customerOrder.save();
  }

  return customerOrder;
};

const findLinkedDealerOrder = async (customerOrder) => {
  const byId = await DealerOrderModel.findOne({
    customerOrderId: customerOrder._id,
  }).sort({ createdAt: -1 });

  if (byId) return byId;

  const phone = trim(customerOrder.phoneNo);
  const candidates = await DealerOrderModel.find({
    phoneNo: phone,
    productName: {
      $regex: new RegExp(
        `^${escapeRegex(trim(customerOrder.productName))}$`,
        "i",
      ),
    },
    customerName: {
      $regex: new RegExp(
        `^${escapeRegex(trim(customerOrder.customerName))}$`,
        "i",
      ),
    },
    farmerName: {
      $regex: new RegExp(
        `^${escapeRegex(trim(customerOrder.farmerName))}$`,
        "i",
      ),
    },
  }).sort({ createdAt: -1 });

  const address = trim(customerOrder.homeAddress).toLowerCase();

  return (
    candidates.find(
      (row) => trim(row.homeAddress).toLowerCase() === address,
    ) || candidates[0] || null
  );
};

const reconcileDealerOrdersForCustomer = async (customerOrders) => {
  for (const order of customerOrders) {
    if (["delivered", "cancelled"].includes(order.orderStatus)) continue;

    const dealerOrder = await findLinkedDealerOrder(order);
    if (!dealerOrder) continue;

    const synced = await syncCustomerOrderStatus(
      dealerOrder,
      dealerOrder.orderStatus,
    );

    if (synced) {
      order.orderStatus = synced.orderStatus;
    }
  }
};

const placeDealerOrder = async (req, res) => {
  try {
    const {
      customerName,
      phoneNo,
      homeAddress,
      productName,
      dealerName,
      dealerEmail,
    } = req.body;

    if (
      !customerName ||
      !phoneNo ||
      !homeAddress ||
      !productName ||
      !dealerName ||
      !dealerEmail
    ) {
      return res.status(400).json({
        status: false,
        message:
          "customerName, phoneNo, homeAddress, productName, dealerName and dealerEmail are required",
      });
    }

    const productExists = await itemsSchema.findOne({
      product: productName,
      createdBy: req.user.name,
    });

    if (!productExists) {
      return res.status(404).json({
        status: false,
        message: "product not found in your listings",
      });
    }

    const newOrder = await DealerOrderModel.create({
      customerName: customerName.trim(),
      phoneNo: phoneNo.trim(),
      homeAddress: homeAddress.trim(),
      productName: productName.trim(),
      dealerName: dealerName.trim(),
      dealerEmail: dealerEmail.trim(),
      farmerName: req.user.name,
    });

    return res.status(201).json({
      status: true,
      message: "order placed and assigned to dealer successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log("placeDealerOrder_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to place dealer order",
      error_message: error.message,
    });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    const orders = await DealerOrderModel.find({
      farmerName: req.user.name,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "farmer orders fetched successfully",
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    console.log("getFarmerOrders_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to fetch farmer orders",
      error_message: error.message,
    });
  }
};

const getDealerOrders = async (req, res) => {
  try {
    const orders = await DealerOrderModel.find({
      dealerEmail: req.user.email,
    }).sort({ createdAt: -1 });

    await Promise.all(
      orders
        .filter((o) => ["received", "completed"].includes(o.orderStatus))
        .map((o) => syncCustomerOrderStatus(o, o.orderStatus)),
    );

    return res.status(200).json({
      status: true,
      message: "dealer orders fetched successfully",
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    console.log("getDealerOrders_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to fetch dealer orders",
      error_message: error.message,
    });
  }
};

const updateDealerOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = ["received", "completed"];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        status: false,
        message: "orderStatus must be received or completed",
      });
    }

    const order = await DealerOrderModel.findOne({
      _id: orderId,
      dealerEmail: req.user.email,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "order not found",
      });
    }

    if (orderStatus === "received" && order.orderStatus !== "pending") {
      return res.status(400).json({
        status: false,
        message: "only pending orders can be marked as received",
      });
    }

    if (orderStatus === "completed" && order.orderStatus !== "received") {
      return res.status(400).json({
        status: false,
        message: "only received orders can be marked as completed",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    const syncedCustomerOrder = await syncCustomerOrderStatus(order, orderStatus);

    // Send WhatsApp notification to customer when order is completed
    if (orderStatus === "completed" && syncedCustomerOrder) {
      try {
        await notifyOrderCompletion(
          order.phoneNo,
          order.customerName,
          order.productName
        );
      } catch (waError) {
        console.error("WhatsApp notification failed:", waError.message);
      }
    }

    return res.status(200).json({
      status: true,
      message: `order marked as ${orderStatus}`,
      data: order,
      customerTrackingStatus: syncedCustomerOrder?.orderStatus || null,
    });
  } catch (error) {
    console.log("updateDealerOrderStatus_error:", error.message);

    return res.status(500).json({
      status: false,
      message: "failed to update order status",
      error_message: error.message,
    });
  }
};

module.exports = {
  placeDealerOrder,
  getFarmerOrders,
  getDealerOrders,
  updateDealerOrderStatus,
  reconcileDealerOrdersForCustomer,
};
