import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import "./Login.css";

const Login = () => {
  // ======================================================
  // NAVIGATE
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // ======================================================
  // VALIDATIONS
  // ======================================================

  const validate = () => {
    const newErrors = {};

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setApiError("");
  };

  // ======================================================
  // HANDLE LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation check
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    setLoading(true);

    setApiError("");

    try {
      // ======================================================
      // API CALL
      // ======================================================

      const response = await axios.post(
        "http://localhost:8045/api/auth/login",
        formData,
      );

      console.log("login response:", response.data);

      // ======================================================
      // TOKEN
      // ======================================================

      const token = response.data.token;

      // ======================================================
      // DECODE TOKEN
      // ======================================================

      const decoded = jwtDecode(token);

      console.log("decoded user:", decoded);

      /*
        Expected Decoded Data

        {
          id:"123",
          name:"Tarunsai",
          role:"admin"
        }
      */

      // ======================================================
      // ADMIN LOGIN
      // ======================================================

      if (decoded.role === "admin") {
        localStorage.setItem("admin_token", token);

        localStorage.setItem("admin_name", decoded.name);

        setSuccess(true);

        setTimeout(() => {
          navigate("/adminDashboard");
        }, 1500);
      }

      // ======================================================
      // FARMER LOGIN
      // ======================================================
      else if (decoded.role === "farmer") {
        localStorage.setItem("farmer_token", token);

        localStorage.setItem("farmer_name", decoded.name);

        setSuccess(true);

        setTimeout(() => {
          navigate("/farmerDashboard");
        }, 1500);
      }

      // ======================================================
      // DEALER LOGIN
      // ======================================================
      else if (decoded.role === "dealer") {
        localStorage.setItem("dealer_token", token);

        localStorage.setItem("dealer_name", decoded.name);

        setSuccess(true);

        setTimeout(() => {
          navigate("/dealerDashboard");
        }, 1500);
      }

      // ======================================================
      // CUSTOMER LOGIN
      // ======================================================
      else if (decoded.role === "customer") {
        localStorage.setItem("customer_token", token);

        localStorage.setItem("customer_name", decoded.name);

        setSuccess(true);

        setTimeout(() => {
          navigate("/customerDashboard");
        }, 1500);
      }

      // ======================================================
      // INVALID ROLE
      // ======================================================
      else {
        throw new Error("Invalid role found");
      }
    } catch (err) {
      console.log("login error:", err.response?.data || err.message);

      setApiError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== SUCCESS MESSAGE ===== */}

      {success && (
        <div className="ln-success-overlay">
          <div className="ln-success-icon">🌾</div>

          <div className="ln-success-title">Welcome Back!</div>

          <div className="ln-success-sub">You have logged in successfully.</div>
        </div>
      )}

      {/* ===== MAIN PAGE ===== */}

      <div className="ln-page-wrapper">
        {/* ===== FLOATING LEAVES ===== */}

        <span className="ln-leaf">🌿</span>

        <span className="ln-leaf">🍃</span>

        <span className="ln-leaf">🌱</span>

        <span className="ln-leaf">🌾</span>

        <span className="ln-leaf">🍀</span>

        {/* ===== CARD ===== */}

        <div className="ln-card">
          {/* ================= LEFT PANEL ================= */}

          <div className="ln-left-panel">
            {/* BRAND */}

            <div className="ln-brand">
              <span className="ln-brand-icon">🌾</span>

              <div className="ln-brand-name">
                Agro
                <br />
                Connect
              </div>

              <div className="ln-brand-tagline">Smart Farming Platform</div>
            </div>

            {/* FEATURES */}

            <div className="ln-left-features">
              <div className="ln-feature-item">
                <div className="ln-feature-icon">🌡️</div>

                <div className="ln-feature-text">
                  <strong>Crop Monitoring</strong>

                  <span>Real-time field analytics</span>
                </div>
              </div>

              <div className="ln-feature-item">
                <div className="ln-feature-icon">🌧️</div>

                <div className="ln-feature-text">
                  <strong>Weather Insights</strong>

                  <span>Hyperlocal forecasts</span>
                </div>
              </div>

              <div className="ln-feature-item">
                <div className="ln-feature-icon">📦</div>

                <div className="ln-feature-text">
                  <strong>Market Access</strong>

                  <span>Connect directly to buyers</span>
                </div>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="ln-left-bottom">
              <div className="ln-register-prompt">
                Don't have an account?
                <br />
                <span
                  style={{
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Join thousands of farmers today.
                </span>
              </div>

              <a href="/register" className="ln-register-btn">
                Register →
              </a>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="ln-right-panel">
            <div className="ln-form-title">Welcome Back!</div>

            <div className="ln-form-subtitle">
              Sign in to your AgroConnect account
            </div>

            <div className="ln-field-group">
              {/* ===== EMAIL ===== */}

              <div className="ln-field-wrap">
                <label className="ln-field-label">Email Address</label>

                <div className="ln-field-inner">
                  <span className="ln-field-icon">✉️</span>

                  <input
                    className={`ln-field-input ${
                      errors.email ? "ln-error-input" : ""
                    }`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <div className="ln-error-msg">⚠ {errors.email}</div>
                )}
              </div>

              {/* ===== PASSWORD ===== */}

              <div className="ln-field-wrap">
                <div className="ln-label-row">
                  <label className="ln-field-label">Password</label>
                </div>

                <div className="ln-field-inner">
                  <span className="ln-field-icon">🔒</span>

                  <input
                    className={`ln-field-input ${
                      errors.password ? "ln-error-input" : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="ln-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.password && (
                  <div className="ln-error-msg">⚠ {errors.password}</div>
                )}
              </div>
            </div>

            {/* ===== LOGIN BUTTON ===== */}

            <button
              className="ln-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="ln-btn-spinner"></div>
              ) : (
                <span>🌱 Login</span>
              )}
            </button>

            {/* ===== API ERROR ===== */}

            {apiError && <div className="ln-api-error">⚠️ {apiError}</div>}

            {/* ===== REGISTER ===== */}

            <div className="ln-register-hint">
              Don't have an account?{" "}
              <a href="/register" className="ln-register-link">
                Please Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
