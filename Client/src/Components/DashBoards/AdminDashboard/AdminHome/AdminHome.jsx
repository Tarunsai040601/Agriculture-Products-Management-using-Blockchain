import React from "react";
import "./AdminHome.css";

const AdminHome = () => {
  return (
    <div className="admin-home-wrapper">
      {/* Hero Section */}
      <section className="agri-hero-section">
        <div className="agri-hero-content">
          <span className="agri-badge">🌱 Smart Agriculture Platform</span>

          <h1>
            AGRICULTURE
            <span> MANAGEMENT SYSTEM</span>
          </h1>

          <p>
            Empowering farmers, dealers and customers with modern technology.
            Manage crops, track orders, monitor farming activities and improve
            productivity through our smart agriculture ecosystem.
          </p>

          {/* <div className="agri-btn-group">
            <button className="agri-primary-btn">Explore More</button>

            <button className="agri-secondary-btn">Get Started</button>
          </div> */}
        </div>

        <div className="agri-hero-image">
          <div className="agri-image-box">
            <img
              src="https://eu-images.contentstack.com/v3/assets/bltdd43779342bd9107/blt724b11191f3c74c2/68309a662f7844290392a419/0526H1-5613A-1800x1012.jpg?width=1280&auto=webp&quality=80&disable=upscale"
              alt="farmer"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}

      <section className="agri-stats-section">
        <div className="agri-stat-card">
          <h2>5K+</h2>
          <p>Farmers</p>
        </div>

        <div className="agri-stat-card">
          <h2>10K+</h2>
          <p>Products</p>
        </div>

        <div className="agri-stat-card">
          <h2>150+</h2>
          <p>Dealers</p>
        </div>

        <div className="agri-stat-card">
          <h2>20K+</h2>
          <p>Customers</p>
        </div>
      </section>

      {/* Features */}

      <section className="agri-feature-section">
        <div className="agri-heading">
          <h2>Why Choose Our Platform ?</h2>
          <p>Modern digital agriculture solutions designed for everyone.</p>
        </div>

        <div className="agri-feature-grid">
          <div className="agri-feature-card">
            <div className="icon">🌾</div>
            <h3>Crop Management</h3>
            <p>Monitor and manage agricultural products efficiently.</p>
          </div>

          <div className="agri-feature-card">
            <div className="icon">🚜</div>
            <h3>Farmer Dashboard</h3>
            <p>Farmers can add and manage products easily.</p>
          </div>

          <div className="agri-feature-card">
            <div className="icon">📊</div>
            <h3>Analytics</h3>
            <p>View reports, sales trends and farming insights.</p>
          </div>

          <div className="agri-feature-card">
            <div className="icon">🌍</div>
            <h3>Global Reach</h3>
            <p>Connect farmers directly with customers and dealers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
