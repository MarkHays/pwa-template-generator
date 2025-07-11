import React from 'react';
import './pages.css';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About Test Business</h1>
        <p className="page-subtitle">Learn more about our company and mission</p>
      </div>

      <div className="container">
        {/* Main Content */}
        <section className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>Test Business is dedicated to providing exceptional service with a focus on quality and customer satisfaction.</p>

            <h3>Our Mission</h3>
            <p>Our mission is to deliver outstanding results while building lasting relationships with our clients.</p>

            <h3>Our Vision</h3>
            <p>To be the leading provider of innovative solutions in our industry.</p>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            
            <div className="value-card">
              <h3>Integrity</h3>
              <p>We believe in integrity as a core principle of our business.</p>
            </div>
            
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We believe in excellence as a core principle of our business.</p>
            </div>
            
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We believe in innovation as a core principle of our business.</p>
            </div>
            
            <div className="value-card">
              <h3>Customer Focus</h3>
              <p>We believe in customer focus as a core principle of our business.</p>
            </div>
            
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>John Smith</h3>
              <p className="team-role">CEO</p>
              <p className="team-bio">Experienced leader with 15+ years in the industry</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>Sarah Johnson</h3>
              <p className="team-role">CTO</p>
              <p className="team-bio">Technology expert passionate about innovation</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>Mike Davis</h3>
              <p className="team-role">Head of Sales</p>
              <p className="team-bio">Results-driven professional focused on client success</p>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;