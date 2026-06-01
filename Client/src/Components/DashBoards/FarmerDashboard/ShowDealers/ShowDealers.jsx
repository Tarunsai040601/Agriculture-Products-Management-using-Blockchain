import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ShowDealers.css";

import dealerImg1 from "../../../../assets/dealers/dealer1.png";
import dealerImg2 from "../../../../assets/dealers/dealer2.png";
import dealerImg3 from "../../../../assets/dealers/dealer3.png";
import dealerImg4 from "../../../../assets/dealers/dealer4.png";
import dealerImg5 from "../../../../assets/dealers/dealer5.png";
import dealerImg6 from "../../../../assets/dealers/dealer6.png";

const DEALER_API = "http://localhost:8045/api/dealer/getDealers";
const FARMER_API = "http://localhost:8045/api/farmer";
const ORDER_API = "http://localhost:8045/api/dealer-order";

const DEALER_AVATARS = [
  dealerImg1,
  dealerImg2,
  dealerImg3,
  dealerImg4,
  dealerImg5,
  dealerImg6,
];

const EMPTY_ORDER = {
  customerName: "",
  phoneNo: "",
  homeAddress: "",
  productName: "",
};

const getDealerAvatar = (index) =>
  DEALER_AVATARS[index % DEALER_AVATARS.length];

const ShowDealers = () => {
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("farmer_token");

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(DEALER_API);
      setDealers(res?.data?.data || []);
    } catch (err) {
      console.log("fetch dealers error:", err);
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${FARMER_API}/getPost`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (err) {
      console.log("fetch products error:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const filteredDealers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return dealers;

    return dealers.filter(
      (dealer) =>
        String(dealer?.name ?? "")
          .toLowerCase()
          .includes(query) ||
        String(dealer?.email ?? "")
          .toLowerCase()
          .includes(query),
    );
  }, [dealers, searchQuery]);

  const closeOrderModal = () => {
    setSelectedDealer(null);
    setOrderForm(EMPTY_ORDER);
    setSubmitting(false);
  };

  const openOrderModal = async (dealer) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please log in as a farmer to place an order.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    let farmerProducts = products;

    if (farmerProducts.length === 0) {
      farmerProducts = await fetchProducts();
      setProducts(farmerProducts);
    }

    if (farmerProducts.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No products",
        text: "Upload a product first, then place an order with a dealer.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    setSelectedDealer(dealer);
    setOrderForm({
      ...EMPTY_ORDER,
      productName: farmerProducts[0]?.product || "",
    });
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const { customerName, phoneNo, homeAddress, productName } = orderForm;

    if (!customerName.trim() || !phoneNo.trim() || !homeAddress.trim() || !productName) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please fill name, phone, address and select a product.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    if (!/^\d{10}$/.test(phoneNo.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid phone",
        text: "Enter a valid 10-digit phone number.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    try {
      setSubmitting(true);

      const dealerName = selectedDealer.name;

      await axios.post(
        `${ORDER_API}/place`,
        {
          customerName: customerName.trim(),
          phoneNo: phoneNo.trim(),
          homeAddress: homeAddress.trim(),
          productName,
          dealerName: selectedDealer.name,
          dealerEmail: selectedDealer.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      closeOrderModal();

      await Swal.fire({
        icon: "success",
        title: "Order placed!",
        html: `Order for <strong>${productName}</strong> sent to dealer <strong>${dealerName}</strong>`,
        timer: 2800,
        showConfirmButton: false,
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
    <section className="fshowdealers-page">
      <header className="fshowdealers-header">
        <h1 className="fshowdealers-title">Partner Dealers</h1>
        <p className="fshowdealers-subtitle">
          Place an order with dealer — name, phone, address &amp; product
        </p>
      </header>

      {!loading && dealers.length > 0 && (
        <div className="fshowdealers-search-wrap">
          <input
            type="search"
            className="fshowdealers-search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search dealers"
          />
          {searchQuery && (
            <button
              type="button"
              className="fshowdealers-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!loading && dealers.length > 0 && (
        <p className="fshowdealers-count">
          Showing {filteredDealers.length} of {dealers.length} dealers
        </p>
      )}

      {loading ? (
        <p className="fshowdealers-status">Loading dealers...</p>
      ) : dealers.length === 0 ? (
        <p className="fshowdealers-status">No dealers found</p>
      ) : filteredDealers.length === 0 ? (
        <p className="fshowdealers-status">
          No dealers match &quot;{searchQuery.trim()}&quot;
        </p>
      ) : (
        <div className="fshowdealers-grid">
          {filteredDealers.map((dealer, index) => (
            <article
              className="fshowdealers-card"
              key={dealer._id || dealer.email || index}
            >
              <div className="fshowdealers-img-ring">
                <img
                  src={getDealerAvatar(index)}
                  alt={dealer.name}
                  className="fshowdealers-img"
                  loading="lazy"
                />
              </div>

              <div className="fshowdealers-card-body">
                <h2 className="fshowdealers-name">{dealer.name}</h2>
                <p className="fshowdealers-email">
                  <span className="fshowdealers-label">Email</span>
                  {dealer.email}
                </p>

                <button
                  type="button"
                  className="fshowdealers-assign-btn"
                  onClick={() => openOrderModal(dealer)}
                >
                  Place Order
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedDealer && (
        <div
          className="fshowdealers-modal-overlay"
          onClick={closeOrderModal}
          role="presentation"
        >
          <div
            className="fshowdealers-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="fshowdealers-modal-title"
          >
            <button
              type="button"
              className="fshowdealers-modal-close"
              onClick={closeOrderModal}
              aria-label="Close order form"
            >
              ✕
            </button>

            <h2 id="fshowdealers-modal-title" className="fshowdealers-modal-title">
              Place Order
            </h2>
            <p className="fshowdealers-modal-dealer">
              Dealer: <strong>{selectedDealer.name}</strong>
            </p>

            <form className="fshowdealers-order-form" onSubmit={handlePlaceOrder}>
              <label className="fshowdealers-field">
                <span>Your Name</span>
                <input
                  type="text"
                  name="customerName"
                  value={orderForm.customerName}
                  onChange={handleOrderChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label className="fshowdealers-field">
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

              <label className="fshowdealers-field">
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

              <label className="fshowdealers-field">
                <span>Product Name</span>
                <select
                  name="productName"
                  value={orderForm.productName}
                  onChange={handleOrderChange}
                  required
                >
                  {products.map((item) => (
                    <option key={item._id || item.product} value={item.product}>
                      {item.product}
                    </option>
                  ))}
                </select>
              </label>

              <div className="fshowdealers-modal-actions">
                <button
                  type="button"
                  className="fshowdealers-cancel-btn"
                  onClick={closeOrderModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fshowdealers-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Placing..." : "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowDealers;
