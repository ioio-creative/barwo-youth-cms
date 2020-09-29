import React from 'react';

const Anchor = ({ href, children, className, isTargetBlank }) => {
  const extraProps = {};
  if (isTargetBlank) {
    extraProps.target = '_blank';
    extraProps.rel = 'noopener noreferrer';
  }
  return (
    <a href={href} className={className} {...extraProps}>
      {children}
    </a>
  );
};

Anchor.defaultProps = {
  className: '',
  isTargetBlank: true
};

export default Anchor;
