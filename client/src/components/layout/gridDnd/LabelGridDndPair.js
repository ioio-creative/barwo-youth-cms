import React from 'react';
import Label from 'components/form/Label';
import Button from 'components/form/Button';
import GridDnd from './GridDnd';
import isFunction from 'utils/js/function/isFunction';

const LabelGridDndPair = ({
  isHalf,
  isShowAddButton,
  addButtonRender,
  isUseRemove,
  labelMessage,
  onAddButtonClick,
  items,
  onChange,
  itemRender,
  gridBackgroundColor
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label message={labelMessage} />
        {isShowAddButton && (
          <>
            {isFunction(addButtonRender) ? (
              addButtonRender()
            ) : (
              <Button className='w3-margin-left' onClick={onAddButtonClick}>
                <i className='fa fa-plus' />
              </Button>
            )}
          </>
        )}
        <GridDnd
          items={items}
          onChange={onChange}
          itemRender={itemRender}
          backgroundColor={gridBackgroundColor}
          isUseRemove={isUseRemove}
        />
      </div>
    </div>
  );
};

LabelGridDndPair.defaultProps = {
  isHalf: true,
  isShowAddButton: true,
  items: [],
  onChange: items => {
    console.log(items);
  },
  onAddButtonClicked: _ => {
    console.log('LabelGridDndPair add button clicked.');
  }
};

LabelGridDndPair.ItemRemoveButton = GridDnd.ItemRemoveButton;

export default LabelGridDndPair;
