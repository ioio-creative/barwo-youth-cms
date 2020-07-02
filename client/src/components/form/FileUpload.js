import React, { useCallback, useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';
import Medium from 'models/medium';

/* globals */

const defaultMediumFileType = Medium.mediumTypes.IMAGE;
let mediumFileType = defaultMediumFileType;

/* end of globals */

/* constants */

const emptyFileForAdd = {};

const mapFileToListItem = file => {
  return {
    ...file,
    draggableId: file.draggableId || file._id || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 500
});

/* end of constants */

/* item */

const Item = ({ file, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newFile => {
      handleItemChange(newFile, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newFile = {
        ...file,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newFile);
    },
    [file, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { draggableId } = file;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          className='w3-row'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {/* <div className='w3-col m11 w3-row'>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_tc'
                value={scenarist_tc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.TcPlaceholder']}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_sc'
                value={scenarist_sc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.ScPlaceholder']}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_en'
                value={scenarist_en}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.EnPlaceholder']}
              />
            </div>
          </div> */}
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
    _ => {
      dealWithGetFiles([...getArraySafe(files), emptyFileForAdd]);
    },
    [files, dealWithGetFiles]
  );

  /* end of methods */

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      window.getMediaData = ({ file }) => {
        console.log(file);
        window.getMediaData = null;
      };

      window.open(
        generatePath(routes.fileManager, {
          fileType: mediumType.apiRoute
        })
      );

      //addFile();
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
    <LabelSortableListPair
      name={name}
      labelMessage={labelMessage}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={filesInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

FileUpload.defaultProps = {
  name: 'files',
  mediumType: defaultMediumFileType,
  isMultiple: false
};

export default FileUpload;
