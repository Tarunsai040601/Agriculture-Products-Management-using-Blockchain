const itemsSchema = require("../../Models/farmer_posts/farmer_post_schema.js");

// =========================================
// GET ALL ITEMS
// =========================================

const Getallitems = async (req, res) => {
  try {
    console.log("\n========== GET ALL ITEMS ==========");

    console.log("logged user:", req.user);

    const getItems = await itemsSchema.find({
      createdBy: req.user.name,
    });

    console.log("Fetched Items:", getItems);

    console.log("Total Items:", getItems.length);

    return res.status(200).json({
      status: true,

      message: "items fetched successfully",

      total_items: getItems.length,

      data: getItems,
    });
  } catch (error) {
    console.log("Getallitems_error:", error.message);

    return res.status(500).json({
      status: false,

      message: "failed to fetch items",

      error_message: error.message,
    });
  }
};

// =========================================
// POST ITEMS
// =========================================

const PostItems = async (req, res) => {
  try {
    console.log("\n========== POST ITEMS ==========");

    console.log("body_data:", req.body);

    console.log("file_data:", req.file);

    console.log("logged_user:", req.user);

    const {
      product,

      description,

      location,

      cost,
    } = req.body;

    // validations

    if (!product || !description || !location || !cost) {
      console.log("Validation Failed");

      return res.status(400).json({
        status: false,

        message: "all fields required",
      });
    }

    // image validation

    if (!req.file) {
      console.log("Image Missing");

      return res.status(400).json({
        status: false,

        message: "image is required",
      });
    }

    console.log("Cloudinary Image URL:", req.file.path);

    // create item

    const insertItem = await itemsSchema.create({
      product,

      description,

      location,

      cost,

      image: req.file.path,

      createdBy: req.user.name,
    });

    console.log("Inserted Item:", insertItem);

    return res.status(201).json({
      status: true,

      message: "item posted successfully",

      data: insertItem,
    });
  } catch (error) {
    console.log("PostItems_error:", error);

    return res.status(500).json({
      status: false,

      message: "post item failed",

      error_message: error.message,
    });
  }
};

// =========================================
// GET ITEM BY PRODUCT NAME
// =========================================

const getByname = async (req, res) => {
  try {
    console.log("\n========== GET ITEM BY NAME ==========");

    const { product } = req.query;

    console.log("query_product:", product);

    console.log("logged_user:", req.user);

    if (!product) {
      return res.status(400).json({
        status: false,

        message: "product query required",
      });
    }

    const getProduct = await itemsSchema.findOne({
      product: product,

      createdBy: req.user.name,
    });

    console.log("Fetched Product:", getProduct);

    if (!getProduct) {
      return res.status(404).json({
        status: false,

        message: "product not found",
      });
    }

    return res.status(200).json({
      status: true,

      message: "product fetched successfully",

      data: getProduct,
    });
  } catch (error) {
    console.log("getByname_error:", error.message);

    return res.status(500).json({
      status: false,

      message: "get by name failed",

      error_message: error.message,
    });
  }
};

// =========================================
// UPDATE ITEM BY PRODUCT NAME
// =========================================

const updatebyName = async (req, res) => {
  try {
    console.log("\n========== UPDATE ITEM ==========");

    const { product } = req.query;

    console.log("query_product:", product);

    console.log("body_data:", req.body);

    console.log("file_data:", req.file);

    console.log("logged_user:", req.user);

    if (!product) {
      return res.status(400).json({
        status: false,

        message: "product query required",
      });
    }

    const updateData = {
      ...req.body,
    };

    // update image if uploaded

    if (req.file) {
      updateData.image = req.file.path;

      console.log("Updated Image URL:", req.file.path);
    }

    console.log("final_update_data:", updateData);

    const updatedItem = await itemsSchema.findOneAndUpdate(
      {
        product: product,

        createdBy: req.user.name,
      },

      updateData,

      {
        new: true,
      },
    );

    console.log("Updated Item:", updatedItem);

    if (!updatedItem) {
      return res.status(404).json({
        status: false,

        message: "product not found",
      });
    }

    return res.status(200).json({
      status: true,

      message: "product updated successfully",

      data: updatedItem,
    });
  } catch (error) {
    console.log("updatebyName_error:", error.message);

    return res.status(500).json({
      status: false,

      message: "update failed",

      error_message: error.message,
    });
  }
};

// =========================================
// DELETE ITEM BY PRODUCT NAME
// =========================================

const deletebyName = async (req, res) => {
  try {
    console.log("\n========== DELETE ITEM ==========");

    const { product } = req.query;

    console.log("query_product:", product);

    console.log("logged_user:", req.user);

    if (!product) {
      return res.status(400).json({
        status: false,

        message: "product query required",
      });
    }

    const deleteItem = await itemsSchema.findOneAndDelete({
      product: product,

      createdBy: req.user.name,
    });

    console.log("Deleted Item:", deleteItem);

    if (!deleteItem) {
      return res.status(404).json({
        status: false,

        message: "product not found",
      });
    }

    return res.status(200).json({
      status: true,

      message: "product deleted successfully",

      data: deleteItem,
    });
  } catch (error) {
    console.log("deletebyName_error:", error.message);

    return res.status(500).json({
      status: false,

      message: "delete failed",

      error_message: error.message,
    });
  }
};

// =========================================
// MODULE EXPORTS
// =========================================

module.exports = {
  Getallitems,

  PostItems,

  getByname,

  updatebyName,

  deletebyName,
};
