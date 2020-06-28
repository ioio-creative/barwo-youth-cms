import React from 'react';

const GroupContainer = ({ className, children, isCard }) => {
  return (
    <div
      className={`${
        isCard ? 'w3-card-4' : ''
      } w3-light-grey w3-text-blue w3-section ${className} w3-container`}
    >
      {children}
    </div>
  );
};

GroupContainer.defaultProps = {
  className: '',
  isCard: false
};

export default GroupContainer;
