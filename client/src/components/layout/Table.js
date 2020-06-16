import React, { useCallback, useMemo } from 'react';
import mapSortOrderStrToNum from 'utils/array/mapSortOrderStrToNum';
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
  onPageClick,
  setSortParamsFunc
}) => {
  const rowLinks = onDetailClick
    ? [
        {
          icon: <i className='fa fa-pencil-square-o' />,
          onClick: onDetailClick
        }
      ]
    : null;

  /* methods */

  const changeSort = useMemo(
    _ => MyTable.helperGenerators.changeSort(setSortParamsFunc),
    [setSortParamsFunc]
  );

  /* end of methods */

  /* event handlers */

  const onChangeSort = useMemo(
    _ => MyTable.helperGenerators.onChangeSort(changeSort),
    [changeSort]
  );

  const onFirstPageClick = useCallback(
    _ => {
      onPageClick(1);
    },
    [onPageClick]
  );

  const onPrevPageClick = useCallback(
    _ => {
      onPageClick(paginationMeta.page - 1);
    },
    [onPageClick, paginationMeta]
  );

  const onNextPageClick = useCallback(
    _ => {
      onPageClick(paginationMeta.page + 1);
    },
    [onPageClick, paginationMeta]
  );

  const onLastPageClick = useCallback(
    _ => {
      onPageClick(paginationMeta.totalPages);
    },
    [onPageClick, paginationMeta]
  );

  /* end of event handlers */

  const firstPageBtnExtraProps = {};
  const prevPageBtnExtraProps = {};
  const nextPageBtnExtraProps = {};
  const lastPageBtnExtraProps = {};

  let isEnableFirstPageBtn;
  let isEnablePrevPageBtn;
  let isEnableNextPageBtn;
  let isEnableLastPageBtn;

  if (paginationMeta) {
    isEnableFirstPageBtn = paginationMeta.page !== 1;
    if (!isEnableFirstPageBtn) {
      firstPageBtnExtraProps.disabled = true;
    }

    isEnablePrevPageBtn = paginationMeta.hasPrevPage;
    if (!isEnablePrevPageBtn) {
      prevPageBtnExtraProps.disabled = true;
    }

    isEnableNextPageBtn = paginationMeta.hasNextPage;
    if (!isEnableNextPageBtn) {
      nextPageBtnExtraProps.disabled = true;
    }

    isEnableLastPageBtn = paginationMeta.page < paginationMeta.totalPages;
    if (!isEnableLastPageBtn) {
      lastPageBtnExtraProps.disabled = true;
    }
  }

  //console.log(paginationMeta);

  return (
    <div className='my-table'>
      <div className='w3-margin-bottom'>
        <Table
          headers={headers}
          rows={rows}
          sortBy={sortBy}
          sortOrder={mapSortOrderStrToNum(sortOrder)}
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
      {paginationMeta && (
        <div className='pagination w3-margin-bottom'>
          <button
            className={`${isEnableFirstPageBtn ? '' : 'w3-disabled'}`}
            onClick={onFirstPageClick}
            {...firstPageBtnExtraProps}
          >
            |&lt;
          </button>
          <button
            className={`${isEnablePrevPageBtn ? '' : 'w3-disabled'}`}
            onClick={onPrevPageClick}
            {...prevPageBtnExtraProps}
          >
            &lt;
          </button>
          {new Array(paginationMeta.totalPages)
            .fill(undefined)
            .map((_, idx) => {
              const page = idx + 1;
              const isSelected = page === paginationMeta.page;
              return (
                <button
                  key={page}
                  className={`${isSelected ? 'active' : ''}`}
                  onClick={_ => onPageClick(page)}
                >
                  {page}
                </button>
              );
            })}
          <button
            className={`${isEnableNextPageBtn ? '' : 'w3-disabled'}`}
            onClick={onNextPageClick}
            {...nextPageBtnExtraProps}
          >
            &gt;
          </button>
          <button
            className={`${isEnableLastPageBtn ? '' : 'w3-disabled'}`}
            onClick={onLastPageClick}
            {...lastPageBtnExtraProps}
          >
            &gt;|
          </button>
        </div>
      )}
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
          if (currSortParams.sortOrder === 1) {
            return {
              ...currSortParams,
              sortOrder: -1
            };
          } else {
            return {
              ...currSortParams,
              sortOrder: 1
            };
          }
        } else {
          return {
            sortBy: newSortBy,
            sortOrder: 1
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
  }
};

export default MyTable;
