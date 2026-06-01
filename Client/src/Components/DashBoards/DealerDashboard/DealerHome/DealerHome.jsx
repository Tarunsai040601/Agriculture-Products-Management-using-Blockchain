import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DealerHome.css";
import video from "../../../../assets/videos/video_01.mp4";

const highlights = [
  {
    title: "📦 Receive Farm Products",
    desc: "Get assigned orders from farmers and confirm when stock arrives at your hub.",
  },
  {
    title: "🚚 Manage Deliveries",
    desc: "Track every assignment from pickup to customer doorstep with clear status updates.",
  },
  {
    title: "📱 Notify Customers",
    desc: "Mark orders complete and send WhatsApp updates so buyers know delivery is on the way.",
  },
  {
    title: "🔗 Blockchain Traceability",
    desc: "Every handoff is recorded so customers can trust product origin and handling.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Assignment",
    desc: "Farmers assign customer orders to you when products are ready for distribution.",
  },
  {
    step: "02",
    title: "Dealer received",
    desc: "Confirm pickup in My Jobs — customers see live tracking on their dashboard.",
  },
  {
    step: "03",
    title: "Order completed",
    desc: "Finish delivery and notify the customer that their order arrives by end of today.",
  },
];

const DealerHome = () => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const dealerName = localStorage.getItem("dealer_name") || "Dealer";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % highlights.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dealer-home">
      <section className="dealer-hero">
        <video autoPlay muted loop playsInline className="dealer-hero__video">
          <source src={video} type="video/mp4" />
        </video>

        <div className="dealer-hero__overlay">
          <div className="dealer-hero__content">
            <span className="dealer-hero__badge">Dealer Portal</span>
            <h1>
              Welcome back, <span>{dealerName}</span>
            </h1>
            <h2 className="dealer-hero__slide-title">
              {highlights[currentHighlight].title}
            </h2>
            <p key={currentHighlight} className="dealer-hero__slide-desc">
              {highlights[currentHighlight].desc}
            </p>
            <div className="dealer-hero__actions">
              <Link to="/dealerDashboard/myjob" className="dealer-hero__btn">
                View My Jobs
              </Link>
              <a href="#dealer-workflow" className="dealer-hero__btn dealer-hero__btn--outline">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="dealer-about">
        <div className="dealer-about__container">
          <div className="dealer-about__content">
            <span className="dealer-tag">Supply Chain Partner</span>
            <h2>Connecting Farms to Customers</h2>
            <p>
              As a dealer on our blockchain agriculture platform, you are the
              vital link between farmers and end customers. Manage pickups,
              update order status in real time, and keep the supply chain
              transparent from farm to doorstep.
            </p>
            <div className="dealer-features">
              <div className="dealer-feature-card">✅ Confirm pickups</div>
              <div className="dealer-feature-card">📍 Live order tracking</div>
              <div className="dealer-feature-card">💬 WhatsApp alerts</div>
              <div className="dealer-feature-card">🔒 Verified records</div>
            </div>
          </div>

          <div className="dealer-about__image">
            <img
              src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg"
              alt="Dealer managing agricultural logistics"
            />
          </div>
        </div>
      </section>

      <section className="dealer-services" id="dealer-workflow">
        <h2 className="dealer-section-title">Your Workflow</h2>
        <div className="dealer-services__grid">
          {workflowSteps.map((item) => (
            <article key={item.step} className="dealer-service-card">
              <span className="dealer-service-card__step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dealer-gallery">
        <h2 className="dealer-section-title">Distribution Hub</h2>
        <div className="dealer-gallery__grid">
          <div className="dealer-gallery__card">
            <img
              src="https://williamsonstraders.com/wp-content/uploads/2025/07/vegies.jpg"
              alt="Fresh produce"
            />
            <h3>Fresh Produce</h3>
          </div>
          <div className="dealer-gallery__card">
            <img
              src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg"
              alt="Warehouse logistics"
            />
            <h3>Logistics</h3>
          </div>
          <div className="dealer-gallery__card">
            <img
              src="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg"
              alt="Delivery truck"
            />
            <h3>Last-mile delivery</h3>
          </div>
          <div className="dealer-gallery__card">
            <img
              src="https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg"
              alt="Customer satisfaction"
            />
            <h3>Happy customers</h3>
          </div>
        </div>
      </section>

      <section className="dealer-stats">
        <div className="dealer-stat-card">
          <h2>500+</h2>
          <p>Active dealers</p>
        </div>
        <div className="dealer-stat-card">
          <h2>25K+</h2>
          <p>Orders delivered</p>
        </div>
        <div className="dealer-stat-card">
          <h2>10K+</h2>
          <p>Partner farmers</p>
        </div>
        <div className="dealer-stat-card">
          <h2>98%</h2>
          <p>On-time rate</p>
        </div>
      </section>

      <section className="dealer-cta">
        <h2>Ready to handle today&apos;s assignments?</h2>
        <p>
          Open My Jobs to see products assigned by farmers, update status, and
          notify customers when delivery is complete.
        </p>
        <Link to="myjob" className="dealer-cta__btn">
          Go to My Jobs
        </Link>
      </section>
    </div>
  );
};

export default DealerHome;
