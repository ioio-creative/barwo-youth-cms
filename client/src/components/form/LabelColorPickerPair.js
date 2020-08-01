import React from 'react';
import Modal from 'components/layout/Modal';
import Label from './Label';
import ColorPicker from './ColorPicker';
import uiWordings from 'globals/uiWordings';

const colorIndicatorHeight = 25;
const colorIndicatorWidth = colorIndicatorHeight * 2;
const colorIndicatorStyle = {
  width: colorIndicatorWidth,
  height: colorIndicatorHeight,
  verticalAlign: 'middle'
};

const ColorIndicator = ({ value }) => {
  // https://www.w3schools.com/graphics/svg_rect.asp
  return (
    <svg className='w3-margin-left' style={colorIndicatorStyle}>
      <rect
        style={{
          width: colorIndicatorWidth,
          height: colorIndicatorHeight,
          fill: value,
          strokeWidth: 3,
          stroke: 'rgb(0,0,0)'
        }}
      />
    </svg>
  );
};

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
        <ColorIndicator value={value} />
        <Modal
          openButtonClassName='w3-margin-left'
          contentLabel={uiWordings['LabelColorPickerPair.OpenButton']}
        >
          <ColorPicker
            name={name}
            value={value}
            onChange={onChange}
            width={colorPickerWidth}
          />
        </Modal>
      </div>
    </div>
  );
};

LabelColorPickerPair.defaultProps = {
  isHalf: true
};

export default LabelColorPickerPair;
