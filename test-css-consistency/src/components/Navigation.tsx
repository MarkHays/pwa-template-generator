import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Test Tech Company
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;