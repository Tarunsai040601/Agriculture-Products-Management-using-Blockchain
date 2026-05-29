import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("http://localhost:8045/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="ln-success-overlay">
          <div className="ln-success-icon">🌾</div>
          <div className="ln-success-title">Welcome Back!</div>
          <div className="ln-success-sub">You have logged in successfully.</div>
        </div>
      )}

      <div className="ln-page-wrapper">
        {/* Floating leaf particles */}
        <span className="ln-leaf">🌿</span>
        <span className="ln-leaf">🍃</span>
        <span className="ln-leaf">🌱</span>
        <span className="ln-leaf">🌾</span>
        <span className="ln-leaf">🍀</span>

        <div className="ln-card">
          {/* ── LEFT PANEL ── */}
          <div className="ln-left-panel">
            <div className="ln-brand">
              <span className="ln-brand-icon">🌾</span>
              <div className="ln-brand-name">
                Agro
                <br />
                Connect
              </div>
              <div className="ln-brand-tagline">Smart Farming Platform</div>
            </div>

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

            <div className="ln-left-bottom">
              <div className="ln-register-prompt">
                Don't have an account?
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  Join thousands of farmers today.
                </span>
              </div>
              <a href="/register" className="ln-register-btn">
                Register →
              </a>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="ln-right-panel">
            <div className="ln-form-title">Welcome Back!</div>
            <div className="ln-form-subtitle">
              Sign in to your AgroConnect account
            </div>

            <div className="ln-field-group">
              {/* Email */}
              <div className="ln-field-wrap">
                <label className="ln-field-label">Email Address</label>
                <div className="ln-field-inner">
                  <span className="ln-field-icon">✉️</span>
                  <input
                    className={`ln-field-input${errors.email ? " ln-error-input" : ""}`}
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

              {/* Password */}
              <div className="ln-field-wrap">
                <div className="ln-label-row">
                  <label className="ln-field-label">Password</label>
                  <a href="/forgot-password" className="ln-forgot-link">
                    Forgot password?
                  </a>
                </div>
                <div className="ln-field-inner">
                  <span className="ln-field-icon">🔒</span>
                  <input
                    className={`ln-field-input${errors.password ? " ln-error-input" : ""}`}
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
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <div className="ln-error-msg">⚠ {errors.password}</div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              className="ln-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="ln-btn-spinner" />
              ) : (
                <span>🌱 Login</span>
              )}
            </button>

            {apiError && <div className="ln-api-error">⚠️ {apiError}</div>}

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