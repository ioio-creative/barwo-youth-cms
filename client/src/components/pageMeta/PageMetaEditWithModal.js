import React from 'react';
import Modal from 'components/layout/Modal';
import PageMetaEdit from './PageMetaEdit';
import uiWordings from 'globals/uiWordings';

const PageMetaEditWithModal = ({ pageMeta, setPageMetaFunc }) => {
  return (
    <Modal contentLabel={uiWordings['PageMeta.Title']}>
      <PageMetaEdit pageMeta={pageMeta} setPageMetaFunc={setPageMetaFunc} />
    </Modal>
  );
};

export default PageMetaEditWithModal;
