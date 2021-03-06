import React, { useState, useCallback } from 'react';
import Modal from 'components/layout/Modal';
import Alerts from 'components/layout/Alerts';
import FileManager from 'components/form/FileManager';
import uiWordings from 'globals/uiWordings';

const ModalFileManager = ({
  title,
  isOpenButtonSection,
  openButtonChildren,
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
      isOpenButtonSection={isOpenButtonSection}
      openButtonClassName='w3-margin-left'
      isOpen={isModalOpen}
      setParentIsOpen={setIsModalOpen}
      contentLabel={title}
      openButtonChildren={openButtonChildren}
    >
      <Alerts />
      {title && <h4>{title}</h4>}
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
