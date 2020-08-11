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
const MyModal = ({
  isOpenButtonSection,
  openButtonClassName,
  openButtonColor,
  openButtonTextColor,
  isOpen,
  setParentIsOpen,
  contentLabel,
  openButtonChildren,
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(
    _ => {
      setIsModalOpen(isOpen);
    },
    [isOpen]
  );

  useEffect(
    _ => {
      invokeIfIsFunction(setParentIsOpen, isModalOpen);
    },
    [isModalOpen, setParentIsOpen]
  );

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
      <Button
        className={openButtonClassName}
        color={openButtonColor}
        textColor={openButtonTextColor}
        onClick={openModal}
        isSection={isOpenButtonSection}
      >
        {openButtonChildren || contentLabel}
      </Button>
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
  openButtonClassName: '',
  isOpen: false,
  /* String indicating how the content container should be announced
     to screenreaders */
  contentLabel: 'Modal'
};

export default MyModal;
