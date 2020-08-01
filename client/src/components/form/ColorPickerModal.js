import React from 'react';
import Modal from 'components/layout/Modal';
import ColorPicker from './ColorPicker';

const openButtonTextColor = 'black';

const ColorPickerModal = ({
  name,
  value,
  labelMessage,
  onChange,
  colorPickerWidth
}) => {
  return (
    <Modal
      openButtonColor={value || ColorPicker.defaultValue}
      openButtonTextColor={openButtonTextColor}
      contentLabel={labelMessage}
    >
      <ColorPicker
        name={name}
        value={value}
        onChange={onChange}
        width={colorPickerWidth}
      />
    </Modal>
  );
};

export default ColorPickerModal;
