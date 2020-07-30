import React, { useState, useCallback } from 'react';
import Modal from 'components/layout/Modal';
import FileManager from 'components/form/FileManager';
import uiWordings from 'globals/uiWordings';

const ModalFileManager = ({
  title,
  contentLabel,
  onSelect,
  isMultiple,
  mediumType
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSelectReturn = useCallback(
    e => {
      onSelect(e);
      setIsModalOpen(false);
    },
    [onSelect]
  );

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
        multiple={isMultiple}
        mediumType={mediumType}
      />
    </Modal>
  );
};

ModalFileManager.defaultProps = {
  title: uiWordings['FileManager.Title'],
  contentLabel: uiWordings['FileManager.Title']
};

export default ModalFileManager;
