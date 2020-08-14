import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewslettersContext from 'contexts/newsletters/newslettersContext';
import NewslettersPageContainer from 'components/newsletters/NewslettersPageContainer';
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
import Newsletter from 'models/newsletter';
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
    name: uiWordings['Newsletter.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.OrderLabel'],
    value: 'orderDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.TitleTcLabel'],
    value: 'title_tc',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.TitleScLabel'],
    value: 'title_sc',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.TitleEnLabel'],
    value: 'title_en',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Newsletter.MessageTcLabel'],
  //   value: 'message_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Newsletter.MessageScLabel'],
  //   value: 'message_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Newsletter.MessageEnLabel'],
  //   value: 'message_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Newsletter.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Newsletter.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const NewsletterList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsletters,
    newslettersPaginationMeta,
    newslettersLoading,
    newslettersErrors,
    clearNewslettersErrors,
    getNewsletters
  } = useContext(NewslettersContext);
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
    Newsletter.cleanSortByString
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

  // set query string and getNewsletters
  useEffect(
    _ => {
      getNewsletters(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getNewsletters]
  );

  // filter and getNewsletters
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getNewsletters(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getNewsletters
    ]
  );

  // newslettersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newslettersErrors)) {
        setAlerts(
          newslettersErrors.map(newsletterError => {
            return new Alert(
              Newsletter.newslettersResponseTypes[newsletterError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewslettersErrors();
      }
    },
    [newslettersErrors, setAlerts, clearNewslettersErrors]
  );

  /* event handlers */

  const onEdit = useCallback(newsletter => {
    goToUrl(routes.newsletterEditByIdWithValue(true, newsletter._id));
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
        getArraySafe(newsletters).map(Newsletter.getNewsletterForDisplay)
      );
    },
    [newsletters]
  );

  if (newsletters === null || newslettersLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['NewsletterList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['NewsletterList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['NewsletterList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton
            className='w3-margin-right'
            to={routes.sendHistoryList(true)}
          >
            {uiWordings['NewsletterList.SendHistoryList']}
          </LinkButton>
          <LinkButton
            className='w3-margin-right'
            to={routes.newsletterOrder(true)}
          >
            {uiWordings['NewsletterList.NewslettersOrder']}
          </LinkButton>
          <LinkButton to={routes.newsletterAdd(true)}>
            {uiWordings['NewsletterList.AddNewsletter']}
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={newslettersPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const NewsletterListWithContainer = _ => (
  <NewslettersPageContainer>
    <NewsletterList />
  </NewslettersPageContainer>
);

export default NewsletterListWithContainer;
