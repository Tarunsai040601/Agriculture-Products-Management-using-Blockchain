import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";

const services = [
  {
    icon: "🌾",
    title: "Agriculture Products",
    body: "Browse farm-fresh grains, vegetables, fruits, and organic produce sourced directly from verified farmers and dealers.",
  },
  {
    icon: "🚚",
    title: "Home Delivery",
    body: "Order online and receive quality harvests at your doorstep with tracked, timely delivery across your region.",
  },
  {
    icon: "✨",
    title: "Quality Items",
    body: "Every listing meets strict quality checks—graded, inspected, and packaged to keep nutrients and freshness intact.",
  },
  {
    icon: "🔗",
    title: "Blockchain Traceability",
    body: "Verify origin, handling, and authenticity on the blockchain before you buy—transparent from farm to table.",
  },
  {
    icon: "🌱",
    title: "Sustainable Farming",
    body: "We partner with growers who follow eco-friendly practices to protect soil, water, and long-term harvest health.",
  },
  {
    icon: "📊",
    title: "Smart Farm Services",
    body: "Crop monitoring, seasonal planning, and marketplace tools help farmers and customers stay connected year-round.",
  },
];

const highlights = [
  { label: "Farmers & Dealers", value: 500, suffix: "+" },
  { label: "Products Listed", value: 1200, suffix: "+" },
  { label: "Happy Customers", value: 8000, suffix: "+" },
  { label: "Deliveries Completed", value: 15000, suffix: "+" },
];

