import React from 'react';
import './pages.css';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About Test Tech Company</h1>
        <p className="page-subtitle">Learn more about our company and mission</p>
      </div>

      <div className="container">
        <section className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>We are a locally-owned business dedicated to providing exceptional service to our community. With years of experience and a commitment to excellence, we pride ourselves on building lasting relationships with our clients.</p>

            <h3>Our Mission</h3>
            <p>To deliver outstanding results while building lasting relationships with our clients.</p>

            <h3>Our Vision</h3>
            <p>To be the leading provider of innovative solutions in our industry.</p>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Integrity</h3>
              <p>We believe in integrity as a core principle of our business.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We embrace innovation to serve our clients better.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;