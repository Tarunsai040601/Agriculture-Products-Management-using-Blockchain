import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Show_Dealers.css";

const Show_Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("admin_token");

  // =========================================
  // FETCH DEALERS
  // =========================================

  const fetchDealers = async () => {
    try {
      if (!token) {
        console.log("Admin Token Not Found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://agriculture-products-management-using-7laj.onrender.com/api/dealer/get-dealer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dealers Response:", response.data);

      setDealers(response?.data?.data || []);
    } catch (error) {
      console.log(
        "Fetch Dealers Error:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredDealers = dealers.filter(
    (dealer) =>
      dealer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dealer?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // =========================================
  // DELETE DEALER
  // =========================================

  const deleteDealer = async (name) => {
    const result = await Swal.fire({
      title: "🗑 Delete Dealer?",
      text: `${name} will be removed permanently`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef6c00",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `https://agriculture-products-management-using-7laj.onrender.com/api/dealer/delete-dealer?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDealers((prev) =>
        prev.filter(
          (dealer) => dealer.name !== name
        )
      );

      Swal.fire({
        title: "✅ Deleted!",
        text: `${name} deleted successfully`,
        icon: "success",
        confirmButtonColor: "#ef6c00",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "❌ Error",
        text:
          error?.response?.data?.message ||
          "Delete Failed",
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  return (
    <section className="showDealerSection">
      {/* HEADING */}

      <div className="showDealerHeading">
        <h1>🏪 Dealers List</h1>
      </div>

      {/* SEARCH */}

      <div className="showDealerSearchWrapper">
        <input
          type="text"
          className="showDealerSearchInput"
          placeholder="🔍 Search Dealer by Name or Email..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="showDealerLoader">
          Loading Dealers...
        </div>
      ) : filteredDealers.length === 0 ? (
        <div className="showDealerEmpty">
          No Dealers Found
        </div>
      ) : (
        <div className="showDealerContainer">
          {filteredDealers.map(
            (item, index) => (
              <div
                className="showDealerCard"
                key={index}
              >
                {/* IMAGE */}

                <div className="showDealerImageWrapper">
                  <img
                    src={`https://ui-avatars.com/api/?name=${item.name}&background=4CAF50&color=fff&size=200`}
                    alt={item.name}
                  />
                </div>

                {/* NAME */}

                <h2>{item.name}</h2>

                {/* EMAIL */}

                <p>
                  <strong>Email:</strong>{" "}
                  {item.email}
                </p>

                {/* ROLE */}

                <span className="showDealerRole">
                  {item.role}
                </span>

                {/* DELETE BUTTON */}

                <button
                  className="showDealerDeleteBtn"
                  onClick={() =>
                    deleteDealer(item.name)
                  }
                >
                  🗑 Delete Dealer
                </button>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Show_Dealers;