import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Show_Farmers.css";

const Show_Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================
  // GET TOKEN
  // =========================================

  const token = localStorage.getItem("admin_token");

  // =========================================
  // FETCH FARMERS
  // =========================================

  const fetchFarmers = async () => {
    try {
      if (!token) {
        console.log("Admin Token Not Found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:8045/api/create/get-Farmer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Farmers Response:", response.data);

      setFarmers(response?.data?.data || []);
    } catch (error) {
      console.log(
        "Fetch Farmers Error:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      farmer?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // =========================================
  // DELETE FARMER
  // =========================================

  const deleteFarmer = async (name) => {
    const confirmDelete = window.confirm(
      `Delete ${name}?`
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:8045/api/create/delete-farmer?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Delete Response:",
        response.data
      );

      setFarmers((prev) =>
        prev.filter(
          (farmer) => farmer.name !== name
        )
      );

      alert("Farmer Deleted Successfully");
    } catch (error) {
      console.log(
        "Delete Error:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  return (
    <section className="showFarmerSection">
      {/* HEADING */}

      <div className="showFarmerHeading">
        <h1>🌾 Farmers List</h1>
      </div>

      {/* SEARCH BAR */}

      <div className="showFarmerSearchWrapper">
        <input
          type="text"
          placeholder="🔍 Search Farmer by Name or Email..."
          className="showFarmerSearchInput"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="showFarmerLoader">
          Loading Farmers...
        </div>
      ) : filteredFarmers.length === 0 ? (
        <div className="showFarmerEmpty">
          No Farmers Found
        </div>
      ) : (
        <div className="showFarmerContainer">
          {filteredFarmers.map(
            (item, index) => (
              <div
                className="showFarmerCard"
                key={index}
              >
                {/* IMAGE */}

                <div className="showFarmerImageWrapper">
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

                <span className="showFarmerRole">
                  {item.role}
                </span>

                {/* DELETE BUTTON */}

                <button
                  className="showFarmerDeleteBtn"
                  onClick={() =>
                    deleteFarmer(item.name)
                  }
                >
                  🗑 Delete Farmer
                </button>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Show_Farmers;