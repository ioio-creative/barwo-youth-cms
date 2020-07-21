import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import SendHistoriesContext from 'contexts/sendHistories/sendHistoriesContext';
import SendHistoriesPageContainer from 'components/sendhistory/sendHistoryPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import useFilterForTable from 'components/layout/Table/useFilterForTable';
import LinkButton from 'components/form/LinkButton';
import Button from 'components/form/Button';
import InputText from 'components/form/InputText';
import Form from 'components/form/Form';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import SendHistory from 'models/sendHistory';
import Alert from 'models/alert';

const defaultInitialSortBy = 'label';
const defaultInitialSortOrder = 1;

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
  },
  {
    name: uiWordings['SendHistory.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['SendHistory.TitleTcLabel'],
    value: 'title_tc',
    isSortEnabled: true
  },
  {
    name: uiWordings['SendHistory.TitleScLabel'],
    value: 'title_sc',
    isSortEnabled: true
  },
  {
    name: uiWordings['SendHistory.TitleEnLabel'],
    value: 'title_en',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['SendHistory.MessageTcLabel'],
  //   value: 'message_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['SendHistory.MessageScLabel'],
  //   value: 'message_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['SendHistory.MessageEnLabel'],
  //   value: 'message_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['SendHistory.SendDTLabel'],
    value: 'SendDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['SendHistory.SenderLabel'],
    value: 'SenderDisplay',
    isSortEnabled: true
  }
];

const SendHistoryList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    sendHistories,
    sendHistoriesPaginationMeta,
    sendHistoriesLoading,
    sendHistoriesErrors,
    clearSendHistoriesErrors,
    getSendHistories
  } = useContext(SendHistoriesContext);
  const {
    // qsPage: { qsPage, setQsPage },
    // qsSortOrder: { qsSortOrder, setQsSortOrder },
    // qsSortBy: { qsSortBy, setQsSortBy },
    // currPage: { currPage, setCurrPage },
    currSortParams: { currSortParams /*, setCurrSortParams*/ },
    prepareGetOptions: prepareGetOptionsForPaginationAndSort,
    onSetPage,
    onSetSortParams
  } = usePaginationAndSortForTable(
    defaultInitialSortBy,
    defaultInitialSortOrder,
    SendHistory.cleanSortByString
  );
  const {
    isUseFilter,
    setIsUseFilter,
    prepareGetOptions: prepareGetOptionsForFilter,
    filterText,
    setFilterText,
    turnOnFilter,
    turnOffFilter
  } = useFilterForTable();

  // componentDidMount
  useEffect(
    _ => {
      return _ => {
        removeAlerts();
      };
    },
    // eslint-disable-next-line
    []
  );

  // set query string and getSendHistories
  useEffect(
    _ => {
      getSendHistories(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getSendHistories]
  );

  // filter and getSendHistories
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getSendHistories(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getSendHistories
    ]
  );

  // sendHistoriesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(sendHistoriesErrors)) {
        setAlerts(
          sendHistoriesErrors.map(sendHistoryError => {
            return new Alert(
              SendHistory.sendHistoryResponseTypes[sendHistoryError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearSendHistoriesErrors();
      }
    },
    [sendHistoriesErrors, setAlerts, clearSendHistoriesErrors]
  );

  /* event handlers */

  const onView = useCallback(sendHistory => {
    goToUrl(routes.sendHistoryViewByIdWithValue(true, sendHistory._id));
  }, []);

  const onFilterChange = useCallback(
    e => {
      setFilterText(e.target.value);
    },
    [setFilterText]
  );

  /* end of event handlers */

  const rows = useMemo(
    _ => {
      return addIdx(
        getArraySafe(sendHistories).map(SendHistory.getSendHistoryForDisplay)
      );
    },
    [sendHistories]
  );

  if (sendHistories === null || sendHistoriesLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['SendHistoryList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['SendHistoryList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['SendHistoryList.ClearFilterButton']}
            </Button>
          </div>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={sendHistoriesPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onView}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const SendHistoryListWithContainer = _ => (
  <SendHistoriesPageContainer>
    <SendHistoryList />
  </SendHistoriesPageContainer>
);

export default SendHistoryListWithContainer;
