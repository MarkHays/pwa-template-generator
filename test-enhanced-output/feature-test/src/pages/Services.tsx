import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services: React.FC = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive solutions designed to drive your business forward</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon">💻</div>
                <h3>Software Development</h3>
              </div>
              <p className="service-description">Custom software solutions tailored to your unique business requirements</p>
              <ul className="service-features">
                <li>Web Application Development</li><li>Mobile App Development</li><li>API Development & Integration</li><li>Database Design & Optimization</li><li>Legacy System Modernization</li>
              </ul>
              <div className="service-meta">
                <div className="service-pricing">Starting at $5,000</div>
                <div className="service-timeline">4-12 weeks</div>
              </div>
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
            </div>
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon">☁️</div>
                <h3>Cloud Solutions</h3>
              </div>
              <p className="service-description">Scalable cloud infrastructure and services for modern businesses</p>
              <ul className="service-features">
                <li>Cloud Migration & Strategy</li><li>DevOps & CI/CD Pipeline</li><li>Infrastructure as Code</li><li>Cloud Security & Compliance</li><li>Performance Monitoring</li>
              </ul>
              <div className="service-meta">
                <div className="service-pricing">Starting at $3,000</div>
                <div className="service-timeline">2-8 weeks</div>
              </div>
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
            </div>
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon">🤖</div>
                <h3>AI & Machine Learning</h3>
              </div>
              <p className="service-description">Intelligent automation and data-driven insights for competitive advantage</p>
              <ul className="service-features">
                <li>AI Strategy & Implementation</li><li>Machine Learning Models</li><li>Natural Language Processing</li><li>Computer Vision Solutions</li><li>Data Analytics & Insights</li>
              </ul>
              <div className="service-meta">
                <div className="service-pricing">Starting at $8,000</div>
                <div className="service-timeline">6-16 weeks</div>
              </div>
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
            </div>
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon">🎨</div>
                <h3>UI/UX Design</h3>
              </div>
              <p className="service-description">User-centered design that creates exceptional digital experiences</p>
              <ul className="service-features">
                <li>User Research & Analysis</li><li>Wireframing & Prototyping</li><li>Visual Design & Branding</li><li>Usability Testing</li><li>Design System Development</li>
              </ul>
              <div className="service-meta">
                <div className="service-pricing">Starting at $2,500</div>
                <div className="service-timeline">3-6 weeks</div>
              </div>
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>How we deliver exceptional results</p>
          </div>
          <div className="process-steps">
            
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Discovery</h3>
              <p>We start by understanding your business goals and requirements</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Planning</h3>
              <p>Detailed project planning and strategy development</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Design</h3>
              <p>Creating wireframes, mockups, and user experience designs</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">04</div>
              <h3>Development</h3>
              <p>Building your solution with clean, scalable code</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">05</div>
              <h3>Testing</h3>
              <p>Rigorous testing to ensure quality and performance</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">06</div>
              <h3>Launch</h3>
              <p>Deployment and go-live support</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Success Stories</h2>
          <div className="testimonials-grid">
            
            <div className="testimonial-card">
              <p className="testimonial-text">"Their software development team delivered exactly what we needed. The solution has improved our efficiency by 40%."</p>
              <div className="testimonial-author">
                <strong>David Park</strong>
                <span>Innovation Corp</span>
                <small>Used: Software Development</small>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">"The cloud migration was seamless. Our applications are now faster and more reliable than ever."</p>
              <div className="testimonial-author">
                <strong>Lisa Thompson</strong>
                <span>Growth Enterprises</span>
                <small>Used: Cloud Solutions</small>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Let's discuss how we can help achieve your goals</p>
            <div className="cta-features">
              
              <div className="cta-feature">✓ Free initial consultation</div>
              
              <div className="cta-feature">✓ Detailed project proposal</div>
              
              <div className="cta-feature">✓ Transparent pricing</div>
              
              <div className="cta-feature">✓ Flexible engagement models</div>
              
            </div>
            <Link to="/contact" className="btn btn-primary">Get Free Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;