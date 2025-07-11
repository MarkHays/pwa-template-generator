import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Digital Ghost Protocol 3</h1>
          <p className="hero-subtitle">Welcome to Digital Ghost Protocol 3 - Your trusted partner</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            
            <div className="feature-card">
              <h3>Professional Consulting</h3>
              <p>We excel in providing professional consulting that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Quality Solutions</h3>
              <p>We excel in providing quality solutions that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Customer Support</h3>
              <p>We excel in providing customer support that exceeds expectations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;