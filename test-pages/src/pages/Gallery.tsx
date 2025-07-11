import React from 'react';
import './pages.css';

const Gallery: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gallery</h1>
        <p className="page-subtitle">Explore our work and achievements</p>
      </div>

      <div className="container">
        <div className="page-content">
          <p>Welcome to the gallery page.</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;