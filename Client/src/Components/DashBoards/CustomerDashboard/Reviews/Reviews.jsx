import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Reviews.css";

const STATIC_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Hyderabad",
    rating: 5,
    product: "Organic Basmati Rice",
    date: "12 May 2026",
    text: "Rice was fragrant and exactly as described. Blockchain trace showed the farm batch clearly—felt confident buying direct from the farmer.",
  },
  {
    id: 2,
    name: "Rahul Menon",
    location: "Kochi",
    rating: 5,
    product: "Fresh Tomatoes (5 kg)",
    date: "8 May 2026",
    text: "Tomatoes arrived firm and ripe. Delivery was on time and packaging kept them from bruising. Will order again next week.",
  },
  {
    id: 3,
    name: "Ananya Reddy",
    location: "Vijayawada",
    rating: 4,
    product: "Farm Honey",
    date: "3 May 2026",
    text: "Pure taste and clear origin on the platform. Slightly smaller jar than I expected, but quality made up for it.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    product: "Wheat Flour (Stone-ground)",
    date: "28 Apr 2026",
    text: "Rotis came out soft and fresh. Loved seeing the harvest date and farmer details before checkout.",
  },
  {
    id: 5,
    name: "Meera Iyer",
    location: "Chennai",
    rating: 5,
    product: "Seasonal Vegetable Box",
    date: "22 Apr 2026",
    text: "Mixed box had spinach, beans, and carrots—all crisp. Tracking updates from farmer to dealer were accurate.",
  },
  {
    id: 6,
    name: "Arjun Patel",
    location: "Ahmedabad",
    rating: 4,
    product: "Groundnut Oil (Cold-pressed)",
    date: "18 Apr 2026",
    text: "Good aroma and no adulteration worries thanks to traceability. Delivery took one extra day during rain.",
  },
  {
    id: 7,
    name: "Kavya Nair",
    location: "Thiruvananthapuram",
    rating: 5,
    product: "Banana Chips (Homemade)",
    date: "10 Apr 2026",
    text: "Crunchy, lightly salted, and not oily. Nice to support a local farmer instead of supermarket brands.",
  },
  {
    id: 8,
    name: "Suresh Kumar",
    location: "Coimbatore",
    rating: 5,
    product: "Turmeric Powder",
    date: "5 Apr 2026",
    text: "Bright color and strong aroma—clearly fresh stock. Blockchain certificate link was easy to verify.",
  },
  {
    id: 9,
    name: "Divya Joshi",
    location: "Pune",
    rating: 4,
    product: "Mango (Alphonso)",
    date: "1 Apr 2026",
    text: "Sweet and juicy mangoes. A couple were slightly soft on arrival but still edible. Overall happy with the season's first order.",
  },
  {
    id: 10,
    name: "Imran Khan",
    location: "Lucknow",
    rating: 5,
    product: "Green Moong Dal",
    date: "25 Mar 2026",
    text: "Cooked evenly and no stones or husk. Fair price compared to local market when you factor in home delivery.",
  },
];

const StarRating = ({ value }) => (
  <span className="reviews-stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className={n <= value ? "reviews-star reviews-star--filled" : "reviews-star"}
      >
        ★
      </span>
    ))}
  </span>
);

const Reviews = () => {
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const total = STATIC_REVIEWS.length;
    const sum = STATIC_REVIEWS.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);
    const fiveStar = STATIC_REVIEWS.filter((r) => r.rating === 5).length;
    return { total, avg, fiveStar };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return STATIC_REVIEWS;
    const min = Number(filter);
    return STATIC_REVIEWS.filter((r) => r.rating >= min);
  }, [filter]);

  return (
    <div className="reviews-page">
      <header className="reviews-hero">
        <span className="reviews-label">Customer voices</span>
        <h1>Reviews &amp; Ratings</h1>
        <p>
          Real feedback from customers who shop farm-fresh produce with blockchain
          traceability on our platform.
        </p>
        <div className="reviews-hero-stats">
          <div className="reviews-stat">
            <strong>{stats.avg}</strong>
            <span>Average rating</span>
          </div>
          <div className="reviews-stat">
            <strong>{stats.total}</strong>
            <span>Reviews shown</span>
          </div>
          <div className="reviews-stat">
            <strong>{stats.fiveStar}</strong>
            <span>5-star reviews</span>
          </div>
        </div>
      </header>

      <main className="reviews-body">
        <div className="reviews-toolbar">
          <h2>What customers say</h2>
          <div className="reviews-filters">
            {[
              { key: "all", label: "All" },
              { key: "5", label: "5★" },
              { key: "4", label: "4★+" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={
                  filter === key
                    ? "reviews-filter-btn reviews-filter-btn--active"
                    : "reviews-filter-btn"
                }
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="reviews-grid">
          {filtered.map((review) => (
            <li key={review.id} className="reviews-card">
              <div className="reviews-card-header">
                <div
                  className="reviews-avatar"
                  aria-hidden
                >
                  {review.name.charAt(0)}
                </div>
                <div className="reviews-card-meta">
                  <h3>{review.name}</h3>
                  <p className="reviews-location">{review.location}</p>
                </div>
                <time className="reviews-date" dateTime={review.date}>
                  {review.date}
                </time>
              </div>
              <StarRating value={review.rating} />
              <p className="reviews-product">{review.product}</p>
              <p className="reviews-text">{review.text}</p>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="reviews-empty">No reviews match this filter.</p>
        )}

        <div className="reviews-cta">
          <p>Ready to try farm-fresh products yourself?</p>
          <Link to="/items" className="reviews-shop-btn">
            Browse products
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
