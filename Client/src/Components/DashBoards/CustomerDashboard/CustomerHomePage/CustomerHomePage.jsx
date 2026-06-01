import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerHomePage.css";
import video from "../../../../assets/videos/video.mp4";

const highlights = [
  {
    title: "🛒 Shop Fresh Produce",
    desc: "Browse farm-fresh items listed by verified farmers and order directly from your dashboard.",
  },
  {
    title: "📦 Track Your Orders",
    desc: "Follow every step from farm pickup to dealer delivery with live status on My Orders.",
  },
  {
    title: "🔗 Blockchain Verified",
    desc: "Each product handoff is recorded on-chain so you know exactly where your food came from.",
  },
  {
    title: "🌱 Support Local Farms",
    desc: "Buy directly from growers and help build a transparent farm-to-table supply chain.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Browse items",
    desc: "Explore available crops and products from trusted farmers in your region.",
  },
  {
    step: "02",
    title: "Place order",
    desc: "Add items to your cart and confirm — farmers assign delivery to nearby dealers.",
  },
  {
    step: "03",
    title: "Track & receive",
    desc: "Watch status updates until your order reaches your doorstep.",
  },
];

const CustomerHomePage = () => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const customerName = localStorage.getItem("customer_name") || "Guest";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % highlights.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="customer-home">
      <section className="customer-hero">
        <video autoPlay muted loop playsInline className="customer-hero__video">
          <source src={video} type="video/mp4" />
        </video>

        <div className="customer-hero__overlay">
          <div className="customer-hero__content">
            <span className="customer-hero__badge">Customer Portal</span>
            <h1>
              Welcome, <span>{customerName}</span>
            </h1>
            <h2 className="customer-hero__slide-title">
              {highlights[currentHighlight].title}
            </h2>
            <p key={currentHighlight} className="customer-hero__slide-desc">
              {highlights[currentHighlight].desc}
            </p>
            <div className="customer-hero__actions">
              <Link to="/items" className="customer-hero__btn">
                Browse Items
              </Link>
              <a href="#customer-workflow" className="customer-hero__btn customer-hero__btn--outline">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="customer-about">
        <div className="customer-about__container">
          <div className="customer-about__content">
            <span className="customer-tag">Farm to Table</span>
            <h2>Fresh Agriculture, Delivered to You</h2>
            <p>
              AgriTech connects you directly with farmers and dealers on a
              blockchain-backed platform. Shop seasonal produce, track orders in
              real time, and trust every step from harvest to your home.
            </p>
            <div className="customer-features">
              <div className="customer-feature-card">🥬 Fresh from farm</div>
              <div className="customer-feature-card">📍 Order tracking</div>
              <div className="customer-feature-card">🔒 Verified origin</div>
              <div className="customer-feature-card">💚 Local growers</div>
            </div>
          </div>

          <div className="customer-about__image">
            <img
              src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg"
              alt="Fresh agricultural produce"
            />
          </div>
        </div>
      </section>

      <section className="customer-services" id="customer-workflow">
        <h2 className="customer-section-title">How Shopping Works</h2>
        <div className="customer-services__grid">
          {workflowSteps.map((item) => (
            <article key={item.step} className="customer-service-card">
              <span className="customer-service-card__step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="customer-gallery">
        <h2 className="customer-section-title">What You Can Buy</h2>
        <div className="customer-gallery__grid">
          <div className="customer-gallery__card">
            <img
              src="https://williamsonstraders.com/wp-content/uploads/2025/07/vegies.jpg"
              alt="Vegetables"
            />
            <h3>Vegetables</h3>
          </div>
          <div className="customer-gallery__card">
            <img
              src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg"
              alt="Grains"
            />
            <h3>Grains & Rice</h3>
          </div>
          <div className="customer-gallery__card">
            <img
              src="https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg"
              alt="Fruits"
            />
            <h3>Fruits</h3>
          </div>
          <div className="customer-gallery__card">
            <img
              src="https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg"
              alt="Organic produce"
            />
            <h3>Organic Produce</h3>
          </div>
        </div>
      </section>

      <section className="customer-stats">
        <div className="customer-stat-card">
          <h2>10K+</h2>
          <p>Happy customers</p>
        </div>
        <div className="customer-stat-card">
          <h2>50K+</h2>
          <p>Orders placed</p>
        </div>
        <div className="customer-stat-card">
          <h2>2K+</h2>
          <p>Partner farmers</p>
        </div>
        <div className="customer-stat-card">
          <h2>99%</h2>
          <p>Fresh delivery rate</p>
        </div>
      </section>

      <section className="customer-cta">
        <h2>Ready to order fresh produce?</h2>
        <p>
          Browse items from local farms or check My Orders to see where your
          delivery is right now.
        </p>
        <Link to="/items" className="customer-cta__btn">
          Shop Now
        </Link>
      </section>
    </div>
  );
};

export default CustomerHomePage;
