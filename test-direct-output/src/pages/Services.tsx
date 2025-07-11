import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Our Services</h1>
        <p className="page-subtitle">Comprehensive solutions tailored to your needs</p>
      </div>

      <div className="container">
        <div className="services-grid">
          
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>Consultation Services</h3>
            <p>Professional consultation services services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>Custom Solutions</h3>
            <p>Professional custom solutions services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>Maintenance & Support</h3>
            <p>Professional maintenance & support services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>Emergency Services</h3>
            <p>Professional emergency services services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>Quality Assurance</h3>
            <p>Professional quality assurance services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;