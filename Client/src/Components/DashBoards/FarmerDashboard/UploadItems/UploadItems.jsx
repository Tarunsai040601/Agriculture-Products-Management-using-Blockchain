import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Uploaditems.css";
import Swal from "sweetalert2";

const API_BASE = "https://agriculture-products-management-using-7laj.onrender.com/api/farmer";

const UploadItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editItem = location.state?.editItem;
  const originalProduct = location.state?.originalProduct;
  const isEditMode = Boolean(editItem && originalProduct);

  const [formData, setFormData] = useState({
    product: "",
    description: "",
    location: "",
    cost: "",
    image: null,
  });

  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        product: editItem.product || "",
        description: editItem.description || "",
        location: editItem.location || "",
        cost: editItem.cost ?? "",
        image: null,
      });
      setExistingImage(editItem.image || "");
    }
  }, [isEditMode, editItem]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      Swal.fire({
        title: isEditMode
          ? "🌾 Updating Product..."
          : "🌾 Product Posting...",
        text: isEditMode
          ? "Saving your changes"
          : "Uploading your product",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token =
        localStorage.getItem("farmer_token") ||
        localStorage.getItem("admin_token");

      if (!token) {
        Swal.close();
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please Login First",
        });
        return;
      }

      const formPayload = new FormData();
      formPayload.append("product", formData.product);
      formPayload.append("description", formData.description);
      formPayload.append("location", formData.location);
      formPayload.append("cost", formData.cost);

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      let response;

      if (isEditMode) {
        response = await axios.patch(
          `${API_BASE}/update`,
          formPayload,
          {
            params: { product: originalProduct },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        if (!formData.image) {
          Swal.close();
          Swal.fire({
            icon: "warning",
            title: "Image Required",
            text: "Please select a product image",
          });
          return;
        }

        response = await axios.post(
          `${API_BASE}/postitem`,
          formPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      Swal.close();

      Swal.fire({
        icon: "success",
        title: isEditMode
          ? "✅ Updated Successfully"
          : "🎉 Uploaded Successfully",
        text:
          response?.data?.message ||
          (isEditMode
            ? "Product updated successfully"
            : "Product Uploaded Successfully"),
        timer: 2500,
        showConfirmButton: false,
      });

      setFormData({
        product: "",
        description: "",
        location: "",
        cost: "",
        image: null,
      });
      setExistingImage("");

      const fileInput = document.getElementById("productImage");
      if (fileInput) fileInput.value = "";

      navigate("/farmerDashboard/showitems", { replace: true });
    } catch (error) {
      Swal.close();
      console.log(error);
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update Failed" : "Upload Failed",
        text: error?.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="uploadItemsSection">
      <div className="uploadItemsContainer">
        <div className="uploadItemsImageSide">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200"
            alt="farmer"
          />

          <div className="uploadOverlay">
            <h1>🌾 Upload Farm Products</h1>

            <p>
              Sell your crops directly and connect with dealers and customers.
            </p>
          </div>
        </div>

        <div className="uploadItemsFormSide">
          <form onSubmit={handleSubmit}>
            <h2>{isEditMode ? "Update Product" : "Add New Product"}</h2>

            <div className="uploadInputGroup">
              <input
                type="text"
                name="product"
                placeholder="Product Name"
                value={formData.product}
                onChange={handleChange}
                required
              />
            </div>

            <div className="uploadInputGroup">
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="uploadInputGroup">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="uploadInputGroup">
              <input
                type="number"
                name="cost"
                placeholder="Cost"
                value={formData.cost}
                onChange={handleChange}
                required
              />
            </div>

            {isEditMode && existingImage && !formData.image && (
              <div className="uploadInputGroup">
                <p className="uploadCurrentImageLabel">Current image:</p>
                <img
                  src={existingImage}
                  alt="Current product"
                  className="uploadCurrentImagePreview"
                />
              </div>
            )}

            <div className="uploadInputGroup">
              <input
                id="productImage"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!isEditMode}
              />
              {isEditMode && (
                <small className="uploadImageHint">
                  Leave empty to keep the current image
                </small>
              )}
            </div>

            <button type="submit" className="uploadBtn" disabled={loading}>
              {loading ? (
                <>
                  <span className="uploadSpinner"></span>
                  {isEditMode ? "Updating Product..." : "Posting Product..."}
                </>
              ) : isEditMode ? (
                "✏️ Update Product"
              ) : (
                "🚜 Upload Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UploadItems;
