import React from 'react';
import Label from './Label';
import InputText from './InputText';

const LabelLabelPair = ({ value, labelMessage, isHalf }) => {
  return (
    <div className='w3-row'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label message={labelMessage} />
        <InputText value={value} disabled={true} />
      </div>
    </div>
  );
};

LabelLabelPair.defaultProps = {
  isHalf: true
};

export default LabelLabelPair;
