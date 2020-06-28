import { useCallback, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

const emptyFilter = {
  filterText: ''
};

const useFilterForTable = _ => {
  // query strings
  const [qsFilterText, setQsFilterText] = useQueryParam(
    'filterText',
    StringParam
  );

  // states
  const [isUseFilter, setIsUseFilter] = useState(true); // allow first time filter by query string value
  const [filter, setFilter] = useState({ filterText: qsFilterText });

  /* methods */

  const prepareGetOptions = useCallback(
    _ => {
      const getOptions = {};
      const { filterText } = filter;
      // allow empty string here
      if (![null, undefined].includes(filterText)) {
        setQsFilterText(filterText);
        getOptions.filterText = filterText;
      }
      return getOptions;
    },
    [filter, setQsFilterText]
  );

  const setFilterText = useCallback(
    text => {
      setFilter({
        ...filter,
        filterText: text
      });
    },
    [filter, setFilter]
  );

  const turnOnFilter = useCallback(
    e => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      setIsUseFilter(true);
    },
    [setIsUseFilter]
  );

  const turnOffFilter = useCallback(
    _ => {
      setFilter(emptyFilter);
      setIsUseFilter(true);
    },
    [setFilter, setIsUseFilter]
  );

  /* end of methods */

  const { filterText } = filter;

  return {
    isUseFilter,
    setIsUseFilter,
    prepareGetOptions,
    filterText,
    setFilterText,
    turnOnFilter,
    turnOffFilter
  };
};

export default useFilterForTable;
