import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About Legal Services Pro</h1>
          <p>Learn more about our story, mission, and the team behind our success</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>Legal Services Pro was founded with a simple mission: to provide exceptional services that exceed our clients' expectations. With years of experience in the technology industry, we've built a reputation for quality, reliability, and innovation.</p>
            </div>
            <div className="story-timeline">
              <h3>Our Journey</h3>
              <div className="timeline">
                
                <div className="timeline-item">
                  <div className="timeline-year">2019</div>
                  <div className="timeline-content">
                    <h4>Company Founded</h4>
                    <p>Started with a vision to transform digital experiences</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2020</div>
                  <div className="timeline-content">
                    <h4>First Major Client</h4>
                    <p>Secured our first enterprise-level partnership</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2021</div>
                  <div className="timeline-content">
                    <h4>Team Expansion</h4>
                    <p>Grew our team to 15+ skilled professionals</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2022</div>
                  <div className="timeline-content">
                    <h4>Innovation Award</h4>
                    <p>Recognized for excellence in digital innovation</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2023</div>
                  <div className="timeline-content">
                    <h4>Global Reach</h4>
                    <p>Expanded services to international markets</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>We are committed to delivering outstanding results while maintaining the highest standards of professionalism and customer service. Our team of experts works tirelessly to ensure your success.</p>
              <div className="vision-box">
                <h3>Our Vision</h3>
                <p>To be the leading provider of innovative digital solutions that empower businesses to thrive in the modern economy.</p>
              </div>
            </div>
            <div className="values-grid">
              <h3>Our Values</h3>
              
              <div className="value-card">
                <h4>Integrity</h4>
                <p>We maintain the highest ethical standards in all our interactions</p>
              </div>
              
              <div className="value-card">
                <h4>Excellence</h4>
                <p>We strive for perfection in every project we undertake</p>
              </div>
              
              <div className="value-card">
                <h4>Innovation</h4>
                <p>We embrace new technologies and creative problem-solving</p>
              </div>
              
              <div className="value-card">
                <h4>Customer Focus</h4>
                <p>Your success is our primary objective</p>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The talented individuals who make our success possible</p>
          </div>
          <div className="team-grid">
            
            <div className="team-card">
              <div className="team-image">
                <div className="team-placeholder">👤</div>
              </div>
              <div className="team-info">
                <h3>Alex Johnson</h3>
                <p className="team-role">CEO & Founder</p>
                <p className="team-bio">Visionary leader with 15+ years in technology and business development</p>
                <div className="team-social">
                  
                  <a href="#" className="social-link">linkedin</a>
                  
                  <a href="#" className="social-link">twitter</a>
                  
                </div>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-image">
                <div className="team-placeholder">👤</div>
              </div>
              <div className="team-info">
                <h3>Sarah Martinez</h3>
                <p className="team-role">CTO</p>
                <p className="team-bio">Technology expert passionate about innovation and scalable solutions</p>
                <div className="team-social">
                  
                  <a href="#" className="social-link">linkedin</a>
                  
                  <a href="#" className="social-link">github</a>
                  
                </div>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-image">
                <div className="team-placeholder">👤</div>
              </div>
              <div className="team-info">
                <h3>Michael Chen</h3>
                <p className="team-role">Head of Design</p>
                <p className="team-bio">Creative designer focused on user experience and visual excellence</p>
                <div className="team-social">
                  
                  <a href="#" className="social-link">linkedin</a>
                  
                  <a href="#" className="social-link">dribbble</a>
                  
                </div>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-image">
                <div className="team-placeholder">👤</div>
              </div>
              <div className="team-info">
                <h3>Emily Rodriguez</h3>
                <p className="team-role">Project Manager</p>
                <p className="team-bio">Results-driven professional ensuring projects are delivered on time</p>
                <div className="team-social">
                  
                  <a href="#" className="social-link">linkedin</a>
                  
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="awards-section">
        <div className="container">
          <h2>Recognition & Awards</h2>
          <div className="awards-grid">
            
            <div className="award-card">
              <div className="award-year">2023</div>
              <h3>Digital Innovation Excellence Award</h3>
              <p>Tech Industry Association</p>
            </div>
            
            <div className="award-card">
              <div className="award-year">2022</div>
              <h3>Best Small Business Technology Provider</h3>
              <p>Business Excellence Council</p>
            </div>
            
            <div className="award-card">
              <div className="award-year">2021</div>
              <h3>Customer Service Excellence</h3>
              <p>Service Quality Institute</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Want to Work With Us?</h2>
            <p>Join our growing list of satisfied clients</p>
            <a href="/contact" className="btn btn-primary">Start Your Project</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;