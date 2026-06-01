import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Tracking.css";

const ORDER_API = "http://localhost:8045/api/customer-order";

const TRACKING_STEPS = [
  {
    key: "pending",
    title: "Order placed",
    description: "Your order was sent to the farmer",
  },
  {
    key: "accepted",
    title: "Accepted by farmer",
    description: "Farmer confirmed and is preparing the product",
  },
  {
    key: "dealer_received",
    title: "At dealer",
    description: "Dealer received the product for delivery",
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Order reached your delivery address",
  },
];

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  dealer_received: "At dealer",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_HINTS = {
  pending: "Waiting for the farmer to accept your order.",
  accepted: "Farmer accepted — product is on the way to the dealer.",
  dealer_received: "Dealer has your order. Delivery to your address is in progress.",
  delivered: "Your order has been delivered. Thank you for shopping!",
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIndex = (status) =>
  TRACKING_STEPS.findIndex((step) => step.key === status);

const getStepClass = (orderStatus, stepIndex) => {
  if (orderStatus === "cancelled") return "";

  const currentIndex = getStatusIndex(orderStatus);
  if (currentIndex < 0) return "";

  if (stepIndex < currentIndex) return "tracking-step--done";
  if (stepIndex === currentIndex) {
    return orderStatus === "delivered"
      ? "tracking-step--done"
      : orderStatus === "pending"
        ? "tracking-step--waiting"
        : "tracking-step--active";
  }
  return "";
};

const OrderTimeline = ({ order }) => {
  const status = order.orderStatus || "pending";
  const hint = STATUS_HINTS[status];
  const hintClass =
    status === "delivered"
      ? "tracking-hint tracking-hint--success"
      : "tracking-hint";

  return (
    <>
      {hint && status !== "cancelled" && (
        <p className={hintClass}>{hint}</p>
      )}

      <ol className="tracking-timeline" aria-label="Order progress">
        {TRACKING_STEPS.map((step, index) => (
          <li
            key={step.key}
            className={`tracking-step ${getStepClass(status, index)}`}
          >
            <span className="tracking-step__dot" aria-hidden="true" />
            <div className="tracking-step__content">
              <strong>{step.title}</strong>
              <span>{step.description}</span>
            </div>
          </li>
        ))}
      </ol>

      {order.homeAddress && (
        <p className="tracking-address">
          <strong>Delivery address:</strong> {order.homeAddress}
        </p>
      )}
    </>
  );
};

const TrackingCard = ({ order, cancelled = false, style }) => {
  const status = order.orderStatus || "pending";

  return (
    <article
      className={`tracking-card tracking-card-enter ${cancelled ? "tracking-card--cancelled" : ""}`}
      style={style}
    >
      <div className="tracking-card__top">
        {order.productImage ? (
          <img
            src={order.productImage}
            alt={order.productName}
            className="tracking-card__img"
            loading="lazy"
          />
        ) : (
          <div
            className="tracking-card__img"
            style={{
              display: "grid",
              placeItems: "center",
              background: "#e8f5e9",
              fontSize: "1.75rem",
            }}
            aria-hidden="true"
          >
            🌾
          </div>
        )}

        <div className="tracking-card__info">
          <h3>{order.productName}</h3>
          <p className="tracking-card__meta">
            Qty: <strong>{order.quantity} kg</strong>
            {order.productCost != null && order.productCost !== "" && (
              <> · ₹{order.productCost}</>
            )}
          </p>
          <p className="tracking-card__farmer">
            Farmer: {order.farmerName || "—"}
          </p>
          <p className="tracking-card__date">
            Ordered {formatDate(order.createdAt)}
          </p>
        </div>

        <span className={`tracking-badge tracking-badge--${status}`}>
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      {!cancelled ? (
        <OrderTimeline order={order} />
      ) : (
        <p className="tracking-hint">
          This order was cancelled and is no longer being tracked.
        </p>
      )}
    </article>
  );
};

const Tracking = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("customer_token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

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
      console.log("fetch tracking orders error:", err);
      setOrders([]);
      setFetchError(
        err?.response?.data?.message ||
          "Could not load orders. Please log in and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const { activeOrders, cancelledOrders } = useMemo(() => {
    const active = [];
    const cancelled = [];

    orders.forEach((order) => {
      if (order.orderStatus === "cancelled") {
        cancelled.push(order);
      } else {
        active.push(order);
      }
    });

    return { activeOrders: active, cancelledOrders: cancelled };
  }, [orders]);

  if (!token && !loading) {
    return (
      <div className="tracking-page">
        <header className="tracking-hero tracking-fade-down">
          <h1>Track your orders</h1>
          <p>See live progress from farmer to your doorstep.</p>
          <button
            type="button"
            className="tracking-orders-link"
            onClick={() => navigate("/login")}
          >
            Login to track
          </button>
        </header>
        <div className="tracking-body">
          <div className="tracking-empty tracking-fade-up">
            <p>Please sign in as a customer to view order tracking.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <header className="tracking-hero tracking-fade-down">
        <h1>Track your orders</h1>
        <p>Live status from order placed to delivery at your address.</p>
        <Link to="/myorders" className="tracking-orders-link">
          View all orders
        </Link>
      </header>

      <div className="tracking-body">
        {fetchError && (
          <p className="tracking-hint" style={{ borderLeftColor: "#c62828" }}>
            {fetchError}
          </p>
        )}

        {loading ? (
          <div className="tracking-loading">
            <div className="tracking-spinner" aria-hidden="true" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 && !fetchError ? (
          <div className="tracking-empty tracking-fade-up">
            <p>You have no orders to track yet.</p>
            <Link to="/items" className="tracking-cta">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <section className="tracking-fade-up">
                <h2 className="tracking-section-title">
                  Active shipments ({activeOrders.length})
                </h2>
                {activeOrders.map((order, index) => (
                  <TrackingCard
                    key={order._id}
                    order={order}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  />
                ))}
              </section>
            )}

            {cancelledOrders.length > 0 && (
              <section
                className={`tracking-list--cancelled tracking-fade-up ${activeOrders.length === 0 ? "" : ""}`}
              >
                <h2 className="tracking-section-title">
                  Cancelled ({cancelledOrders.length})
                </h2>
                {cancelledOrders.map((order, index) => (
                  <TrackingCard
                    key={order._id}
                    order={order}
                    cancelled
                    style={{ animationDelay: `${index * 0.08}s` }}
                  />
                ))}
              </section>
            )}

            {activeOrders.length === 0 &&
              cancelledOrders.length > 0 &&
              !fetchError && (
                <p className="tracking-section-title">
                  No active orders — only cancelled orders below.
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tracking;
