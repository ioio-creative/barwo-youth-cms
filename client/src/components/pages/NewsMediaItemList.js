import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewsMediaItemsContext from 'contexts/newsMediaItems/newsMediaItemsContext';
import NewsMediaItemsPageContainer from 'components/newsMediaItems/NewsMediaItemsPageContainer';
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
import NewsMediaItem from 'models/newsMediaItem';
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
    name: uiWordings['NewsMediaItem.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaItem.NameTcLabel'],
    value: 'name_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['NewsMediaItem.NameScLabel'],
  //   value: 'name_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaItem.NameEnLabel'],
  //   value: 'name_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['NewsMediaItem.TypeLabel'],
    value: 'typeDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaItem.FromDateLabel'],
    value: 'fromDateDisplay',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['NewsMediaItem.DescTcLabel'],
  //   value: 'desc_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaItem.DescScLabel'],
  //   value: 'desc_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaItem.DescEnLabel'],
  //   value: 'desc_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['NewsMediaItem.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['NewsMediaItem.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaItem.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['NewsMediaItem.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const NewsMediaItemList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsMediaItems,
    newsMediaItemsPaginationMeta,
    newsMediaItemsLoading,
    newsMediaItemsErrors,
    clearNewsMediaItemsErrors,
    getNewsMediaItems
  } = useContext(NewsMediaItemsContext);
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
    NewsMediaItem.cleanSortByString
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

  // set query string and getNewsMediaItems
  useEffect(
    _ => {
      getNewsMediaItems(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getNewsMediaItems]
  );

  // filter and getNewsMediaItems
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getNewsMediaItems(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getNewsMediaItems
    ]
  );

  // newsMediaItemsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newsMediaItemsErrors)) {
        setAlerts(
          newsMediaItemsErrors.map(newsMediaItemsError => {
            return new Alert(
              NewsMediaItem.newsMediaItemsResponseTypes[
                newsMediaItemsError
              ].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewsMediaItemsErrors();
      }
    },
    [newsMediaItemsErrors, setAlerts, clearNewsMediaItemsErrors]
  );

  /* event handlers */

  const onEdit = useCallback(newsMediaItem => {
    goToUrl(routes.newsMediaItemEditByIdWithValue(true, newsMediaItem._id));
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
        getArraySafe(newsMediaItems).map(
          NewsMediaItem.getNewsMediaItemForDisplay
        )
      );
    },
    [newsMediaItems]
  );

  if (newsMediaItems === null || newsMediaItemsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['NewsMediaItemList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['NewsMediaItemList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['NewsMediaItemList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton to={routes.newsMediaItemAdd(true)}>
            {uiWordings['NewsMediaItemList.AddNewsMediaItem']}
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={newsMediaItemsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const NewsMediaItemListWithContainer = _ => (
  <NewsMediaItemsPageContainer>
    <NewsMediaItemList />
  </NewsMediaItemsPageContainer>
);

export default NewsMediaItemListWithContainer;
