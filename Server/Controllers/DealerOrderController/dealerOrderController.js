const DealerOrderModel = require("../../Models/dealer_orders/dealer_order_schema.js");
const itemsSchema = require("../../Models/farmer_posts/farmer_post_schema.js");

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

module.exports = {
  placeDealerOrder,
  getFarmerOrders,
  getDealerOrders,
};
