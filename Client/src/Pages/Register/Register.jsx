import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    setPasswordStrength({ score, checks });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordStrength.checks.uppercase)
      newErrors.password = "Password needs at least one uppercase letter";
    else if (!passwordStrength.checks.lowercase)
      newErrors.password = "Password needs at least one lowercase letter";
    else if (!passwordStrength.checks.number)
      newErrors.password = "Password needs at least one number";
    else if (!passwordStrength.checks.length)
      newErrors.password = "Password must be at least 8 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") checkPasswordStrength(value);
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
      const response = await fetch("http://localhost:8045/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["#e0e0e0", "#ef5350", "#ff9800", "#fdd835", "#66bb6a", "#2e7d32"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  return (
    <>
      {success && (
        <div className="success-overlay">
          <div className="success-icon">🌾</div>
          <div className="success-title">Welcome to AgroConnect!</div>
          <div className="success-sub">Your account has been created successfully.</div>
        </div>
      )}

      <div className="page-wrapper">
        {/* Floating leaf particles */}
        <span className="leaf">🌿</span>
        <span className="leaf">🍃</span>
        <span className="leaf">🌱</span>
        <span className="leaf">🌾</span>
        <span className="leaf">🍀</span>

        <div className="card">
          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="brand">
              <span className="brand-icon">🌾</span>
              <div className="brand-name">
                Agro
                <br />
                Connect
              </div>
              <div className="brand-tagline">Smart Farming Platform</div>
            </div>

            <div className="left-features">
              <div className="feature-item">
                <div className="feature-icon">🌡️</div>
                <div className="feature-text">
                  <strong>Crop Monitoring</strong>
                  <span>Real-time field analytics</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌧️</div>
                <div className="feature-text">
                  <strong>Weather Insights</strong>
                  <span>Hyperlocal forecasts</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📦</div>
                <div className="feature-text">
                  <strong>Market Access</strong>
                  <span>Connect directly to buyers</span>
                </div>
              </div>
            </div>

            <div className="left-bottom">
              <div className="login-prompt">
                Already have an account?
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  Sign in to continue your journey.
                </span>
              </div>
              <a href="/login" className="login-btn">
                ← Login
              </a>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">
            <div className="form-title">Create Account</div>
            <div className="form-subtitle">
              Join thousands of farmers on AgroConnect
            </div>

            <div className="field-group">
              {/* Name */}
              <div className="field-wrap">
                <label className="field-label">Full Name</label>
                <div className="field-inner">
                  <span className="field-icon">👤</span>
                  <input
                    className={`field-input${errors.name ? " error-input" : ""}`}
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <div className="error-msg">⚠ {errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="field-wrap">
                <label className="field-label">Email Address</label>
                <div className="field-inner">
                  <span className="field-icon">✉️</span>
                  <input
                    className={`field-input${errors.email ? " error-input" : ""}`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <div className="error-msg">⚠ {errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="field-inner">
                  <span className="field-icon">🔒</span>
                  <input
                    className={`field-input${errors.password ? " error-input" : ""}`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-msg">⚠ {errors.password}</div>
                )}

                {formData.password && (
                  <>
                    <div className="strength-bar-wrap">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="strength-segment"
                          style={{
                            background:
                              i <= passwordStrength.score
                                ? strengthColors[passwordStrength.score]
                                : "#e8f5e9",
                          }}
                        />
                      ))}
                      <span
                        className="strength-label"
                        style={{ color: strengthColors[passwordStrength.score] }}
                      >
                        {strengthLabels[passwordStrength.score]}
                      </span>
                    </div>
                    <div className="strength-checklist">
                      {[
                        ["length", "Min 8 chars"],
                        ["uppercase", "Uppercase (A-Z)"],
                        ["lowercase", "Lowercase (a-z)"],
                        ["number", "Number (0-9)"],
                      ].map(([key, label]) => (
                        <div
                          key={key}
                          className={`check-item${
                            passwordStrength.checks[key] ? " ok" : ""
                          }`}
                        >
                          <span className="check-dot" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Role */}
              <div className="field-wrap">
                <label className="field-label">Role</label>
                <div className="field-inner">
                  <span className="field-icon">🛡️</span>
                  <select
                    className="field-select disabled-select"
                    name="role"
                    value="admin"
                    disabled
                  >
                    <option value="admin">Admin</option>
                  </select>
                  <span className="role-badge">Default</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="btn-spinner" />
              ) : (
                <span>🌱 Register Now</span>
              )}
            </button>

            {apiError && <div className="api-error">⚠️ {apiError}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;