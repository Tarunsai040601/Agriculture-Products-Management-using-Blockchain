import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const ORDER_API = "http://localhost:8045/api/customer-order";
const DEALER_API = "http://localhost:8045/api/dealer/getDealers";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  assigned_to_dealer: "Assigned to dealer",
  dealer_received: "At dealer",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Orders = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("farmer_token");

  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDealerId, setSelectedDealerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError("");

      const res = await axios.get(`${ORDER_API}/farmer-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res?.data?.data || []);
    } catch (err) {
      console.log("fetch farmer orders error:", err);
      setOrders([]);
      setFetchError(
        err?.response?.data?.message ||
          "Could not load customer orders. Please log in as a farmer.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDealers = useCallback(async () => {
    try {
      const res = await axios.get(DEALER_API);
      setDealers(res?.data?.data || []);
    } catch (err) {
      console.log("fetch dealers error:", err);
      setDealers([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchDealers();
  }, [fetchOrders, fetchDealers]);

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const status = order.orderStatus || "pending";
        if (acc[status] !== undefined) acc[status] += 1;
        return acc;
      },
      {
        pending: 0,
        assigned_to_dealer: 0,
        dealer_received: 0,
        delivered: 0,
      },
    );
  }, [orders]);

  const TABS = [
    { id: "pending", label: "Pending", count: counts.pending },
    {
      id: "assigned_to_dealer",
      label: "Assigned",
      count: counts.assigned_to_dealer,
    },
    { id: "dealer_received", label: "At dealer", count: counts.dealer_received },
    { id: "delivered", label: "Delivered", count: counts.delivered },
  ];

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const status = order.orderStatus || "pending";
      if (status !== activeTab) return false;
      if (!query) return true;

      const haystack = [
        order.productName,
        order.customerName,
        order.phoneNo,
        order.homeAddress,
        order.dealerName,
        STATUS_LABELS[status],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [orders, activeTab, searchQuery]);

  const closeAssignModal = () => {
    setSelectedOrder(null);
    setSelectedDealerId("");
    setAssigning(false);
  };

  const openAssignModal = (order) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please log in as a farmer to manage orders.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    if (dealers.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No dealers",
        text: "No dealers are available to assign this order.",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    setSelectedOrder(order);
    setSelectedDealerId(dealers[0]?._id || dealers[0]?.email || "");
  };

  const handleAcceptAndAssign = async (e) => {
    e.preventDefault();

    if (!selectedOrder || !selectedDealerId) return;

    const dealer = dealers.find(
      (d) =>
        String(d._id) === String(selectedDealerId) ||
        d.email === selectedDealerId,
    );

    if (!dealer) {
      Swal.fire({
        icon: "warning",
        title: "Select a dealer",
        confirmButtonColor: "#1565c0",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Accept & assign order?",
      html: `Assign <strong>${selectedOrder.productName}</strong> to dealer <strong>${dealer.name}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1565c0",
      cancelButtonColor: "#757575",
      confirmButtonText: "Yes, assign",
    });

    if (!result.isConfirmed) return;

    try {
      setAssigning(true);

      await axios.patch(
        `${ORDER_API}/assign-dealer/${selectedOrder._id}`,
        {
          dealerName: dealer.name,
          dealerEmail: dealer.email,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      closeAssignModal();
      await fetchOrders();

      await Swal.fire({
        icon: "success",
        title: "Order assigned!",
        html: `Status updated to <strong>Assigned to dealer</strong> — ${dealer.name}`,
        timer: 2600,
        showConfirmButton: false,
      });
    } catch (error) {
      setAssigning(false);
      Swal.fire({
        icon: "error",
        title: "Assignment failed",
        text: error?.response?.data?.message || "Could not assign order",
        confirmButtonColor: "#c62828",
      });
    }
  };

  if (!token && !loading) {
    return (
      <section className="forders-page">
        <header className="forders-header">
          <h1 className="forders-title">Customer Orders</h1>
          <p className="forders-subtitle">
            Accept customer orders and assign them to a dealer for delivery.
          </p>
        </header>
        <p className="forders-status forders-status--warn">
          Please{" "}
          <button
            type="button"
            className="forders-login-link"
            onClick={() => navigate("/login")}
          >
            login
          </button>{" "}
          as a farmer to manage orders.
        </p>
      </section>
    );
  }

  return (
    <section className="forders-page">
      <header className="forders-header">
        <h1 className="forders-title">Customer Orders</h1>
        <p className="forders-subtitle">
          Accept pending orders and assign products to a dealer — status becomes
          &quot;Assigned to dealer&quot;.
        </p>
      </header>

      <div className="forders-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`forders-tab${activeTab === tab.id ? " forders-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="forders-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {!loading && orders.length > 0 && (
        <div className="forders-search-wrap">
          <input
            type="search"
            className="forders-search"
            placeholder="Search by product, customer, dealer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search orders"
          />
          {searchQuery && (
            <button
              type="button"
              className="forders-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {fetchError && (
        <p className="forders-status forders-status--error">{fetchError}</p>
      )}

      {loading ? (
        <p className="forders-status">Loading customer orders...</p>
      ) : orders.length === 0 && !fetchError ? (
        <p className="forders-status">No customer orders yet.</p>
      ) : filteredOrders.length > 0 ? (
        <div className="forders-grid">
          {filteredOrders.map((order) => {
            const status = order.orderStatus || "pending";
            const statusClass = `forders-badge forders-badge--${status}`;

            return (
              <article className="forders-card" key={order._id}>
                <div className="forders-img-wrap">
                  {order.productImage ? (
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="forders-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="forders-img-placeholder">🌾</div>
                  )}
                </div>

                <div className="forders-card-body">
                  <div className="forders-card-top">
                    <h3>{order.productName}</h3>
                    <span className={statusClass}>
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>

                  <p className="forders-meta">
                    Qty: <strong>{order.quantity} kg</strong>
                  </p>
                  <p className="forders-meta">
                    👤 {order.customerName}
                  </p>
                  <p className="forders-meta">📞 {order.phoneNo}</p>
                  <p className="forders-address" title={order.homeAddress}>
                    📍 {order.homeAddress}
                  </p>
                  {order.dealerName && (
                    <p className="forders-dealer">
                      🚚 Dealer: <strong>{order.dealerName}</strong>
                    </p>
                  )}
                  <p className="forders-date">
                    📅 {formatDate(order.createdAt)}
                  </p>

                  {status === "pending" && (
                    <button
                      type="button"
                      className="forders-assign-btn"
                      onClick={() => openAssignModal(order)}
                    >
                      Accept &amp; Assign Dealer
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="forders-status">
          No {STATUS_LABELS[activeTab]?.toLowerCase() || activeTab} orders
          {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""}.
        </p>
      )}

      {selectedOrder && (
        <div
          className="forders-modal-overlay"
          onClick={closeAssignModal}
          role="presentation"
        >
          <div
            className="forders-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="forders-modal-title"
          >
            <button
              type="button"
              className="forders-modal-close"
              onClick={closeAssignModal}
              aria-label="Close"
            >
              ✕
            </button>

            <h2 id="forders-modal-title" className="forders-modal-title">
              Accept &amp; Assign to Dealer
            </h2>
            <p className="forders-modal-product">
              Product: <strong>{selectedOrder.productName}</strong>
            </p>
            <p className="forders-modal-customer">
              Customer: <strong>{selectedOrder.customerName}</strong>
            </p>

            <form className="forders-assign-form" onSubmit={handleAcceptAndAssign}>
              <label className="forders-field">
                <span>Select dealer</span>
                <select
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  required
                >
                  {dealers.map((dealer) => (
                    <option
                      key={dealer._id || dealer.email}
                      value={dealer._id || dealer.email}
                    >
                      {dealer.name} — {dealer.email}
                    </option>
                  ))}
                </select>
              </label>

              <div className="forders-modal-actions">
                <button
                  type="button"
                  className="forders-cancel-btn"
                  onClick={closeAssignModal}
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="forders-submit-btn"
                  disabled={assigning}
                >
                  {assigning ? "Assigning..." : "Confirm assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
