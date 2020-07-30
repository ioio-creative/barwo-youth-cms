import React, { useState } from 'react';
import Modal from 'components/layout/Modal';
import FileManager from 'components/form/FileManager';

const ModalFileManager = ({
  title = 'File Manager',
  contentLabel = 'File Manager',
  onSelect,
  multiple,
  mediaTypeParam
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSelectReturn = e => {
    onSelect(e);
    setIsModalOpen(false);
  };
  return (
    <Modal
      className='w3-margin-left'
      contentLabel={contentLabel}
      isOpen={isModalOpen}
      setParentIsOpen={setIsModalOpen}
    >
      <h4>{title}</h4>
      <FileManager
        onSelect={onSelectReturn}
        multiple={multiple}
        mediaTypeParam={mediaTypeParam}
      />
    </Modal>
  );
};

export default ModalFileManager;
