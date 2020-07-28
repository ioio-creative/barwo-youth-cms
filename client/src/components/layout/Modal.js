import React, { useCallback, useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from 'components/form/Button';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

// http://reactcommunity.org/react-modal/styles/
const customModalStyles = {
  overlay: {
    zIndex: 2
  }
};

// http://reactcommunity.org/react-modal/
const MyModal = ({ className = '', isOpen = false, contentLabel, children, setParentIsOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  /* methods */

  const openModal = useCallback(_ => {
    setIsModalOpen(true);
  }, []);

  // const afterOpenModal = useCallback(_ => {
  // }, []);

  const closeModal = useCallback(_ => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    invokeIfIsFunction(setParentIsOpen, isModalOpen);
    // setParentIsOpen(isModalOpen);
  }, [isModalOpen]);
  /* end of methods */

  return (
    <>
      <Button className={className} onClick={openModal}>{contentLabel}</Button>
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
