import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./MyJob.css";

const ORDER_API = "http://localhost:8045/api/dealer-order";

const TABS = [
  { id: "pending", label: "Assigned" },
  { id: "received", label: "Received" },
  { id: "completed", label: "Completed" },
];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MyJob = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const token = localStorage.getItem("dealer_token");

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${ORDER_API}/dealer-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res?.data?.data || []);
    } catch (err) {
      console.log("fetch dealer orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const status = order.orderStatus || "pending";
        if (acc[status] !== undefined) acc[status] += 1;
        return acc;
      },
      { pending: 0, received: 0, completed: 0 },
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if ((order.orderStatus || "pending") !== activeTab) return false;
      if (!query) return true;

      const haystack = [
        order.productName,
        order.customerName,
        order.phoneNo,
        order.homeAddress,
        order.farmerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [orders, activeTab, searchQuery]);

  const updateStatus = async (orderId, orderStatus) => {
    const isReceived = orderStatus === "received";
    const result = await Swal.fire({
      title: isReceived ? "Confirm pickup?" : "Mark delivery complete?",
      text: isReceived
        ? "This order will move to Received — customer tracking updates."
        : "Customer will be notified that the order is completed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: isReceived ? "#1565c0" : "#2e7d32",
      cancelButtonColor: "#757575",
      confirmButtonText: isReceived ? "Yes, received" : "Yes, completed",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingId(orderId);
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/status`,
        { orderStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? res.data.data : order,
        ),
      );

      if (orderStatus === "received") setActiveTab("received");
      if (orderStatus === "completed") setActiveTab("completed");

      await Swal.fire({
        title: isReceived ? "Marked as received" : "Order completed",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        title: "Update failed",
        text: err.response?.data?.message || "Could not update order status",
        icon: "error",
        confirmButtonColor: "#2e7d32",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderActions = (order) => {
    const status = order.orderStatus || "pending";
    const busy = updatingId === order._id;

    if (status === "pending") {
      return (
        <button
          type="button"
          className="dealer-myjob__btn dealer-myjob__btn--received"
          disabled={busy}
          onClick={() => updateStatus(order._id, "received")}
        >
          {busy ? "Updating..." : "Mark as Received"}
        </button>
      );
    }

    if (status === "received") {
      return (
        <button
          type="button"
          className="dealer-myjob__btn dealer-myjob__btn--completed"
          disabled={busy}
          onClick={() => updateStatus(order._id, "completed")}
        >
          {busy ? "Updating..." : "Mark as Completed"}
        </button>
      );
    }

    return <p className="dealer-myjob__done">Delivery completed</p>;
  };

  return (
    <section className="dealer-myjob">
      <header className="dealer-myjob__header">
        <h1>My Assigned Tasks</h1>
        <p>
          Farmer-assigned customer orders. Confirm when stock arrives, then mark
          delivery complete.
        </p>
      </header>

      <div className="dealer-myjob__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`dealer-myjob__tab${
              activeTab === tab.id ? " dealer-myjob__tab--active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="dealer-myjob__tab-count">{counts[tab.id]}</span>
          </button>
        ))}
      </div>

      <div className="dealer-myjob__search-wrap">
        <input
          type="search"
          className="dealer-myjob__search"
          placeholder="Search product, customer, farmer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search assigned tasks"
        />
      </div>

      {!token ? (
        <p className="dealer-myjob__status dealer-myjob__status--warn">
          Please log in as a dealer to view assigned tasks.
        </p>
      ) : loading ? (
        <p className="dealer-myjob__status">Loading assigned tasks...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="dealer-myjob__status">
          {orders.length === 0
            ? "No tasks assigned yet. Farmers will assign orders from Partner Dealers."
            : `No ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} tasks${
                searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""
              }.`}
        </p>
      ) : (
        <div className="dealer-myjob__grid">
          {filteredOrders.map((order) => {
            const status = order.orderStatus || "pending";
            return (
              <article className="dealer-myjob__card" key={order._id}>
                <div className="dealer-myjob__card-top">
                  <h2>{order.productName}</h2>
                  <span
                    className={`dealer-myjob__badge dealer-myjob__badge--${status}`}
                  >
                    {status}
                  </span>
                </div>

                <ul className="dealer-myjob__details">
                  <li>
                    <span>Customer</span>
                    <strong>{order.customerName}</strong>
                  </li>
                  <li>
                    <span>Phone</span>
                    <strong>{order.phoneNo}</strong>
                  </li>
                  <li>
                    <span>Address</span>
                    <strong>{order.homeAddress}</strong>
                  </li>
                  <li>
                    <span>Farmer</span>
                    <strong>{order.farmerName}</strong>
                  </li>
                  <li>
                    <span>Assigned on</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </li>
                </ul>

                <div className="dealer-myjob__actions">{renderActions(order)}</div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyJob;
