import React from 'react';
import Label from './Label';
import ColorPicker from './ColorPicker';

const LabelColorPickerPair = ({
  name,
  value,
  labelMessage,
  onChange,
  colorPickerWidth,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <ColorPicker
          name={name}
          value={value}
          onChange={onChange}
          width={colorPickerWidth}
        />
      </div>
    </div>
  );
};

LabelColorPickerPair.defaultProps = {
  isHalf: true
};

export default LabelColorPickerPair;
