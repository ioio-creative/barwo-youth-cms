import React, { useMemo, useCallback /*, useEffect*/ } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
//import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';

/* constants */

const emptyPriceForAdd = {
  price_tc: '',
  price_sc: '',
  price_en: ''
};

const mapPriceToListItem = price => {
  return {
    ...price,
    draggableId: price.draggableId || price._id || guid()
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

const Item = ({ price, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newPrice => {
      handleItemChange(newPrice, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newPrice = {
        ...price,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newPrice);
    },
    [price, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { price_tc, price_sc, price_en, draggableId } = price;

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
          <div className='w3-col m11 w3-row'>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='price_tc'
                value={price_tc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Price.PriceTcPlaceholder']}
                required={true}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='price_sc'
                value={price_sc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Price.PriceScPlaceholder']}
                required={true}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='price_en'
                value={price_en}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Price.PriceEnPlaceholder']}
                required={true}
              />
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
  { handleItemRemoved, handleItemChange, ...price },
  index
) => {
  return (
    <Item
      key={index}
      price={price}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditPriceSelect = ({ prices, onGetPrices }) => {
  const pricesInPickedList = useMemo(
    _ => {
      return getArraySafe(prices).map(mapPriceToListItem);
    },
    [prices]
  );

  /* methods */

  const dealWithGetPrices = useCallback(
    newItemList => {
      onGetPrices(newItemList);
    },
    [onGetPrices]
  );

  const addPrice = useCallback(
    _ => {
      dealWithGetPrices([...getArraySafe(prices), emptyPriceForAdd]);
    },
    [prices, dealWithGetPrices]
  );

  /* end of methods */

  // // prices
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(prices)) {
  //       addPrice();
  //     }
  //   },
  //   [prices, addPrice]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addPrice();
    },
    [addPrice]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetPrices(newItemList);
    },
    [dealWithGetPrices]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='prices'
      labelMessage={uiWordings['Event.PricesLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={pricesInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default EventEditPriceSelect;
