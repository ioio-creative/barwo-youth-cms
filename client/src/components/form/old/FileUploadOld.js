import React, { useCallback, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import ModalFileManager from 'components/form/ModalFileManager';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';
import Medium from 'models/medium';
import './FileUploadOld.css';

/* constants */

const mapFileToListItem = file => {
  return {
    ...file,
    // Note: can't use file._id here as users may choose a file more than once??
    draggableId: file.draggableId /*|| file._id*/ || guid()
  };
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',
  position: 'relative',

  // width: '100%',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
  flexWrap: 'wrap'
});

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

  const { /*name,*/ alternativeText, type, /*tags,*/ url, draggableId } = file;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          className='file-upload-item w3-third'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className='medium-wrapper'>
            {
              {
                IMAGE: (
                  <img
                    className='media-preview'
                    src={url}
                    alt={alternativeText}
                  />
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
                  <audio
                    className='media-preview'
                    src={url}
                    alt={alternativeText}
                    controls
                    controlsList='nodownload'
                  />
                ),
                PDF: (
                  <div className='media-preview pdf'>
                    <i className='fa fa-file-pdf-o fa-2x'></i>
                  </div>
                )
              }[type]
            }
          </div>
          <div className='close-btn'>
            {isFunction(handleItemRemoved) ? (
              <LabelSortableListPair.ItemRemoveButton
                onClick={onRemoveButtonClick}
              />
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const itemRender = (
  { handleItemRemoved, handleItemChange, ...file },
  index
) => {
  return (
    <Item
      key={index}
      file={file}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
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
  isMultiple,
  orderDirection
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
    <div className='file-upload'>
      <LabelSortableListPair
        isHalf={false}
        isShowAddButton={
          isMultiple || getArraySafe(filesInPickedList).length === 0
        }
        addButtonRender={addButtonRender}
        name={name}
        labelMessage={labelMessage}
        pickedItemRender={itemRender}
        getListStyle={getListStyle}
        pickedItems={filesInPickedList}
        getPickedItems={onGetPickedItems}
        orderDirection={orderDirection}
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
