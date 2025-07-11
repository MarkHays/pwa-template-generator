import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Feature Test Corp - Professional Services</h1>
          <p className="hero-subtitle">Quality solutions for your business needs</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started Today</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🚀</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>We deliver exceptional results with cutting-edge solutions</p>
          </div>
          <div className="features-grid">
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Delivery</h3>
              <p>Quick turnaround times without compromising quality</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Precision Focus</h3>
              <p>Laser-focused on your specific business needs</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Innovation</h3>
              <p>Latest technologies and creative solutions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Reliability</h3>
              <p>Dependable service you can count on</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Software Development</h3>
              <p>Custom software solutions tailored to your needs</p>
              <ul className="service-features">
                <li>Web Applications</li><li>Mobile Apps</li><li>API Development</li>
              </ul>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">☁️</div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure and services</p>
              <ul className="service-features">
                <li>Cloud Migration</li><li>DevOps</li><li>Infrastructure</li>
              </ul>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🤖</div>
              <h3>AI & Machine Learning</h3>
              <p>Intelligent automation and data-driven insights</p>
              <ul className="service-features">
                <li>AI Integration</li><li>Data Analytics</li><li>Automation</li>
              </ul>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">5 Years</div>
              <div className="stat-label">Industry Experience</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
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
              <div className="testimonial-rating">
                ★★★★★
              </div>
              <p className="testimonial-text">"Exceptional service and outstanding results. They exceeded our expectations in every way."</p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Tech Corp</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ★★★★★
              </div>
              <p className="testimonial-text">"Professional, reliable, and innovative. Our project was delivered on time and within budget."</p>
              <div className="testimonial-author">
                <strong>Michael Chen</strong>
                <span>StartupXYZ</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ★★★★★
              </div>
              <p className="testimonial-text">"The team's expertise and attention to detail made all the difference. Highly recommended!"</p>
              <div className="testimonial-author">
                <strong>Emily Rodriguez</strong>
                <span>Growth LLC</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            
            <div className="faq-item">
              <h3 className="faq-question">What is your typical project timeline?</h3>
              <p className="faq-answer">Project timelines vary based on complexity, but most projects are completed within 2-8 weeks.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Do you provide ongoing support?</h3>
              <p className="faq-answer">Yes, we offer comprehensive support and maintenance packages for all our solutions.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What industries do you serve?</h3>
              <p className="faq-answer">We work with businesses across various industries including tech, healthcare, finance, and retail.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How do you ensure project quality?</h3>
              <p className="faq-answer">We follow rigorous testing procedures and maintain regular communication throughout the project.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Let's discuss your project and bring your vision to life</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">Contact Us Today</Link>
              <span className="cta-note">Free consultation available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;