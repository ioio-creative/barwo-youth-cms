import { useCallback, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

const emptyFilter = {
  text: ''
};

const useFilterForTable = () => {
  // query strings
  const [qsFilterText, setQsFilterText] = useQueryParam(
    'filterText',
    StringParam
  );

  // states
  const [isUseFilter, setIsUseFilter] = useState(true); // allow first time filter by query string value
  const [filter, setFilter] = useState({ text: qsFilterText });

  /* methods */

  const prepareGetOptions = useCallback(
    _ => {
      const getOptions = {};
      // allow empty string here
      if (![null, undefined].includes(filter.text)) {
        setQsFilterText(filter.text);
        getOptions.filterText = filter.text;
      }
      return getOptions;
    },
    [filter, setQsFilterText]
  );

  const setFilterText = useCallback(
    text => {
      setFilter({
        ...filter,
        text: text
      });
    },
    [filter, setFilter]
  );

  const turnOnFilter = useCallback(
    _ => {
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

  const filterText = filter.text;

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
