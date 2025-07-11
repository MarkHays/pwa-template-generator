import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-subtitle">Welcome to our profile page</p>
      </div>

      <div className="container">
        <div className="page-content">
          <p>This is the profile page content.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;