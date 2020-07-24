import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Button from 'components/form/Button';

// http://reactcommunity.org/react-modal/styles/
const customModalStyles = {
  overlay: {
    zIndex: 2
  }
};

// http://reactcommunity.org/react-modal/
const MyModal = ({ contentLabel, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* methods */

  const openModal = useCallback(_ => {
    setIsModalOpen(true);
  }, []);

  // const afterOpenModal = useCallback(_ => {
  // }, []);

  const closeModal = useCallback(_ => {
    setIsModalOpen(false);
  }, []);

  /* end of methods */

  return (
    <>
      <Button onClick={openModal}>{contentLabel}</Button>
      <Modal
        isOpen={isModalOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel={contentLabel}
      >
        {children}
      </Modal>
    </>
  );
};

MyModal.defaultProps = {
  /* String indicating how the content container should be announced
     to screenreaders */
  contentLabel: 'Modal'
};

export default MyModal;
