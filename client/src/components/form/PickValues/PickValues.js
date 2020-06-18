import React from 'react';
import Label from 'components/form/Label';
import SelectForPickValues from './SelectForPickValues';

const PickValues = ({
  labelMessage,
  valueData,
  selectedValueIds,
  textPlaceHolder,
  textValue,
  onTextChange
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label message={labelMessage} />
        <SelectForPickValues />
        {/**https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd */}
      </div>
    </div>
  );
};

export default PickValues;
