import React from 'react';
import Modal from 'components/layout/Modal';
import PageMetaEdit from './PageMetaEdit';
import uiWordings from 'globals/uiWordings';

const PageMetaEditWithModal = ({
  pageMeta,
  setPageMetaFunc,
  isHideOptionalFields
}) => {
  const title = uiWordings['PageMeta.Title'];
  return (
    <Modal contentLabel={title}>
      <PageMetaEdit
        pageMeta={pageMeta}
        setPageMetaFunc={setPageMetaFunc}
        title={title}
        isHideOptionalFields={isHideOptionalFields}
      />
    </Modal>
  );
};

export default PageMetaEditWithModal;
