import React, { useCallback, useMemo } from 'react';
import ModalFileManager from 'components/form/ModalFileManager';
import InputText from 'components/form/InputText';
import Button from 'components/form/Button';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import uiWordings from 'globals/uiWordings';
import Medium from 'models/medium';
import './SimpleFileUpload.css';

const SimpleFileUpload = ({ buttonLabel, mediumType, file, onGetFile }) => {
  const isFilePicked = useMemo(
    _ => {
      return Boolean(file && file.url);
    },
    [file]
  );

  /* event handlers */

  const handleFileUrlClick = useCallback(
    _ => {
      if (isFilePicked) {
        window.open(file.url);
      }
    },
    [isFilePicked, file]
  );

  const handleRemoveFile = useCallback(
    _ => {
      onGetFile(null);
    },
    [onGetFile]
  );

  const handleSelect = useCallback(
    newFiles => {
      onGetFile(firstOrDefault(newFiles, null));
    },
    [onGetFile]
  );

  /* end of event handlers */

  return (
    <div className='simple-file-upload'>
      <div
        className={`w3-col m7 ${isFilePicked ? 'file-url-on' : ''}`}
        onClick={handleFileUrlClick}
      >
        <InputText
          value={
            isFilePicked
              ? file.url
              : uiWordings['SimpleFileUpload.UrlPlaceholder']
          }
          disabled={true}
        />
      </div>

      <Button
        isSection={false}
        className={`w3-margin-left ${!isFilePicked ? 'w3-hide' : ''}`}
        onClick={handleRemoveFile}
      >
        {uiWordings['SimpleFileUpload.RemoveFile']}
      </Button>
      <ModalFileManager
        //className='w3-margin-left'
        isOpenButtonSection={false}
        title=''
        openButtonChildren={buttonLabel}
        mediumType={mediumType}
        onSelect={handleSelect}
      />
    </div>
  );
};

SimpleFileUpload.defaultProps = {
  buttonLabel: uiWordings['SimpleFileUpload.PickFile'],
  mediumType: Medium.defaultMediumType,
  onGetFile: file => {
    console.log(file);
  }
};

export default SimpleFileUpload;
