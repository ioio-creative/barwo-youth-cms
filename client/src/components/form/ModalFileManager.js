import React, { useCallback, useState, useEffect } from 'react';
import Modal from 'components/layout/Modal';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTextAreaPair from 'components/form/LabelTextAreaPair';
import FileUpload from 'components/form/FileUpload';
import uiWordings from 'globals/uiWordings';
import Medium from 'models/medium';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import FileManager from 'components/form/FileManager';

// const defaultState = emptyPageMeta;

const mediumTypes = Medium.mediumTypes;

const ModalFileManager = ({ title = "File Manager", contentLabel = "File Manager", onSelect, multiple, mediaTypeParam }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSelectReturn = (e) => {
    onSelect(e);
    setIsModalOpen(false);
  }
  return (
    <Modal className='w3-margin-left' contentLabel={contentLabel} isOpen={isModalOpen} setParentIsOpen={setIsModalOpen} >
      <h4>{title}</h4>
      <FileManager onSelect={onSelectReturn} multiple={multiple} mediaTypeParam={mediaTypeParam} />
    </Modal>
  );
};

// ModalFileManager.defaultProps = {
//   pageMeta: defaultState
// };

export default ModalFileManager;
