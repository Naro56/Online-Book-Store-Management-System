import React from 'react';

// Default background image for the entire application
const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

const BackgroundImage = ({ children, imageUrl = DEFAULT_BACKGROUND, overlay = true }) => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${DEFAULT_BACKGROUND})`
      }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundImage;