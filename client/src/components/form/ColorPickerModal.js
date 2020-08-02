import React from 'react';
import Modal from 'components/layout/Modal';
import ColorPicker from './ColorPicker';
import { complementColorOfHex } from 'utils/color';

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
      openButtonTextColor={complementColorOfHex(value) || 'black'}
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
