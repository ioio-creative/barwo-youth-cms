import { useCallback, useState } from 'react';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

const usePaginationAndSortForTable = (
  defaultInitialSortBy,
  defaultInitialSortOrder,
  clearnSortByStringFunc
) => {
  // query strings
  const [qsPage, setQsPage] = useQueryParam('page', NumberParam);
  const [qsSortBy, setQsSortBy] = useQueryParam('sortBy', StringParam);
  const [qsSortOrder, setQsSortOrder] = useQueryParam('sortOrder', NumberParam);

  const [currPage, setCurrPage] = useState(qsPage);
  const [currSortParams, setCurrSortParams] = useState({
    sortOrder: qsSortOrder,
    sortBy: qsSortBy
  });

  /* methods */

  const prepareGetOptions = useCallback(
    _ => {
      const getOptions = {
        page: currPage || 1
      };

      setQsPage(currPage);

      if (currSortParams) {
        const currSortOrder =
          currSortParams.sortOrder || defaultInitialSortOrder;
        const currSortBy = invokeIfIsFunction(
          clearnSortByStringFunc,
          currSortParams.sortBy || defaultInitialSortBy
        );
        setQsSortOrder(currSortOrder);
        setQsSortBy(currSortBy);
        getOptions.sortOrder = currSortOrder;
        getOptions.sortBy = currSortBy;
      }

      return getOptions;
    },
    [
      currPage,
      currSortParams,
      setQsPage,
      setQsSortOrder,
      setQsSortBy,
      clearnSortByStringFunc,
      defaultInitialSortOrder,
      defaultInitialSortBy
    ]
  );

  /* end of methods */

  /* event handlers */

  const onSetPage = useCallback(
    pageNum => {
      setCurrPage(pageNum);
    },
    [setCurrPage]
  );

  const onSetSortParams = useCallback(
    sortParams => {
      if (
        currSortParams.sortOrder === sortParams.sortOrder &&
        currSortParams.sortBy === sortParams.sortBy
      ) {
        return;
      }
      // sort from page 1
      setCurrPage(1);
      setCurrSortParams(sortParams);
    },
    [currSortParams, setCurrSortParams, setCurrPage]
  );

  /* end of event handlers */

  return {
    qsPage: { qsPage, setQsPage },
    qsSortOrder: { qsSortOrder, setQsSortOrder },
    qsSortBy: { qsSortBy, setQsSortBy },
    currPage: { currPage, setCurrPage },
    currSortParams: { currSortParams, setCurrSortParams },
    prepareGetOptions,
    onSetPage,
    onSetSortParams
  };
};

export default usePaginationAndSortForTable;
