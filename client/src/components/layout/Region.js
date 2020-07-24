import React from 'react';

const Region = ({ title, children, isMarginBottom }) => {
  return (
    <div
      className={`w3-card w3-container ${isMarginBottom ? 'w3-section' : ''}`}
    >
      {title && <h4>{title}</h4>}
      {children}
    </div>
  );
};

Region.defaultProps = {
  isMarginBottom: true
};

export default Region;
