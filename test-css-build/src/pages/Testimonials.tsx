import React from 'react';
import './pages.css';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const testimonialData = [
    
    {
      id: 1,
      content: "Outstanding service and attention to detail!",
      author: "Customer 1",
      role: "Satisfied Client",
      rating: 5
    },
    {
      id: 2,
      content: "Professional, reliable, and trustworthy.",
      author: "Customer 2",
      role: "Satisfied Client",
      rating: 5
    },
    {
      id: 3,
      content: "They exceeded our expectations in every way.",
      author: "Customer 3",
      role: "Satisfied Client",
      rating: 5
    },
    {
      id: 4,
      content: "Highly recommend for quality work.",
      author: "Customer 4",
      role: "Satisfied Client",
      rating: 5
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>What Our Clients Say</h1>
        <p className="page-subtitle">Hear from satisfied customers</p>
      </div>

      <div className="container">
        <div className="testimonials-grid">
          {testimonialData.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="stars">{'★'.repeat(testimonial.rating)}</div>
              <p>"{testimonial.content}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;