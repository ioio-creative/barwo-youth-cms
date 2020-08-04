import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewsMediaGroupsContext from 'contexts/newsMediaGroups/newsMediaGroupsContext';
import NewsMediaGroupsPageContainer from 'components/newsMediaGroups/NewsMediaGroupsPageContainer';
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
import NewsMediaGroup from 'models/newsMediaGroup';
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
    name: uiWordings['NewsMediaGroup.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaGroup.OrderLabel'],
    value: 'orderDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaGroup.NameTcLabel'],
    value: 'name_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['NewsMediaGroup.NameScLabel'],
  //   value: 'name_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaGroup.NameEnLabel'],
  //   value: 'name_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaGroup.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['NewsMediaGroup.YearLabel'],
    value: 'yearDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaGroup.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaGroup.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaGroup.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const NewsMediaGroupList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsMediaGroups,
    newsMediaGroupsPaginationMeta,
    newsMediaGroupsLoading,
    newsMediaGroupsErrors,
    clearNewsMediaGroupsErrors,
    getNewsMediaGroups
  } = useContext(NewsMediaGroupsContext);
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
    NewsMediaGroup.cleanSortByString
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

  // set query string and getNewsMediaGroups
  useEffect(
    _ => {
      getNewsMediaGroups(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getNewsMediaGroups]
  );

  // filter and getNewsMediaGroups
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getNewsMediaGroups(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getNewsMediaGroups
    ]
  );

  // newsMediaGroupsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newsMediaGroupsErrors)) {
        setAlerts(
          newsMediaGroupsErrors.map(newsMediaGroupsError => {
            return new Alert(
              NewsMediaGroup.newsMediaGroupsResponseTypes[
                newsMediaGroupsError
              ].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewsMediaGroupsErrors();
      }
    },
    [newsMediaGroupsErrors, setAlerts, clearNewsMediaGroupsErrors]
  );

  /* event handlers */

  const onEdit = useCallback(newsMediaGroup => {
    goToUrl(routes.newsMediaGroupEditByIdWithValue(true, newsMediaGroup._id));
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
        getArraySafe(newsMediaGroups).map(
          NewsMediaGroup.getNewsMediaGroupForDisplay
        )
      );
    },
    [newsMediaGroups]
  );

  if (newsMediaGroups === null || newsMediaGroupsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['NewsMediaGroupList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['NewsMediaGroupList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['NewsMediaGroupList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton
            className='w3-margin-right'
            to={routes.newsMediaGroupsOrder(true)}
          >
            {uiWordings['NewsMediaGroupList.NewsMediaGroupsOrder']}
          </LinkButton>
          <LinkButton to={routes.newsMediaGroupAdd(true)}>
            {uiWordings['NewsMediaGroupList.AddNewsMediaGroup']}
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={newsMediaGroupsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const NewsMediaGroupListWithContainer = _ => (
  <NewsMediaGroupsPageContainer>
    <NewsMediaGroupList />
  </NewsMediaGroupsPageContainer>
);

export default NewsMediaGroupListWithContainer;
