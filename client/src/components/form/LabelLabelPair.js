import React from 'react';
import Label from './Label';
import InputText from './InputText';

const LabelLabelPair = ({ value, labelMessage, isHalf }) => {
  return (
    <div className='w3-row w3-section'>
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
