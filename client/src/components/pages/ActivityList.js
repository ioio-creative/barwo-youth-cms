import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import ActivitiesPageContainer from 'components/activities/ActivitiesPageContainer';
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
import Activity from 'models/activity';
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
    name: uiWordings['Activity.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.NameTcLabel'],
    value: 'name_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Activity.NameScLabel'],
  //   value: 'name_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.NameEnLabel'],
  //   value: 'name_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Activity.TypeLabel'],
    value: 'typeDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.FromDateLabel'],
    value: 'fromDateDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.ToDateLabel'],
    value: 'toDateDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.LocationTcLabel'],
    value: 'location_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Activity.LocationScLabel'],
  //   value: 'location_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.LocationEnLabel'],
  //   value: 'location_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.DescTcLabel'],
  //   value: 'desc_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.DescScLabel'],
  //   value: 'desc_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.DescEnLabel'],
  //   value: 'desc_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Activity.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Activity.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Activity.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const ActivityList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    activities,
    activitiesPaginationMeta,
    activitiesLoading,
    activitiesErrors,
    clearActivitiesErrors,
    getActivities
  } = useContext(ActivitiesContext);
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
    Activity.cleanSortByString
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

  // set query string and getActivities
  useEffect(
    _ => {
      getActivities(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getActivities]
  );

  // filter and getActivities
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getActivities(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getActivities
    ]
  );

  // activitiesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(activitiesErrors)) {
        setAlerts(
          activitiesErrors.map(activitiesError => {
            return new Alert(
              Activity.activitiesResponseTypes[activitiesError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearActivitiesErrors();
      }
    },
    [activitiesErrors, setAlerts, clearActivitiesErrors]
  );

  /* event handlers */

  const onEdit = useCallback(activity => {
    goToUrl(routes.activityEditByIdWithValue(true, activity._id));
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
        getArraySafe(activities).map(Activity.getActivityForDisplay)
      );
    },
    [activities]
  );

  if (activities === null || activitiesLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['ActivityList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['ActivityList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['ActivityList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton to={routes.activityAdd(true)}>
            {uiWordings['ActivityList.AddActivity']}
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={activitiesPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const ActivityListWithContainer = _ => (
  <ActivitiesPageContainer>
    <ActivityList />
  </ActivitiesPageContainer>
);

export default ActivityListWithContainer;