const values = [
  {
    step: "01",
    title: "Farm to Fork",
    text: "We shorten the supply chain so you get fresher produce at fair prices while farmers earn more.",
  },
  {
    step: "02",
    title: "Trust & Transparency",
    text: "Blockchain records every handoff—no guesswork about where your food came from or how it was handled.",
  },
  {
    step: "03",
    title: "Quality First",
    text: "From harvest to packaging, our standards ensure you receive only premium, inspection-ready items.",
  },
  {
    step: "04",
    title: "Community Growth",
    text: "We build a network where rural producers and urban customers thrive together through technology.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function AnimatedCounter({ end, suffix = "", duration = 2000, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };

    requestAnimationFrame(tick);
  }, [active, end, duration]);

  return (
    <span className="about-stat__number">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function RevealSection({ children, className = "", delay = "" }) {
  const [ref, visible] = useInView(0.12);

  return (
    <div
      ref={ref}
      className={`about-reveal ${delay} ${visible ? "about-reveal--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const About = () => {
  const [statsRef, statsVisible] = useInView(0.2);
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero__bg-shapes" aria-hidden="true">
          <span className="about-hero__shape about-hero__shape--1" />
          <span className="about-hero__shape about-hero__shape--2" />
          <span className="about-hero__shape about-hero__shape--3" />
        </div>

        <div
          ref={heroRef}
          className={`about-hero__inner ${heroVisible ? "about-hero__inner--visible" : ""}`}
        >
          <p className="about-hero__eyebrow">About Our Platform</p>
          <h1 className="about-hero__title">
            Growing Trust in Every{" "}
            <span className="about-hero__highlight">Agriculture Product</span>
          </h1>
          <p className="about-hero__subtitle">
            We connect farmers, dealers, and customers through fresh produce,
            reliable home delivery, premium quality items, and blockchain-backed
            transparency—so every meal starts with confidence.
          </p>
          <div className="about-hero__actions">
            <Link to="/items" className="about-btn about-btn--primary">
              Explore Marketplace
            </Link>
            <a href="#about-services" className="about-btn about-btn--outline">
              Our Services
            </a>
          </div>
        </div>

        <div className="about-hero__visual" aria-hidden="true">
          <img
            className="about-hero__img about-hero__img--main"
            src="https://images.pexels.com/photos/9268302/pexels-photo-9268302.jpeg"
            alt=""
          />
          <img
            className="about-hero__img about-hero__img--float"
            src="https://images.pexels.com/photos/30754757/pexels-photo-30754757.jpeg"
            alt=""
          />
        </div>
      </section>

      <section className="about-mission" ref={statsRef}>
        <RevealSection className="about-mission__content">
          <span className="about-section-label">Who We Are</span>
          <h2>Empowering Agriculture Through Innovation</h2>
          <p>
            Our platform bridges rural harvests and urban tables. Whether you need
            seasonal crops, organic staples, or specialty produce—we deliver
            quality items with services built for modern farming and shopping.
          </p>
        </RevealSection>

        <div className="about-stats">
          {highlights.map((item, index) => (
            <RevealSection
              key={item.label}
              className="about-stat"
              delay={`about-reveal--delay-${index + 1}`}
            >
              <AnimatedCounter
                end={item.value}
                suffix={item.suffix}
                active={statsVisible}
              />
              <span className="about-stat__label">{item.label}</span>
            </RevealSection>
          ))}
        </div>
      </section>

      <section id="about-services" className="about-services">
        <RevealSection className="about-services__header">
          <span className="about-section-label">What We Offer</span>
          <h2>Services Built for Farmers &amp; Customers</h2>
          <p>
            From agriculture products and home delivery to quality assurance and
            blockchain traceability—everything you need in one trusted place.
          </p>
        </RevealSection>

        <div className="about-services__grid">
          {services.map((service, index) => (
            <RevealSection
              key={service.title}
              className="about-service-card"
              delay={`about-reveal--delay-${(index % 3) + 1}`}
            >
              <span className="about-service-card__icon" aria-hidden="true">
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span className="about-service-card__shine" aria-hidden="true" />
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="about-quality">
        <div className="about-quality__image-wrap">
          <RevealSection className="about-quality__image-reveal">
            <img
              src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=700&auto=format&fit=crop&q=80"
              alt="Fresh organic vegetables in baskets"
            />
            <div className="about-quality__badge about-float-badge">
              <strong>100%</strong>
              <span>Quality Checked</span>
            </div>
          </RevealSection>
        </div>

        <RevealSection className="about-quality__text">
          <span className="about-section-label about-section-label--light">
            Premium Quality
          </span>
          <h2>Fresh Items, Delivered to Your Door</h2>
          <ul className="about-quality__list">
            <li>
              <span className="about-quality__check">✓</span>
              Hand-picked produce graded for freshness and size
            </li>
            <li>
              <span className="about-quality__check">✓</span>
              Fast home delivery with real-time order tracking
            </li>
            <li>
              <span className="about-quality__check">✓</span>
              Secure payments and verified seller profiles
            </li>
            <li>
              <span className="about-quality__check">✓</span>
              Blockchain proof for origin and supply chain steps
            </li>
          </ul>
          <Link to="/items" className="about-btn about-btn--gold">
            Start Shopping →
          </Link>
        </RevealSection>
      </section>

      <section className="about-values">
        <RevealSection className="about-values__header">
          <span className="about-section-label">Our Values</span>
          <h2>How We Serve the Agriculture Community</h2>
        </RevealSection>

        <div className="about-values__grid">
          {values.map((item, index) => (
            <RevealSection
              key={item.step}
              className="about-value-card"
              delay={`about-reveal--delay-${(index % 4) + 1}`}
            >
              <span className="about-value-card__step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta__glow" aria-hidden="true" />
        <RevealSection className="about-cta__inner">
          <h2>Ready to Experience Farm-Fresh Quality?</h2>
          <p>
            Join thousands of customers who trust us for agriculture products,
            seamless home delivery, and quality items you can verify on the
            blockchain.
          </p>
          <div className="about-cta__actions">
            <Link to="/customerDashboard" className="about-btn about-btn--light">
              Back to Home
            </Link>
            <Link to="/reviews" className="about-btn about-btn--ghost">
              Share Your Review
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};

export default About;
