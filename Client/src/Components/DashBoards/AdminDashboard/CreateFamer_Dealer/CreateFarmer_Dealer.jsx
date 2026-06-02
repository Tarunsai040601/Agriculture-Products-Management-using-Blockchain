import React, { useState } from "react";
import axios from "axios";
import "./CreateFarmer_Dealer.css";
import Swal from "sweetalert2";

const CreateFarmer_Dealer = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("dealer_token") ||
      localStorage.getItem("farmer_token") ||
      localStorage.getItem("customer_token")
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "Please login first",
          icon: "warning",
          confirmButtonColor: "#ff9800",
        });
        return;
      }

      const apiUrl =
        formData.role === "farmer"
          ? "https://agriculture-products-management-using-7laj.onrender.com/api/create/create-farmer"
          : "https://agriculture-products-management-using-7laj.onrender.com/api/dealer/post-dealer";

      await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await Swal.fire({
        title:
          formData.role === "farmer"
            ? "🌾 Farmer Created!"
            : "🏪 Dealer Created!",
        html: `
        <h3 style="color:#2e7d32">
          Account Created Successfully
        </h3>
        <p>
          ${formData.name} has been added successfully.
        </p>
      `,
        icon: "success",
        background: "#f1f8e9",
        confirmButtonColor: "#43a047",
        timer: 2500,
        timerProgressBar: true,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "farmer",
      });
    } catch (error) {
      console.log("FULL ERROR:", error);

      Swal.fire({
        title: "❌ Error",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong",
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="agriCreateSection">
      <div className="agriCreateContainer">
        <div className="agriImageSide">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200"
            alt="Agriculture field"
          />

          <div className="agriOverlay">
            <span className="agriBrandIcon" aria-hidden="true">
              🌾
            </span>
            <h1>Smart Agriculture</h1>
            <p>
              Create farmers and dealers to manage your agriculture ecosystem
              efficiently.
            </p>
            <ul className="agriFeatureList">
              <li>
                <span>👤</span>
                <span>Secure account onboarding</span>
              </li>
              <li>
                <span>🔗</span>
                <span>Blockchain-ready profiles</span>
              </li>
              <li>
                <span>📊</span>
                <span>Centralized admin control</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="agriFormSide">
          <form onSubmit={handleSubmit}>
            <div className="agriFormHeader">
              <h2>Create Account</h2>
              <p className="agriFormSubtitle">
                Add a new {formData.role === "farmer" ? "farmer" : "dealer"} to
                the platform
              </p>
            </div>

            <div className="agriRoleToggle" role="group" aria-label="Account type">
              <button
                type="button"
                className={`agriRoleBtn ${
                  formData.role === "farmer" ? "agriRoleActive" : ""
                }`}
                onClick={() => setRole("farmer")}
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                className={`agriRoleBtn ${
                  formData.role === "dealer" ? "agriRoleActive" : ""
                }`}
                onClick={() => setRole("dealer")}
              >
                🏪 Dealer
              </button>
            </div>

            <div className="agriField">
              <label className="agriFieldLabel" htmlFor="agri-name">
                Full name
              </label>
              <div className="agriFieldInner">
                <span className="agriFieldIcon" aria-hidden="true">
                  👤
                </span>
                <input
                  id="agri-name"
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="agriField">
              <label className="agriFieldLabel" htmlFor="agri-email">
                Email address
              </label>
              <div className="agriFieldInner">
                <span className="agriFieldIcon" aria-hidden="true">
                  ✉️
                </span>
                <input
                  id="agri-email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="agriField">
              <label className="agriFieldLabel" htmlFor="agri-password">
                Password
              </label>
              <div className="agriFieldInner agriPasswordWrap">
                <span className="agriFieldIcon" aria-hidden="true">
                  🔒
                </span>
                <input
                  id="agri-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="agriEyeBtn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="agriSubmitBtn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="agriSubmitSpinner" aria-hidden="true" />
                  Creating…
                </>
              ) : (
                <>🌱 Create {formData.role === "farmer" ? "Farmer" : "Dealer"}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateFarmer_Dealer;
