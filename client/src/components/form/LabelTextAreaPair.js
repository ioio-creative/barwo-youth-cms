import React from 'react';
import Label from './Label';
import TextArea from './TextArea';

const LabelTextAreaPair = ({
  name,
  value,
  labelMessage,
  placeholder,
  onChange,
  wrap,
  textAreaStyle,
  required,
  maxLength,
  disabled,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />{' '}
        {required === true ? '*' : ''}
        <TextArea
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          wrap={wrap}
          style={textAreaStyle}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

LabelTextAreaPair.defaultProps = {
  isHalf: false
};

LabelTextAreaPair.twoRowStyle = TextArea.twoRowStyle;
LabelTextAreaPair.threeRowStyle = TextArea.threeRowStyle;

export default LabelTextAreaPair;
