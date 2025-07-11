import React from 'react';
import './pages.css';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Trusted Local Partner</h1>
          <p className="hero-subtitle">Welcome to Test Tech Company - We are a locally-owned business dedicated to providing exceptional service to our community. With ye...</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            
            <div className="feature-card">
              <h3>Consultation Services</h3>
              <p>We excel in providing consultation services that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Custom Solutions</h3>
              <p>We excel in providing custom solutions that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Maintenance & Support</h3>
              <p>We excel in providing maintenance & support that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Emergency Services</h3>
              <p>We excel in providing emergency services that exceeds expectations.</p>
            </div>
            <div className="feature-card">
              <h3>Quality Assurance</h3>
              <p>We excel in providing quality assurance that exceeds expectations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;