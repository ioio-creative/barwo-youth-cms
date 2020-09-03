import React, { useCallback, useMemo } from 'react';
import LabelGridDndPair from 'components/layout/gridDnd/LabelGridDndPair';
import ModalFileManager from 'components/form/ModalFileManager';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';
import Medium from 'models/medium';
import './FileUpload.css';

/* constants */

const gridBackgroundColor = 'rgba(64, 201, 178, 1)';

const mapFileToListItem = file => {
  return {
    ...file,
    // Note: can't use file._id here as users may choose a file more than once??
    draggableId: file.draggableId || guid()
  };
};

/* end of constants */

/* item */

const Item = ({ file, handleItemRemoved, index }) => {
  /* event handlers */

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { name, alternativeText, type, /*tags,*/ url } = file;

  return (
    <div className='file-upload-item'>
      <div className='medium-wrapper'>
        {
          {
            IMAGE: (
              <img className='media-preview' src={url} alt={alternativeText} />
            ),
            VIDEO: (
              <video
                className='media-preview'
                src={url}
                alt={alternativeText}
                preload='metadata'
              />
            ),
            AUDIO: (
              <div className='media-preview'>
                <audio
                  src={url}
                  alt={alternativeText}
                  controls
                  controlsList='nodownload'
                />
              </div>
            ),
            PDF: (
              <div className='media-preview pdf'>
                <i className='fa fa-file-pdf-o fa-2x'></i>
              </div>
            )
          }[type]
        }
        <div className='media-name'>
          <a href={url}>{name}</a>
        </div>
      </div>
      <div className='close-btn'>
        {isFunction(handleItemRemoved) ? (
          <LabelGridDndPair.ItemRemoveButton onClick={onRemoveButtonClick} />
        ) : null}
      </div>
    </div>
  );
};

const itemRender = ({ handleItemRemoved, ...file }, index) => {
  return (
    <Item
      key={index}
      file={file}
      handleItemRemoved={handleItemRemoved}
      index={index}
    />
  );
};

/* end of item */

const FileUpload = ({
  name,
  labelMessage,
  files,
  onGetFiles,
  mediumType,
  isMultiple
}) => {
  const filesInPickedList = useMemo(
    _ => {
      return getArraySafe(files).map(mapFileToListItem);
    },
    [files]
  );

  /* methods */

  const dealWithGetFiles = useCallback(
    newItemList => {
      onGetFiles(newItemList);
    },
    [onGetFiles]
  );

  const addFiles = useCallback(
    newFiles => {
      dealWithGetFiles(getArraySafe(files).concat(getArraySafe(newFiles)));
    },
    [files, dealWithGetFiles]
  );

  const addButtonRender = useCallback(
    _ => {
      return (
        <ModalFileManager
          className='w3-margin-left'
          title={
            uiWordings[
              isMultiple
                ? 'FileUpload.TitleForMultipleUpload'
                : 'FileUpload.TitleForSingleUpload'
            ]
          }
          openButtonChildren={<i className='fa fa-plus' />}
          mediumType={mediumType}
          isMultiple={isMultiple}
          onSelect={addFiles}
        />
      );
    },
    [mediumType, isMultiple, addFiles]
  );

  /* end of methods */

  /* event handlers */

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetFiles(newItemList);
    },
    [dealWithGetFiles]
  );

  /* end of event handlers */

  return (
    <div className={`file-upload ${mediumType.apiRoute}`}>
      <LabelGridDndPair
        isHalf={false}
        isShowAddButton={
          isMultiple || getArraySafe(filesInPickedList).length === 0
        }
        addButtonRender={addButtonRender}
        labelMessage={labelMessage}
        items={filesInPickedList}
        itemRender={itemRender}
        onChange={onGetPickedItems}
        gridBackgroundColor={gridBackgroundColor}
      />
    </div>
  );
};

FileUpload.defaultProps = {
  name: 'files',
  mediumType: Medium.defaultMediumType,
  onGetFiles: files => {
    console.log(files);
  },
  isMultiple: false
};

export default FileUpload;
