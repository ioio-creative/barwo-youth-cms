import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import AlertContext from 'contexts/alert/alertContext';
import SendHistoriesContext from 'contexts/sendHistories/sendHistoriesContext';
import SendHistoriesPageContainer from 'components/sendhistory/sendHistoryPageContainer';
import LinkButton from 'components/form/LinkButton';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import useFilterForTable from 'components/layout/Table/useFilterForTable';
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
    value: 'sendDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['SendHistory.SenderLabel'],
    value: 'senderDisplay',
    isSortEnabled: true
  }
];

const SendHistoryList = ({ filter = undefined }) => {
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

  // TODO:
  useEffect(
    _ => {
      if (filter !== undefined && !isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          filterText: filter
        };
        // console.log(getOptions);
        getSendHistories(getOptions);
      }
    },
    [
      filter,
      isUseFilter,
      getSendHistories,
      prepareGetOptionsForPaginationAndSort
    ]
  );

  // filter and getSendHistories
  const lastFilterText = useRef(filterText);
  useEffect(
    _ => {
      let getOptions = {};

      if (isUseFilter || filterText) {
        getOptions = {
          ...getOptions,
          ...prepareGetOptionsForFilter()
        };
        setIsUseFilter(false);
      }

      // useEffect caused by pagination and sort
      if (lastFilterText.current === filterText) {
        getOptions = {
          ...getOptions,
          ...prepareGetOptionsForPaginationAndSort()
        };

        getSendHistories(getOptions);
      }

      lastFilterText.current = filterText;
    },
    [
      filterText,
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

  const backToNewsletterListButton = (
    <LinkButton to={routes.newsletterList(true)}>
      {uiWordings['NewsletterEdit.BackToNewsletterList']}
    </LinkButton>
  );

  return (
    <>
      {filter === undefined && (
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
          <div className='w3-right'>{backToNewsletterListButton}</div>
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
      )}
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

const SendHistoryListWithContainer = ({ filter }) => (
  <SendHistoriesPageContainer>
    <SendHistoryList filter={filter} />
  </SendHistoriesPageContainer>
);

export default SendHistoryListWithContainer;
