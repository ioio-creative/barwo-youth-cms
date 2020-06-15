import React from 'react';
import { Table } from '@buffetjs/core';
import './Table.css';

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
  paginationMeta,
  sortBy,
  sortOrder,
  onDetailClick,
  onChangeSort,
  onPageClick
}) => {
  const rowLinks = onDetailClick
    ? [
        {
          icon: <i className='fa fa-pencil-square-o' />,
          onClick: onDetailClick
        }
      ]
    : null;
  console.log(paginationMeta);
  return (
    <div className='my-table'>
      <div className='w3-margin-bottom'>
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
      </div>
      {/* https://www.w3schools.com/css/tryit.asp?filename=trycss_ex_pagination_border_round*/}
      <div className='pagination w3-margin-bottom'>
        {
          paginationMeta.hasPrevPage &&
          <a href="#" disabled>&laquo;</a>
        }
        {
          new Array(paginationMeta.totalPages).fill(undefined).map((_, idx) => {
            const page = idx + 1;
            const isSelected = page === paginationMeta.page;
            return (
              <a className={`${isSelected ? 'active' : ''}`} onClick={_ => onPageClick(page)}>{page}</a>
            );
          })
        }
        {
          paginationMeta.hasNextPage && 
          <a href="#">&raquo;</a>
        }
      </div>
    </div>
  );
};

MyTable.defaultProps = {
  headers,
  rows,
  paginationMeta: null,
  onDetailClick: data => {
    console.log(data);
  }  
};

MyTable.helperGenerators = {
  changeSort: function (setSortParams) {
    return function ({ newSortBy }) {
      setSortParams(currSortParams => {
        if (currSortParams.sortBy === newSortBy) {
          if (currSortParams.sortOrder === 'asc') {
            return {
              ...currSortParams,
              sortOrder: 'desc'
            };
          } else {
            return {
              ...currSortParams,
              sortOrder: 'asc'
            };
          }
        } else {
          return {
            sortBy: newSortBy,
            sortOrder: 'asc'
          };
        }
      });
    };
  },

  onChangeSort: function (changeSort) {
    return function ({ sortBy, isSortEnabled }) {
      if (isSortEnabled) {
        changeSort({
          newSortBy: sortBy
        });
      }
    };
  },

  onDetailClick: function (onEditClick) {
    return function (data) {
      onEditClick(data);
    };
  }
}

export default MyTable;
