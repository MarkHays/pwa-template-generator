import React from 'react';
import './pages.css';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Test Business</h1>
          <p className="hero-subtitle">Welcome to Test Business - Your trusted partner</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            
            <div className="feature-card">
              <h3>Professional Service</h3>
              <p>We excel in providing professional service that exceeds expectations.</p>
            </div>
            
            <div className="feature-card">
              <h3>Quality Solutions</h3>
              <p>We excel in providing quality solutions that exceeds expectations.</p>
            </div>
            
            <div className="feature-card">
              <h3>Customer Focused</h3>
              <p>We excel in providing customer focused that exceeds expectations.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            
            <div className="testimonial-card">
              <p>"Excellent service and professional team!"</p>
              <cite>- Satisfied Customer</cite>
            </div>
            
            <div className="testimonial-card">
              <p>"Highly recommend for quality work."</p>
              <cite>- Satisfied Customer</cite>
            </div>
            
            <div className="testimonial-card">
              <p>"Outstanding results and great communication."</p>
              <cite>- Satisfied Customer</cite>
            </div>
            
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;