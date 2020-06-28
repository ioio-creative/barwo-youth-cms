import React from 'react';
import GroupContainer from 'components/layout/GroupContainer';

const Form = ({ className, onSubmit, children, isCard }) => {
  return (
    <GroupContainer className={className} isCard={isCard}>
      <form onSubmit={onSubmit}>{children}</form>
    </GroupContainer>
  );
};

export default Form;
