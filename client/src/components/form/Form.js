import React from 'react';

const Form = ({ className, onSubmit, children, isCard }) => {
  return (
    <form
      className={`${
        isCard ? 'w3-card-4' : ''
      } w3-light-grey w3-text-blue w3-section ${className}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

Form.defaultProps = {
  className: '',
  isCard: false
};

export default Form;
