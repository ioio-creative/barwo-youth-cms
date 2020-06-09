import React from 'react';
import { Table } from '@buffetjs/core';

const headers = [
  {
    name: 'Id',
    value: 'id',
    isSortEnabled: true
  },
  {
    name: 'First name',
    value: 'firstname',
    isSortEnabled: true
  },
  {
    name: 'Last name',
    value: 'lastname',
    isSortEnabled: true
  },
  {
    name: 'Best recipe',
    value: 'recipe',
    isSortEnabled: true
  },
  {
    name: 'Main restaurant',
    value: 'restaurant',
    isSortEnabled: true
  }
];

const rows = [
  {
    id: 1,
    firstname: 'Pierre',
    lastname: 'Gagnaire',
    recipe: 'Ratatouille',
    restaurant: 'Le Gaya'
  },
  {
    id: 2,
    firstname: 'Georges',
    lastname: 'Blanc',
    recipe: 'Beef bourguignon',
    restaurant: 'Le Georges Blanc'
  },
  {
    id: 3,
    firstname: 'Mars',
    lastname: 'Veyrat',
    recipe: 'Lemon Chicken',
    restaurant: 'La Ferme de mon père'
  }
];

// https://buffetjs.io/storybook/?path=/story/components-table--complex
const MyTable = ({
  headers,
  rows,
  customRow,
  sortBy,
  sortOrder,
  onDetailClick,
  onChangeSort
}) => {
  const rowLinks = onDetailClick
    ? [
        {
          icon: <i className='fa fa-pencil-square-o' />,
          onClick: onDetailClick
        }
      ]
    : null;
  return (
    <Table
      headers={headers}
      rows={rows}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onClickRow={(e, data) => {
        console.log('onClickRow');
        onDetailClick && onDetailClick(data);
      }}
      onChangeSort={({
        sortBy,
        firstElementThatCanBeSorted,
        isSortEnabled
      }) => {
        console.log('onChangeSort');
        onChangeSort && onChangeSort({ sortBy, isSortEnabled });
      }}
      rowLinks={rowLinks}
    />
  );
};

MyTable.defaultProps = {
  headers,
  rows,
  onDetailClick: data => {
    console.log(data);
  }
};

export default MyTable;
