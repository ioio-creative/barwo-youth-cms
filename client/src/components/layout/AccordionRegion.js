import React, { useState, useCallback } from 'react';

const AccordionRegion = ({ title, children, isMarginBottom }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionButtonClick = useCallback(e => {
    e.preventDefault();
    setIsOpen(prevState => !prevState);
  }, []);

  return (
    <div className={`w3-card ${isMarginBottom ? 'w3-section' : ''}`}>
      <button
        className='w3-button w3-block w3-left-align'
        onClick={handleAccordionButtonClick}
      >
        {title}{' '}
        <i
          className={`w3-margin-left fa ${
            isOpen ? 'fa-caret-square-o-up' : 'fa-caret-square-o-down'
          }`}
        />
      </button>
      <div className={`w3-container ${isOpen ? '' : 'w3-hide'}`}>
        {children}
      </div>
    </div>
  );
};

AccordionRegion.defaultProps = {
  title: 'Accordion Region',
  isMarginBottom: true
};

export default AccordionRegion;
