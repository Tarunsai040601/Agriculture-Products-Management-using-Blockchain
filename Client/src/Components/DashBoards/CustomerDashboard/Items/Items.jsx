import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCustomerAuth } from "../../../../hooks/useCustomerAuth";
import "./Items.css";

const FARMER_API = "http://localhost:8045/api/farmer";
const ORDER_API = "http://localhost:8045/api/customer-order";

const EMPTY_ORDER = {
  productName: "",
  customerName: "",
  phoneNo: "",
  homeAddress: "",
  quantity: "1",
  farmerName: "",
};

const Items = () => {
  const navigate = useNavigate();
  const { token, customerName: storedName } = useCustomerAuth();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER);
  const [submitting, setSubmitting] = useState(false);

  const [fetchError, setFetchError] = useState("");

  const parseProductList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.products)) return data.products;
    return [];
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");

      const res = await axios.get(`${FARMER_API}/public-items`);
      setProducts(parseProductList(res.data));
    } catch (err) {
      console.log("fetch products error:", err);
      setProducts([]);
      setFetchError(
        err?.response?.data?.message ||
          "Could not load farmer products. Make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((item) => {
      const fields = [
        item.product,
        item.description,
        item.location,
        item.createdBy,
        String(item.cost ?? ""),
      ];
      return fields.some((field) =>
        String(field ?? "").toLowerCase().includes(query),
      );
    });
  }, [products, searchQuery]);

  const closeOrderModal = () => {
    setOrderItem(null);
    setOrderForm(EMPTY_ORDER);
    setSubmitting(false);
  };

  const openOrderModal = (item) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login as a customer to place an order.",
        confirmButtonColor: "#2e7d32",
      }).then(() => navigate("/login"));
      return;
    }

    setOrderItem(item);
    setOrderForm({
      productName: item.product || "",
      customerName: storedName,
      phoneNo: "",
      homeAddress: "",
      quantity: "1",
      farmerName: item.createdBy || "",
    });
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const { customerName, phoneNo, homeAddress, productName, quantity, farmerName } =
      orderForm;

    if (
      !customerName.trim() ||
      !phoneNo.trim() ||
      !homeAddress.trim() ||
      !productName ||
      !farmerName
    ) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please fill product name, your name, phone, and address.",
        confirmButtonColor: "#2e7d32",
      });
      return;
    }

    if (!/^\d{10}$/.test(phoneNo.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid phone",
        text: "Enter a valid 10-digit phone number.",
        confirmButtonColor: "#2e7d32",
      });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${ORDER_API}/place`,
        {
          customerName: customerName.trim(),
          phoneNo: phoneNo.trim(),
          homeAddress: homeAddress.trim(),
          productName,
          quantity: Number(quantity),
          farmerName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      closeOrderModal();

      await Swal.fire({
        icon: "success",
        title: "Order placed!",
        html: `Your order for <strong>${productName}</strong> has been sent to farmer <strong>${farmerName}</strong>.`,
        confirmButtonColor: "#2e7d32",
      });
    } catch (error) {
      setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: error?.response?.data?.message || "Could not place order",
        confirmButtonColor: "#c62828",
      });
    }
  };

  return (
    <div className="citems-page">
      <header className="citems-header">
        <h1 className="citems-title">Fresh Farm Products</h1>
        <p className="citems-subtitle">
          Browse items posted by farmers — read details and place your order.
        </p>
      </header>

      {!loading && products.length > 0 && (
        <div className="citems-search-wrap">
          <input
            type="search"
            className="citems-search-input"
            placeholder="Search by product, location, farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="citems-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!loading && products.length > 0 && (
        <p className="citems-count">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      {fetchError && (
        <p className="citems-status citems-status--error">{fetchError}</p>
      )}

      {loading ? (
        <p className="citems-status">Loading farmer products...</p>
      ) : products.length === 0 && !fetchError ? (
        <p className="citems-status">
          No products yet. Farmers can post items from Upload Items in their
          dashboard.
        </p>
      ) : filteredProducts.length > 0 ? (
        <div className="citems-grid">
          {filteredProducts.map((item) => (
            <article className="citems-card" key={item._id || item.product}>
              <div className="citems-img-wrap">
                <img
                  src={item.image}
                  alt={item.product}
                  className="citems-img"
                  loading="lazy"
                />
              </div>

              <div className="citems-card-body">
                <h3>{item.product}</h3>
                <p className="citems-desc">{item.description}</p>
                <p className="citems-meta">📍 {item.location}</p>
                <p className="citems-farmer">
                  🧑‍🌾 {item.createdBy || "Farmer"}
                </p>
                <p className="citems-price">₹{item.cost}</p>

                <div className="citems-btn-group">
                  <button
                    type="button"
                    className="citems-read-btn"
                    onClick={() => setDetailItem(item)}
                  >
                    Read More
                  </button>
                  <button
                    type="button"
                    className="citems-order-btn"
                    onClick={() => openOrderModal(item)}
                  >
                    Order
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="citems-status">
          No products match &quot;{searchQuery.trim()}&quot;
        </p>
      )}

      {detailItem && (
        <div
          className="citems-modal-overlay"
          onClick={() => setDetailItem(null)}
          role="presentation"
        >
          <div
            className="citems-modal citems-modal--detail"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="citems-detail-title"
          >
            <button
              type="button"
              className="citems-modal-close"
              onClick={() => setDetailItem(null)}
              aria-label="Close details"
            >
              ✕
            </button>

            {detailItem.image && (
              <div className="citems-detail-img-wrap">
                <img src={detailItem.image} alt={detailItem.product} />
              </div>
            )}

            <h2 id="citems-detail-title">{detailItem.product}</h2>
            <p className="citems-detail-desc">{detailItem.description}</p>
            <ul className="citems-detail-list">
              <li>
                <span>Location</span>
                {detailItem.location}
              </li>
              <li>
                <span>Price</span>₹{detailItem.cost}
              </li>
              <li>
                <span>Farmer</span>
                {detailItem.createdBy}
              </li>
            </ul>

            <button
              type="button"
              className="citems-order-btn citems-order-btn--full"
              onClick={() => {
                setDetailItem(null);
                openOrderModal(detailItem);
              }}
            >
              Order this product
            </button>
          </div>
        </div>
      )}

      {orderItem && (
        <div
          className="citems-modal-overlay"
          onClick={closeOrderModal}
          role="presentation"
        >
          <div
            className="citems-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="citems-order-title"
          >
            <button
              type="button"
              className="citems-modal-close"
              onClick={closeOrderModal}
              aria-label="Close order form"
            >
              ✕
            </button>

            <h2 id="citems-order-title" className="citems-modal-title">
              Place Order
            </h2>
            <p className="citems-modal-product">
              Product: <strong>{orderItem.product}</strong>
            </p>

            <form className="citems-order-form" onSubmit={handlePlaceOrder}>
              <label className="citems-field">
                <span>Product Name</span>
                <input
                  type="text"
                  name="productName"
                  value={orderForm.productName}
                  readOnly
                />
              </label>

              <label className="citems-field">
                <span>Your Name</span>
                <input
                  type="text"
                  name="customerName"
                  value={orderForm.customerName}
                  onChange={handleOrderChange}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label className="citems-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  name="phoneNo"
                  value={orderForm.phoneNo}
                  onChange={handleOrderChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </label>

              <label className="citems-field">
                <span>Home Address</span>
                <textarea
                  name="homeAddress"
                  value={orderForm.homeAddress}
                  onChange={handleOrderChange}
                  placeholder="House no, street, city, pincode"
                  rows={3}
                  required
                />
              </label>

              <label className="citems-field">
                <span>Quantity (kg)</span>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  value={orderForm.quantity}
                  onChange={handleOrderChange}
                  required
                />
              </label>

              <div className="citems-modal-actions">
                <button
                  type="button"
                  className="citems-cancel-btn"
                  onClick={closeOrderModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="citems-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Placing..." : "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
