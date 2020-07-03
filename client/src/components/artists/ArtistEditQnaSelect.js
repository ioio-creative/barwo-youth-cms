import React, { useMemo, useCallback /*, useEffect*/ } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import TextArea from 'components/form/TextArea';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
//import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';

/* constants */

const emptyQnaForAdd = {
  question_tc: '',
  answer_tc: '',
  question_sc: '',
  answer_sc: '',
  question_en: '',
  answer_en: ''
};

const mapQnaToListItem = qna => {
  return {
    ...qna,
    draggableId: qna.draggableId || qna._id || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 650
});

/* end of constants */

/* item */

const Item = ({ qna, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newQna => {
      handleItemChange(newQna, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newQna = {
        ...qna,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newQna);
    },
    [qna, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const {
    question_tc,
    answer_tc,
    question_sc,
    answer_sc,
    question_en,
    answer_en,
    draggableId
  } = qna;

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
          <div className='w3-col m11'>
            <div className='w3-row'>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='question_tc'
                  value={question_tc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['ArtistEdit.Qna.QuestionTcPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='answer_tc'
                  value={answer_tc}
                  onChange={onChange}
                  placeholder={uiWordings['ArtistEdit.Qna.AnswerTcPlaceholder']}
                  required={true}
                />
              </div>
            </div>
            <div className='w3-row'>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='question_sc'
                  value={question_sc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['ArtistEdit.Qna.QuestionScPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='answer_sc'
                  value={answer_sc}
                  onChange={onChange}
                  placeholder={uiWordings['ArtistEdit.Qna.AnswerScPlaceholder']}
                  required={true}
                />
              </div>
            </div>
            <div className='w3-row'>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='question_en'
                  value={question_en}
                  onChange={onChange}
                  placeholder={
                    uiWordings['ArtistEdit.Qna.QuestionEnPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <TextArea
                  className='w3-margin-right'
                  name='answer_en'
                  value={answer_en}
                  onChange={onChange}
                  placeholder={uiWordings['ArtistEdit.Qna.AnswerEnPlaceholder']}
                  required={true}
                />
              </div>
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

const itemRender = ({ handleItemRemoved, handleItemChange, ...qna }, index) => {
  return (
    <Item
      key={index}
      qna={qna}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const ArtistEditQnaSelect = ({ qnas, onGetQnas }) => {
  const qnasInPickedList = useMemo(
    _ => {
      return getArraySafe(qnas).map(mapQnaToListItem);
    },
    [qnas]
  );

  /* methods */

  const dealWithGetQnas = useCallback(
    newItemList => {
      onGetQnas(newItemList);
    },
    [onGetQnas]
  );

  const addQna = useCallback(
    _ => {
      dealWithGetQnas([...getArraySafe(qnas), emptyQnaForAdd]);
    },
    [qnas, dealWithGetQnas]
  );

  /* end of methods */

  // // qnas
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(qnas)) {
  //       addQna();
  //     }
  //   },
  //   [qnas, addQna]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addQna();
    },
    [addQna]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetQnas(newItemList);
    },
    [dealWithGetQnas]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='qnas'
      labelMessage={uiWordings['Artist.QnasLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={qnasInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default ArtistEditQnaSelect;
