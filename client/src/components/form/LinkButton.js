import React, { useCallback } from 'react';
import Button from './Button';
import { goToUrl } from 'utils/history';

/**
 * !!!Important!!!
 * Dependent on Button component
 */
const LinkButton = ({
  className,
  color,
  textColor,
  icon,
  children,
  disabled,
  to
}) => {
  const onClick = useCallback(
    _ => {
      goToUrl(to);
    },
    [to]
  );
  return (
    <Button
      color={color}
      textColor={textColor}
      className={className}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

LinkButton.defaultProps = {
  className: '',
  color: 'blue',
  textColor: 'white',
  icon: null,
  to: '/'
};

export default LinkButton;
