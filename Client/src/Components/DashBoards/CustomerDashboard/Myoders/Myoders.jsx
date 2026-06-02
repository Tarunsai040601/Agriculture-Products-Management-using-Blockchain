import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../../../hooks/useCustomerAuth";
import "./Myoders.css";

const ORDER_API = "https://agriculture-products-management-using-7laj.onrender.com/api/customer-order";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted by farmer",
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

const Myoders = () => {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useCustomerAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError("");

      const res = await axios.get(`${ORDER_API}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res?.data?.data || []);
    } catch (err) {
      console.log("fetch customer orders error:", err);
      setOrders([]);
      setFetchError(
        err?.response?.data?.message ||
          "Could not load your orders. Make sure you are logged in.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      setFetchError("");
      setSearchQuery("");
      setLoading(false);
    }
  }, [isLoggedIn]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) => {
      const fields = [
        order.productName,
        order.farmerName,
        order.orderStatus,
        STATUS_LABELS[order.orderStatus],
        String(order.quantity ?? ""),
      ];
      return fields.some((field) =>
        String(field ?? "").toLowerCase().includes(query),
      );
    });
  }, [orders, searchQuery]);

  if (!isLoggedIn && !loading) {
    return (
      <div className="myoders-page">
        <header className="myoders-header">
          <h1 className="myoders-title">My Orders</h1>
          <p className="myoders-subtitle">
            Sign in to see products you have ordered from farmers.
          </p>
        </header>
        <p className="myoders-status myoders-status--warn">
          Please{" "}
          <button
            type="button"
            className="myoders-login-link"
            onClick={() => navigate("/login")}
          >
            login
          </button>{" "}
          as a customer to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="myoders-page">
      <header className="myoders-header">
        <h1 className="myoders-title">My Orders</h1>
        <p className="myoders-subtitle">
          Products you ordered — track status from farmer to delivery.
        </p>
      </header>

      {!loading && orders.length > 0 && (
        <div className="myoders-search-wrap">
          <input
            type="search"
            className="myoders-search-input"
            placeholder="Search by product, farmer, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search orders"
          />
          {searchQuery && (
            <button
              type="button"
              className="myoders-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <p className="myoders-count">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      )}

      {fetchError && (
        <p className="myoders-status myoders-status--error">{fetchError}</p>
      )}

      {loading ? (
        <p className="myoders-status">Loading your orders...</p>
      ) : orders.length === 0 && !fetchError ? (
        <div className="myoders-empty">
          <p className="myoders-status">You have not placed any orders yet.</p>
          <Link to="/items" className="myoders-browse-btn">
            Browse farm products
          </Link>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="myoders-grid">
          {filteredOrders.map((order) => {
            const status = order.orderStatus || "pending";
            const statusClass = `myoders-badge myoders-badge--${status}`;

            return (
              <article className="myoders-card" key={order._id}>
                <div className="myoders-img-wrap">
                  {order.productImage ? (
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="myoders-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="myoders-img-placeholder">🌾</div>
                  )}
                </div>

                <div className="myoders-card-body">
                  <div className="myoders-card-top">
                    <h3>{order.productName}</h3>
                    <span className={statusClass}>
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>

                  <p className="myoders-qty">
                    Qty: <strong>{order.quantity} kg</strong>
                  </p>
                  {order.productCost != null && order.productCost !== "" && (
                    <p className="myoders-price">
                      ₹{order.productCost}
                      <span className="myoders-price-unit"> / unit</span>
                    </p>
                  )}
                  <p className="myoders-meta">
                    🧑‍🌾 {order.farmerName || "Farmer"}
                  </p>
                  <p className="myoders-meta">
                    📅 Ordered {formatDate(order.createdAt)}
                  </p>
                  <p className="myoders-address" title={order.homeAddress}>
                    📍 {order.homeAddress}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="myoders-status">
          No orders match &quot;{searchQuery.trim()}&quot;
        </p>
      )}
    </div>
  );
};

export default Myoders;
