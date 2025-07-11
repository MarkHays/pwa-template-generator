import React, { useState } from 'react';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const sampleImages: GalleryItem[] = [
  { id: 1, src: '/images/gallery/image1.jpg', alt: 'Gallery Image 1', title: 'Project 1', category: 'work' },
  { id: 2, src: '/images/gallery/image2.jpg', alt: 'Gallery Image 2', title: 'Project 2', category: 'work' },
  { id: 3, src: '/images/gallery/image3.jpg', alt: 'Gallery Image 3', title: 'Team Photo', category: 'team' },
  { id: 4, src: '/images/gallery/image4.jpg', alt: 'Gallery Image 4', title: 'Office Space', category: 'office' },
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'work', 'team', 'office'];
  const filteredImages = filter === 'all' ? sampleImages : sampleImages.filter(img => img.category === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gallery</h1>
        <p className="page-subtitle">Explore our work and achievements</p>
      </div>

      <div className="container">
        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
              <div className="gallery-overlay">
                <h3>{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="modal-backdrop" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <h3>{selectedImage.title}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;