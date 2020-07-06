import React, { useCallback, useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';
import Medium from 'models/medium';
import './FileUpload.css';

/* constants */

const mediumTypes = Medium.mediumTypes;

const mapFileToListItem = file => {
  return {
    ...file,
    draggableId: file.draggableId || file._id || guid()
  };
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto'
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

  const { name, alternativeText, type, /*tags,*/ url, draggableId } = file;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          className='file-upload-item'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className='w3-third'>
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
                  AUDIO: <i className='fa fa-volume-up fa-2x' />,
                  PDF: <i className='fa fa-file-pdf-o fa-2x' />
                }[type]
              }
            </div>
          </div>
          <div className='w3-right'>
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

  const addFile = useCallback(
    file => {
      dealWithGetFiles([...getArraySafe(files), file]);
    },
    [files, dealWithGetFiles]
  );

  /* end of methods */

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      window.getMediaData = ({ medium: file }) => {
        console.log(file);
        addFile(file);
        window.getMediaData = null;
      };

      window.open(
        generatePath(routes.fileManager, {
          fileType: mediumType.apiRoute
        })
      );
    },
    [addFile, mediumType]
  );

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
        name={name}
        labelMessage={labelMessage}
        pickedItemRender={itemRender}
        getListStyle={getListStyle}
        pickedItems={filesInPickedList}
        getPickedItems={onGetPickedItems}
        onAddButtonClick={onAddButtonClick}
      />
    </div>
  );
};

FileUpload.defaultProps = {
  name: 'files',
  mediumType: mediumTypes.IMAGE,
  onGetFiles: files => {
    console.log(files);
  },
  isMultiple: false
};

export default FileUpload;
