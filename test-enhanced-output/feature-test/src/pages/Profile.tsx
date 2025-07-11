import React from 'react';
import './Page.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>
        <p>Welcome to our profile page</p>
        <div className="page-content">
          <p>This is the comprehensive profile page content.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;