import React from 'react';

const Reviews: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Customer Reviews</h1>
        <p className="page-subtitle">See what others are saying</p>
      </div>

      <div className="container">
        <div className="reviews-stats">
          <div className="stat-card">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">127</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>

        <div className="reviews-list">
          <div className="review-card">
            <div className="review-header">
              <span className="review-rating">★★★★★</span>
              <span className="review-date">2 days ago</span>
            </div>
            <p className="review-content">Excellent service and professional team!</p>
            <div className="review-author">John Smith</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;