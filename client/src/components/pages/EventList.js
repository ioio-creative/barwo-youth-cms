import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { useRouteMatch } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import EventsContext from 'contexts/events/eventsContext';
import EventsPageContainer from 'components/events/EventsPageContainer';
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
import Event from 'models/event';
import Alert from 'models/alert';

const eventTypes = Event.eventTypes;

const defaultInitialSortBy = 'label';
const defaultInitialSortOrder = 1;

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
  },
  {
    name: uiWordings['Event.LabelLabel'],
    value: 'label',
    isSortEnabled: true
  },
  {
    name: uiWordings['Event.NameTcLabel'],
    value: 'name_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Event.NameScLabel'],
  //   value: 'name_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.NameEnLabel'],
  //   value: 'name_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescHeadlineTcLabel'],
  //   value: 'descHeadline_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescHeadlineScLabel'],
  //   value: 'descHeadline_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescHeadlineEnLabel'],
  //   value: 'descHeadline_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescTcLabel'],
  //   value: 'desc_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescScLabel'],
  //   value: 'desc_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.DescEnLabel'],
  //   value: 'desc_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.RemarksTcLabel'],
  //   value: 'remarks_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.RemarksScLabel'],
  //   value: 'remarks_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.RemarksEnLabel'],
  //   value: 'remarks_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Event.ArtDirectorsLabel'],
    value: 'artDirectorsDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Event.ArtistsLabel'],
    value: 'artistsDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Event.ShowsLabel'],
    value: 'showsDisplay',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Event.ScenaristsLabel'],
  //   value: 'scenaristsDisplay',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.VenueTcLabel'],
  //   value: 'venue_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.VenueScLabel'],
  //   value: 'venue_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.VenueEnLabel'],
  //   value: 'venue_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.PricesLabel'],
  //   value: 'pricesDisplay',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.PriceRemarksTcLabel'],
  //   value: 'priceRemarks_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.PriceRemarksScLabel'],
  //   value: 'priceRemarks_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.PriceRemarksEnLabel'],
  //   value: 'priceRemarks_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.PhonesLabel'],
  //   value: 'phonesDisplay',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.TicketUrlLabel'],
  //   value: 'ticketUrl',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.ThemeColorLabel'],
  //   value: 'themeColor',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Event.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Event.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Event.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const EventList = _ => {
  const isCommunityPerformance = Boolean(
    useRouteMatch(routes.communityPerformanceList(false))
  );

  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    events,
    eventsPaginationMeta,
    eventsLoading,
    eventsErrors,
    clearEventsErrors,
    getEvents
  } = useContext(EventsContext);
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
    Event.cleanSortByString
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

  /* methods */

  const getEventsWithType = useCallback(
    getOptions => {
      const extendedGetOptions = { ...getOptions };
      if (isCommunityPerformance) {
        extendedGetOptions.type = eventTypes.COMMUNITY_PERFORMANCE.value;
      }
      getEvents(extendedGetOptions);
    },
    [isCommunityPerformance, getEvents]
  );

  /* end of methods */

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

  // filter and getEvents
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

        getEventsWithType(getOptions);
      }

      lastFilterText.current = filterText;
    },
    [
      filterText,
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getEventsWithType
    ]
  );

  // eventsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(eventsErrors)) {
        setAlerts(
          eventsErrors.map(eventsError => {
            return new Alert(
              Event.eventsResponseTypes[eventsError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearEventsErrors();
      }
    },
    [eventsErrors, setAlerts, clearEventsErrors]
  );

  /* event handlers */

  const onEdit = useCallback(
    event => {
      goToUrl(
        isCommunityPerformance
          ? routes.communityPerformanceEditByIdWithValue(true, event._id)
          : routes.eventEditByIdWithValue(true, event._id)
      );
    },
    [isCommunityPerformance]
  );

  const onFilterChange = useCallback(
    e => {
      setFilterText(e.target.value);
    },
    [setFilterText]
  );

  /* end of event handlers */

  const rows = useMemo(
    _ => {
      return addIdx(getArraySafe(events).map(Event.getEventForDisplay));
    },
    [events]
  );

  if (events === null || eventsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={
              uiWordings[
                `${
                  isCommunityPerformance
                    ? 'CommunityPerformanceList.FilterTextPlaceHolder'
                    : 'EventList.FilterTextPlaceHolder'
                }`
              ]
            }
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['EventList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['EventList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton
            to={
              isCommunityPerformance
                ? routes.communityPerformanceAdd(true)
                : routes.eventAdd(true)
            }
          >
            {
              uiWordings[
                `${
                  isCommunityPerformance
                    ? 'CommunityPerformanceList.AddCommunityPerformance'
                    : 'EventList.AddEvent'
                }`
              ]
            }
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={eventsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const EventListWithContainer = _ => (
  <EventsPageContainer>
    <EventList />
  </EventsPageContainer>
);

export default EventListWithContainer;
