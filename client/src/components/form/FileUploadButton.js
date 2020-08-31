import React, { useCallback, useRef } from 'react';
import Button from './Button';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import './FileUploadButton.css';

const FileUploadButton = ({
  className,
  color,
  textColor,
  icon,
  label,
  disabled,
  multiple,
  onFilesChange
}) => {
  const fileInput = useRef(null);

  const handleButtonClick = useCallback(_ => {
    fileInput.current.click();
  }, []);

  const handleFileInputChange = useCallback(
    e => {
      // e.target.files is FileList object
      onFilesChange(getArraySafe(Array.from(e.target.files)));
    },
    [onFilesChange]
  );

  const extraProps = {};
  if (disabled === true) {
    extraProps.disabled = true;
  }
  if (multiple === true) {
    extraProps.multiple = true;
  }

  return (
    <Button
      color={color}
      textColor={textColor}
      className={`file-upload-button ${className}`}
      icon={icon}
      disabled={disabled}
      onClick={handleButtonClick}
    >
      {label}{' '}
      <input
        ref={fileInput}
        type='file'
        onChange={handleFileInputChange}
        {...extraProps}
      />
    </Button>
  );
};

FileUploadButton.defaultProps = {};

export default FileUploadButton;
