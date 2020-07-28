import React, { useCallback } from 'react';
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

const ModalFileManager = ({ title = "File Manager", onSelect, multiple }) => {

  return (
    <Modal contentLabel={title}>
      <h4>{title}</h4>
      <FileManager />
    </Modal>
  );
};

// ModalFileManager.defaultProps = {
//   pageMeta: defaultState
// };

export default ModalFileManager;
