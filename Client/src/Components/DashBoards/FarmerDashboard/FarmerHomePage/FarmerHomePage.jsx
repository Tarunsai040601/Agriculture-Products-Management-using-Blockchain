import React, { useEffect, useState } from "react";
import "./FarmerHomePage.css";
import video from "../../../../assets/videos/video.mp4";
import video_01 from '../../../../assets/videos/video_01.mp4'
const FarmerHomePage = () => {
  const cropData = [
    {
      title: "🌾 Rice Farming",
      desc: "Grow premium quality rice with modern farming techniques and maximize your harvest.",
    },
    {
      title: "🌽 Corn Cultivation",
      desc: "Increase productivity with advanced irrigation and sustainable agriculture practices.",
    },
    {
      title: "🍅 Vegetable Farming",
      desc: "Fresh vegetables directly from farm to market with better profit opportunities.",
    },
    {
      title: "🥭 Mango Plantation",
      desc: "Organic mango cultivation with high-quality production and export potential.",
    },
  ];

  const [currentCrop, setCurrentCrop] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCrop((prev) => (prev + 1) % cropData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="farmerHome">
      {/* HERO SECTION */}

      <section className="farmerHero">
        <video autoPlay muted loop playsInline className="farmerHeroVideo">
          <source src={video} type="video/mp4" />
        </video>

        <div className="farmerOverlay">
          <div className="farmerHeroContent">
            <h1>{cropData[currentCrop].title}</h1>

            <p>{cropData[currentCrop].desc}</p>

            <button>Explore Crops_items</button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}

      <section className="farmerAboutSection">
        <div className="farmerAboutContainer">
          {/* LEFT */}

          <div className="farmerAboutContent">
            <span className="farmerTag">Smart Agriculture</span>

            <h2>Modern Farming Solutions For Better Yield</h2>

            <p>
              Empowering farmers with advanced technologies, crop monitoring,
              market access, weather forecasts, and sustainable farming
              practices.
            </p>

            <div className="farmerFeatures">
              <div className="featureCard">🌱 Organic Farming</div>

              <div className="featureCard">🚜 Smart Equipment</div>

              <div className="featureCard">🌦 Weather Insights</div>

              <div className="featureCard">📈 Market Growth</div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="farmerAboutImage">
            <img
              src="https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg"
              alt="Farmer"
            />
          </div>
        </div>
      </section>

      {/* CROPS SECTION */}

      <section className="cropSection">
        <h2 className="sectionTitle">Seasonal Crops</h2>

        <div className="cropGrid">
          <div className="cropCard">
            <img
              src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
              alt=""
            />
            <h3>Rice</h3>
          </div>

          <div className="cropCard">
            <img
              src="https://www.bhg.com/thmb/CW7wrStDiGAaHprdDT7dYIgnz8c=/1500x0/filters:no_upscale():strip_icc()/when-to-harvest-corn-for-sweetest-ears-6749235-01-2e11a328ae9f4ee5a0f531af74e67cc0.jpg"
              alt=""
            />
            <h3>Corn</h3>
          </div>

          <div className="cropCard">
            <img
              src="https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg"
              alt=""
            />
            <h3>Vegetables</h3>
          </div>

          <div className="cropCard">
            <img
              src="https://images.jdmagicbox.com/quickquotes/images_main/1-dozen-mangoes-box-medium-size-alphonso-mangoes-200-235-gms-2028759358-aucvifo1.jpg"
              alt=""
            />
            <h3>Mango</h3>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="farmerStats">
        <div className="statCard">
          <h2>10K+</h2>
          <p>Farmers</p>
        </div>

        <div className="statCard">
          <h2>50K+</h2>
          <p>Products</p>
        </div>

        <div className="statCard">
          <h2>5K+</h2>
          <p>Dealers</p>
        </div>

        <div className="statCard">
          <h2>100K+</h2>
          <p>Customers</p>
        </div>
      </section>

      {/* CTA */}

      <section className="farmerCTA">
        <h2>Grow Smarter, Harvest Better 🌾</h2>

        <p>
          Join our agriculture platform and improve your farming journey today.
        </p>

        <button>Get Started</button>
      </section>
    </div>
  );
};

export default FarmerHomePage;
