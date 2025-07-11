/**
 * Complete Feature Generator - All Features with CSS
 * Generates comprehensive feature pages and components with corresponding CSS files
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export class CompleteFeatureGenerator {
  constructor() {
    this.featureTemplates = {
      booking: this.getBookingTemplate.bind(this),
      gallery: this.getGalleryTemplate.bind(this),
      testimonials: this.getTestimonialsTemplate.bind(this),
      reviews: this.getReviewsTemplate.bind(this),
      chat: this.getChatTemplate.bind(this),
      auth: this.getAuthTemplate.bind(this),
      profile: this.getProfileTemplate.bind(this),
      security: this.getSecurityTemplate.bind(this),
      portfolio: this.getPortfolioTemplate.bind(this),
      blog: this.getBlogTemplate.bind(this),
      ecommerce: this.getEcommerceTemplate.bind(this),
    };

    this.cssTemplates = {
      booking: this.getBookingCSS.bind(this),
      gallery: this.getGalleryCSS.bind(this),
      testimonials: this.getTestimonialsCSS.bind(this),
      reviews: this.getReviewsCSS.bind(this),
      chat: this.getChatCSS.bind(this),
      login: this.getAuthCSS.bind(this),
      register: this.getAuthCSS.bind(this),
      profile: this.getProfileCSS.bind(this),
      security: this.getSecurityCSS.bind(this),
      portfolio: this.getPortfolioCSS.bind(this),
      blog: this.getBlogCSS.bind(this),
      ecommerce: this.getEcommerceCSS.bind(this),
    };
  }

  /**
   * Generate all feature pages and CSS files
   */
  async generateAllFeatures(context) {
    const { selectedFeatures, outputDir, framework } = context;

    console.log(
      chalk.blue(
        `🔧 Generating ${selectedFeatures.length} feature components...`,
      ),
    );

    for (const feature of selectedFeatures) {
      await this.generateFeature(feature, context);
    }

    console.log(
      chalk.green(
        `✅ All ${selectedFeatures.length} features generated successfully!`,
      ),
    );
  }

  /**
   * Generate a specific feature
   */
  async generateFeature(feature, context) {
    const { outputDir, framework } = context;

    // Handle special features that generate multiple pages
    if (feature === "auth") {
      await this.generateAuthPages(context);
      return;
    }

    // Generate the main feature page
    const template = this.featureTemplates[feature];
    if (template) {
      const pageContent = template(context);
      const pageName = this.capitalize(feature);

      // Write the component file
      await fs.writeFile(
        path.join(outputDir, `src/pages/${pageName}.tsx`),
        pageContent,
      );

      // Write the CSS file
      const cssContent =
        this.cssTemplates[feature]?.() || this.getGenericCSS(feature);
      await fs.writeFile(
        path.join(outputDir, `src/pages/${pageName}.css`),
        cssContent,
      );

      console.log(chalk.gray(`   ✓ Generated ${pageName} component with CSS`));
    }
  }

  /**
   * Generate auth pages (login, register, profile)
   */
  async generateAuthPages(context) {
    const { outputDir } = context;
    const authPages = ["Login", "Register", "Profile"];

    for (const pageName of authPages) {
      const template = this.getAuthTemplate(pageName.toLowerCase(), context);
      const cssContent = this.getAuthCSS();

      await fs.writeFile(
        path.join(outputDir, `src/pages/${pageName}.tsx`),
        template,
      );

      await fs.writeFile(
        path.join(outputDir, `src/pages/${pageName}.css`),
        cssContent,
      );

      console.log(chalk.gray(`   ✓ Generated ${pageName} component with CSS`));
    }
  }

  /**
   * BOOKING SYSTEM TEMPLATE
   */
  getBookingTemplate(context) {
    const { businessName } = context;

    return `import React, { useState } from 'react';
import './Booking.css';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const Booking: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ]);

  const services = [
    { id: 'consultation', name: 'Consultation', duration: '30 min', price: '$100' },
    { id: 'full-service', name: 'Full Service', duration: '60 min', price: '$200' },
    { id: 'premium', name: 'Premium Package', duration: '90 min', price: '$300' },
    { id: 'custom', name: 'Custom Solution', duration: 'Variable', price: 'Quote' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // Handle booking submission
    alert('Booking request submitted! We will contact you to confirm.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking-page">
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1>Book an Appointment</h1>
          <p>Schedule your consultation with ${businessName} today</p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-form-section">
        <div className="container">
          <div className="booking-grid">
            {/* Services List */}
            <div className="services-panel">
              <h2>Our Services</h2>
              <div className="services-list">
                {services.map((service) => (
                  <div key={service.id} className="service-item">
                    <h3>{service.name}</h3>
                    <div className="service-details">
                      <span className="duration">{service.duration}</span>
                      <span className="price">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="booking-info">
                <h3>Booking Information</h3>
                <ul>
                  <li>📅 Available Monday - Friday</li>
                  <li>🕘 9:00 AM - 5:00 PM</li>
                  <li>📍 Available in-person or virtual</li>
                  <li>📞 24-hour cancellation policy</li>
                </ul>
              </div>
            </div>

            {/* Booking Form */}
            <div className="booking-form-panel">
              <form onSubmit={handleSubmit} className="booking-form">
                <h2>Schedule Your Appointment</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Service *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Information</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your specific needs or any questions you have..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="booking-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How far in advance should I book?</h3>
              <p>We recommend booking at least 1-2 weeks in advance to ensure availability.</p>
            </div>
            <div className="faq-item">
              <h3>What if I need to reschedule?</h3>
              <p>You can reschedule up to 24 hours before your appointment without any fees.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer virtual consultations?</h3>
              <p>Yes, we offer both in-person and virtual consultations via video call.</p>
            </div>
            <div className="faq-item">
              <h3>What should I prepare for the consultation?</h3>
              <p>Bring any relevant documents and come prepared with questions about your project.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;`;
  }

  /**
   * GALLERY TEMPLATE
   */
  getGalleryTemplate(context) {
    return `import React, { useState } from 'react';
import './Gallery.css';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description?: string;
}

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['all', 'projects', 'team', 'events', 'products'];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: '/images/gallery/project1.jpg',
      alt: 'Professional Project 1',
      title: 'Enterprise Solution',
      category: 'projects',
      description: 'Custom enterprise solution that improved efficiency by 40%'
    },
    {
      id: 2,
      src: '/images/gallery/team1.jpg',
      alt: 'Our Team',
      title: 'Team Collaboration',
      category: 'team',
      description: 'Our expert team working together on innovative solutions'
    },
    {
      id: 3,
      src: '/images/gallery/event1.jpg',
      alt: 'Company Event',
      title: 'Annual Conference',
      category: 'events',
      description: 'Annual technology conference with industry leaders'
    },
    {
      id: 4,
      src: '/images/gallery/product1.jpg',
      alt: 'Product Showcase',
      title: 'Product Launch',
      category: 'products',
      description: 'Launch of our flagship product with advanced features'
    },
    {
      id: 5,
      src: '/images/gallery/project2.jpg',
      alt: 'Creative Project',
      title: 'Mobile Application',
      category: 'projects',
      description: 'Award-winning mobile application with 1M+ downloads'
    },
    {
      id: 6,
      src: '/images/gallery/team2.jpg',
      alt: 'Team Meeting',
      title: 'Strategy Session',
      category: 'team',
      description: 'Strategic planning session for upcoming projects'
    }
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Explore our work, team, and achievements through our image gallery</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={\`filter-btn \${selectedCategory === category ? 'active' : ''}\`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => openModal(item)}
              >
                <div className="gallery-image-wrapper">
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                    <span className="view-icon">👁️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <p className="modal-category">{selectedImage.category}</p>
              {selectedImage.description && (
                <p className="modal-description">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;`;
  }

  /**
   * REVIEWS TEMPLATE
   */
  getReviewsTemplate(context) {
    return `import React, { useState } from 'react';
import './Reviews.css';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  avatar?: string;
  verified?: boolean;
}

const Reviews: React.FC = () => {
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    service: ''
  });

  const [reviews] = useState<Review[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Exceptional service and outstanding results. The team exceeded our expectations in every way. Highly professional and responsive.',
      date: '2024-01-15',
      service: 'Web Development',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 5,
      comment: 'Professional, reliable, and innovative. Our project was delivered on time and within budget. Would definitely work with them again.',
      date: '2024-01-12',
      service: 'Mobile App',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      rating: 5,
      comment: 'The teams expertise and attention to detail made all the difference. They turned our vision into reality perfectly.',
      date: '2024-01-10',
      service: 'UI/UX Design',
      verified: true
    },
    {
      id: 4,
      name: 'David Park',
      rating: 4,
      comment: 'Great communication throughout the project. The final result was exactly what we needed for our business.',
      date: '2024-01-08',
      service: 'Consulting',
      verified: true
    }
  ]);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', newReview);
    alert('Thank you for your review! It will be published after verification.');
    setNewReview({
      name: '',
      email: '',
      rating: 5,
      comment: '',
      service: ''
    });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={\`star \${index < rating ? 'filled' : ''} \${interactive ? 'interactive' : ''}\`}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <h1>Customer Reviews</h1>
          <p>See what our clients are saying about their experience with us</p>

          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              <div className="rating-stars">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="total-reviews">Based on {totalReviews} reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="reviews-list-section">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.name} />
                      ) : (
                        <span>{review.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="reviewer-details">
                      <h3>{review.name}</h3>
                      <span className="review-service">{review.service}</span>
                      {review.verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="review-content">
                  <p>"{review.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a Review */}
      <section className="leave-review-section">
        <div className="container">
          <div className="review-form-wrapper">
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">Service Used</label>
                  <select
                    id="service"
                    value={newReview.service}
                    onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                  >
                    <option value="">Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Rating *</label>
                  <div className="rating-input">
                    {renderStars(newReview.rating, true, (rating) =>
                      setNewReview({...newReview, rating})
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review *</label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  rows={4}
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;`;
  }

  /**
   * CHAT TEMPLATE
   */
  getChatTemplate(context) {
    return `import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can we help you today?',
      sender: 'support',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? {...msg, status: 'sent'} : msg
      ));
    }, 500);

    // Simulate support response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage: Message = {
        id: Date.now() + 1,
        text: getAutoResponse(newMessage),
        sender: 'support',
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const getAutoResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('price') || message.includes('cost')) {
      return "Our pricing varies based on your specific needs. I'd be happy to provide you with a custom quote. Could you tell me more about your project requirements?";
    }

    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! What specific questions do you have about our services?";
    }

    if (message.includes('time') || message.includes('how long')) {
      return "Project timelines depend on complexity and scope. Most projects are completed within 2-8 weeks. Would you like to discuss your specific timeline requirements?";
    }

    return "Thank you for your message! A member of our team will get back to you shortly with a detailed response.";
  };

  const quickReplies = [
    "What are your pricing options?",
    "How long does a project take?",
    "Do you offer support?",
    "Can I see examples of your work?"
  ];

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="container">
          <div className="chat-header-content">
            <div className="support-info">
              <div className="support-avatar">
                <img src="/images/support-avatar.jpg" alt="Support" />
                <span className={\`status-indicator \${isOnline ? 'online' : 'offline'}\`}></span>
              </div>
              <div className="support-details">
                <h2>Live Support</h2>
                <span className="status">{isOnline ? 'Online now' : 'Offline'}</span>
              </div>
            </div>
            <div className="chat-actions">
              <button className="btn btn-outline btn-small">End Chat</button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        <div className="container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={\`message \${message.sender}\`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <div className="message-meta">
                    <span className="timestamp">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'user' && message.status && (
                      <span className={\`status \${message.status}\`}>
                        {message.status === 'sending' && '⏳'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message support typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      <div className="quick-replies">
        <div className="container">
          <div className="quick-replies-list">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => setNewMessage(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <div className="container">
          <form onSubmit={sendMessage} className="message-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;`;
  }

  /**
   * TESTIMONIALS TEMPLATE
   */
  getTestimonialsTemplate(context) {
    return `import React from 'react';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  featured?: boolean;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Tech Corp',
      role: 'CEO',
      content: 'Working with this team has been transformative for our business. Their expertise and dedication exceeded our expectations.',
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'StartupXYZ',
      role: 'CTO',
      content: 'Outstanding results delivered on time and within budget. The level of professionalism is unmatched.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      company: 'Growth LLC',
      role: 'Marketing Director',
      content: 'The attention to detail and creative solutions provided by this team made all the difference for our project.',
      rating: 5
    },
    {
      id: 4,
      name: 'David Park',
      company: 'Innovation Corp',
      role: 'Product Manager',
      content: 'Reliable, innovative, and results-driven. This partnership has been instrumental in our success.',
      rating: 5
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      company: 'Enterprise Solutions',
      role: 'VP of Technology',
      content: 'Their technical expertise and problem-solving abilities are exceptional. Highly recommended.',
      rating: 5
    },
    {
      id: 6,
      name: 'James Wilson',
      company: 'Digital Ventures',
      role: 'Founder',
      content: 'From concept to execution, they delivered exactly what we envisioned. Outstanding service.',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={\`star \${index < rating ? 'filled' : ''}\`}>
        ★
      </span>
    ));
  };

  return (
    <div className="testimonials-page">
      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="container">
          <h1>What Our Clients Say</h1>
          <p>Read testimonials from satisfied clients who have experienced our exceptional service</p>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="featured-testimonial">
        <div className="container">
          {testimonials.filter(t => t.featured).map(testimonial => (
            <div key={testimonial.id} className="featured-testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p className="testimonial-text">{testimonial.content}</p>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <span>{testimonial.name.charAt(0)}</span>
                  )}
                </div>
                <div className="author-info">
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.role}</p>
                  <p>{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Testimonials */}
      <section className="all-testimonials">
        <div className="container">
          <h2>More Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.filter(t => !t.featured).map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="author-avatar">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} />
                    ) : (
                      <span>{testimonial.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="author-info">
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.role}, {testimonial.company}</p>
                  </div>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="testimonials-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5.0</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="testimonials-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join Our Success Stories?</h2>
            <p>Let us help you achieve the same outstanding results</p>
            <a href="/contact" className="btn btn-primary">Get Started Today</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;`;
  }

  /**
   * AUTH TEMPLATES
   */
  getAuthTemplate(type, context) {
    if (type === "login") {
      return this.getLoginTemplate(context);
    } else if (type === "register") {
      return this.getRegisterTemplate(context);
    } else if (type === "profile") {
      return this.getProfileTemplate(context);
    }
    return "";
  }

  getLoginTemplate(context) {
    return `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Handle login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Sign In
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <span>G</span> Google
            </button>
            <button className="social-btn github-btn">
              <span>📘</span> Facebook
            </button>
          </div>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;`;
  }

  getRegisterTemplate(context) {
    return `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Registration attempt:', formData);
    // Handle registration logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join us today and get started</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="privacy-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Create Account
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;`;
  }

  getProfileTemplate(context) {
    return `import React, { useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    role: 'Software Developer',
    bio: 'Passionate developer with 5+ years of experience in web technologies.',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...editData });
    setIsEditing(false);
    console.log('Profile updated:', editData);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
              <button className="avatar-upload">
                Change Photo
              </button>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">15</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Years</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button
                  className="btn btn-outline"
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.firstName}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.email}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={editData.company}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.company}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="role"
                        value={editData.role}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{user.role}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : (
                    <p>{user.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button className="btn btn-outline" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h2>Security Settings</h2>
              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Password</h3>
                    <p>Last changed 3 months ago</p>
                  </div>
                  <button className="btn btn-outline">Change Password</button>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security</p>
                  </div>
                  <button className="btn btn-outline">Enable 2FA</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;`;
  }

  /**
   * CSS TEMPLATES
   */
  getBookingCSS() {
    return `/* Booking Page Styles */
.booking-page {
  min-height: 100vh;
}

.booking-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.booking-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.booking-form-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.booking-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.services-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.service-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.service-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.service-details {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.duration {
  color: #666;
  font-size: 0.9rem;
}

.price {
  color: #667eea;
  font-weight: 600;
}

.booking-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.booking-info ul {
  list-style: none;
  padding: 0;
}

.booking-info li {
  padding: 0.5rem 0;
  color: #555;
}

.booking-form-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
}

.booking-faq {
  padding: 100px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.faq-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.faq-item h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .booking-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .booking-hero h1 {
    font-size: 2rem;
  }
}`;
  }

  getGalleryCSS() {
    return `/* Gallery Page Styles */
.gallery-page {
  min-height: 100vh;
}

.gallery-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.gallery-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gallery-filters {
  padding: 50px 0;
  background: #f8f9fa;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.gallery-grid-section {
  padding: 50px 0 100px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-image-wrapper {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.gallery-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-overlay h3 {
  margin-bottom: 0.5rem;
  color: white;
}

.view-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
}

.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.modal-content img {
  width: 100%;
  height: auto;
  display: block;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
}

.modal-info {
  padding: 2rem;
}

.modal-category {
  color: #667eea;
  text-transform: uppercase;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }
}`;
  }

  getReviewsCSS() {
    return `/* Reviews Page Styles */
.reviews-page {
  min-height: 100vh;
}

.reviews-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.reviews-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.rating-summary {
  margin-top: 2rem;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.5rem;
  color: #ffd700;
}

.star.filled {
  color: #ffd700;
}

.star.interactive {
  cursor: pointer;
  transition: color 0.3s ease;
}

.star.interactive:hover {
  color: #ffed4e;
}

.total-reviews {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.reviews-list-section {
  padding: 100px 0;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.review-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.reviewer-info {
  display: flex;
  gap: 1rem;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  overflow: hidden;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-details h3 {
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.review-service {
  color: #667eea;
  font-size: 0.9rem;
}

.verified-badge {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.review-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.review-date {
  color: #666;
  font-size: 0.8rem;
}

.review-content {
  line-height: 1.6;
}

.leave-review-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.review-form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.rating-input {
  display: flex;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .review-header {
    flex-direction: column;
    gap: 1rem;
  }
}`;
  }

  getChatCSS() {
    return `/* Chat Page Styles */
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.chat-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.chat-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.support-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.support-avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.support-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #10b981;
}

.status-indicator.offline {
  background: #ef4444;
}

.support-details h2 {
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.status {
  color: #666;
  font-size: 0.9rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 0;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.message {
  display: flex;
  max-width: 70%;
}

.message.user {
  align-self: flex-end;
  justify-content: flex-end;
}

.message.support {
  align-self: flex-start;
}

.message-content {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 6px;
}

.message.support .message-content {
  border-bottom-left-radius: 6px;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.message.user .message-meta {
  color: rgba(255, 255, 255, 0.8);
}

.timestamp {
  font-size: 0.8rem;
}

.status {
  font-size: 0.8rem;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.5rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.quick-replies {
  padding: 1rem 0;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.quick-replies-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.quick-reply-btn {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.quick-reply-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chat-input {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 0;
}

.message-form {
  max-width: 800px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    max-width: 85%;
  }

  .quick-replies-list {
    flex-direction: column;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .message-input {
    border-radius: 8px;
  }

  .send-btn {
    border-radius: 8px;
    align-self: stretch;
  }
}`;
  }

  getAuthCSS() {
    return `/* Auth Pages Styles (Login, Register, Profile) */
.login-page,
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container,
.register-container {
  width: 100%;
  max-width: 400px;
}

.login-form-wrapper,
.register-form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header,
.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1,
.register-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.login-header p,
.register-header p {
  color: #666;
}

.login-form,
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.forgot-link,
.terms-link,
.privacy-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover,
.terms-link:hover,
.privacy-link:hover {
  text-decoration: underline;
}

.btn-large {
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
}

.login-divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  color: #666;
  font-size: 0.9rem;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
  z-index: 1;
}

.login-divider span {
  background: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-login {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.social-btn:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.google-btn span {
  font-weight: bold;
  color: #4285f4;
}

.github-btn span {
  color: #1877f2;
}

.login-footer,
.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.register-link,
.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover,
.login-link:hover {
  text-decoration: underline;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .social-login {
    flex-direction: column;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}`;
  }

  getProfileCSS() {
    return `/* Profile Page Styles */
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-sidebar {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.profile-avatar {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-avatar img,
.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.avatar-placeholder {
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 1rem;
}

.avatar-upload {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.avatar-upload:hover {
  background: #5a67d8;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #1a1a1a;
  margin: 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group p {
  margin: 0;
  padding: 12px 0;
  color: #333;
  border-bottom: 1px solid transparent;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.security-item:hover {
  border-color: #667eea;
}

.security-info h3 {
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.security-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .security-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }
}`;
  }

  getTestimonialsCSS() {
    return `/* Testimonials Page Styles */
.testimonials-page {
  min-height: 100vh;
}

.testimonials-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.testimonials-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.featured-testimonial {
  padding: 100px 0;
  background: #f8f9fa;
}

.featured-testimonial-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.testimonial-content {
  position: relative;
}

.quote-icon {
  font-size: 4rem;
  color: #667eea;
  position: absolute;
  top: -2rem;
  left: -1rem;
  font-family: serif;
}

.testimonial-text {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #333;
  font-style: italic;
  margin-bottom: 1.5rem;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.2rem;
  color: #ffd700;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h3 {
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.author-info p {
  color: #666;
  margin: 0.25rem 0;
}

.all-testimonials {
  padding: 100px 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.testimonial-header .author-avatar {
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  margin-bottom: 0;
  margin-right: 1rem;
}

.testimonial-header .author-info {
  flex: 1;
}

.testimonial-header .author-info h3 {
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.testimonial-header .author-info p {
  font-size: 0.9rem;
  color: #666;
}

.testimonial-header .testimonial-rating {
  flex-shrink: 0;
}

.testimonial-content p {
  line-height: 1.6;
  color: #333;
  font-style: italic;
}

.testimonials-stats {
  padding: 100px 0;
  background: #1a1a1a;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 2rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.testimonials-cta {
  padding: 100px 0;
  background: #f8f9fa;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.cta-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .featured-testimonial-card {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .testimonials-hero h1 {
    font-size: 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }
}`;
  }

  getGenericCSS(feature) {
    return `/* ${this.capitalize(feature)} Page Styles */
.${feature}-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.${feature}-page .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.${feature}-page h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  text-align: center;
}

.${feature}-page p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.${feature}-page .content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .${feature}-page h1 {
    font-size: 2rem;
  }

  .${feature}-page .container {
    padding: 0 15px;
  }
}`;
  }

  /**
   * Capitalize first letter of string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Security template (placeholder)
   */
  getSecurityTemplate(context) {
    return `import React from 'react';
import './Security.css';

const Security: React.FC = () => {
  return (
    <div className="security-page">
      <div className="container">
        <h1>Security Settings</h1>
        <p>Manage your security preferences and settings</p>
        <div className="content">
          <p>Security features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Security;`;
  }

  /**
   * Portfolio template (placeholder)
   */
  getPortfolioTemplate(context) {
    return `import React from 'react';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  return (
    <div className="portfolio-page">
      <div className="container">
        <h1>Portfolio</h1>
        <p>Explore our work and projects</p>
        <div className="content">
          <p>Portfolio showcase coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;`;
  }

  /**
   * Blog template (placeholder)
   */
  getBlogTemplate(context) {
    return `import React from 'react';
import './Blog.css';

const Blog: React.FC = () => {
  return (
    <div className="blog-page">
      <div className="container">
        <h1>Blog</h1>
        <p>Read our latest articles and insights</p>
        <div className="content">
          <p>Blog posts coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;`;
  }

  /**
   * E-commerce template (placeholder)
   */
  getEcommerceTemplate(context) {
    return `import React from 'react';
import './Ecommerce.css';

const Ecommerce: React.FC = () => {
  return (
    <div className="ecommerce-page">
      <div className="container">
        <h1>Shop</h1>
        <p>Browse our products and services</p>
        <div className="content">
          <p>E-commerce features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;`;
  }

  /**
   * Security CSS
   */
  getSecurityCSS() {
    return this.getGenericCSS("security");
  }

  /**
   * Portfolio CSS
   */
  getPortfolioCSS() {
    return this.getGenericCSS("portfolio");
  }

  /**
   * Blog CSS
   */
  getBlogCSS() {
    return this.getGenericCSS("blog");
  }

  /**
   * E-commerce CSS
   */
  getEcommerceCSS() {
    return this.getGenericCSS("ecommerce");
  }
}
