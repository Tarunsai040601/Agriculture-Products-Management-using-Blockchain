import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./ShowItems.css";

const API_BASE = "http://localhost:8045/api/farmer";

const ShowItems = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("farmer_token");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/getPost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data) {
        setProducts([]);
        return;
      }

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.log("fetch products error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((item) => {
      const fields = [
        item.product,
        item.description,
        item.location,
        String(item.cost ?? ""),
      ];
      return fields.some((field) =>
        String(field ?? "").toLowerCase().includes(query),
      );
    });
  }, [products, searchQuery]);

  const handleUpdate = (item) => {
    navigate("/farmerDashboard/uploaditems", {
      state: {
        editItem: item,
        originalProduct: item.product,
      },
    });
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: `"${item.product}" will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.delete(`${API_BASE}/delete`, {
        params: { product: item.product },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.close();

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Product removed successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setProducts((prev) =>
        prev.filter((p) => p.product !== item.product),
      );
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error?.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  return (
    <div className="showitems-container">
      <h2 className="showitems-title">All Farmer Products</h2>

      {!loading && products.length > 0 && (
        <div className="showitems-search-wrap">
          <input
            type="search"
            className="showitems-search-input"
            placeholder="Search by name, description, location, or price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="showitems-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!loading && products.length > 0 && (
        <p className="showitems-count">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      {loading ? (
        <p className="showitems-status">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="showitems-status">No products found</p>
      ) : filteredProducts.length > 0 ? (
        <div className="showitems-grid">
          {filteredProducts.map((item) => (
            <div
              className="showitems-card"
              key={item._id || item.product}
            >
              <div className="showitems-img-wrap">
                <img
                  src={item.image}
                  alt={item.product}
                  className="showitems-img"
                  loading="lazy"
                />
              </div>

              <div className="showitems-card-body">
                <h3>{item.product}</h3>
                <p className="showitems-desc">{item.description}</p>
                <p className="showitems-meta">📍 {item.location}</p>
                <p className="showitems-price">💰 ₹{item.cost}</p>

                <div className="showitems-btn-group">
                  <button
                    type="button"
                    className="showitems-update-btn"
                    onClick={() => handleUpdate(item)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="showitems-delete-btn"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="showitems-status">
          No products match &quot;{searchQuery.trim()}&quot;
        </p>
      )}
    </div>
  );
};

export default ShowItems;
