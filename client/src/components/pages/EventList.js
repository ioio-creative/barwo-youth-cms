import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import AlertContext from 'contexts/alert/alertContext';
import EventsContext from 'contexts/events/eventsContext';
import EventsPageContainer from 'components/events/EventsPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import LinkButton from 'components/form/LinkButton';
import Button from 'components/form/Button';
import InputText from 'components/form/InputText';
import Form from 'components/form/Form';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import Event from 'models/event';
import Alert from 'models/alert';

const defaultInitialSortBy = 'lastModifyDTDisplay';
const defaultInitialSortOrder = -1;

const emptyFilter = {
  text: ''
};

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
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
    name: uiWordings['Event.WriterTcLabel'],
    value: 'writer_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Event.WriterScLabel'],
  //   value: 'writer_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Event.WriterEnLabel'],
  //   value: 'writer_en',
  //   isSortEnabled: true
  // },
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
    prepareGetOptions,
    onSetPage,
    onSetSortParams
  } = usePaginationAndSortForTable(
    defaultInitialSortBy,
    defaultInitialSortOrder,
    Event.cleanSortByString
  );

  // query strings
  const [qsFilterText, setQsFilterText] = useQueryParam(
    'filterText',
    StringParam
  );

  // states
  const [isUseFilter, setIsUseFilter] = useState(true); // allow first time filter by query string value
  const [filter, setFilter] = useState({ text: qsFilterText });

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

  // set query string and getEvents
  useEffect(
    _ => {
      getEvents(prepareGetOptions());
    },
    [prepareGetOptions, getEvents]
  );

  // filter and getEvents
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = prepareGetOptions();
        // allow empty string here
        if (![null, undefined].includes(filter.text)) {
          setQsFilterText(filter.text);
          getOptions.filterText = filter.text;
        }
        getEvents(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      setQsFilterText,
      isUseFilter,
      setIsUseFilter,
      prepareGetOptions,
      getEvents,
      filter.text
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

  const onEditEvent = useCallback(event => {
    goToUrl(routes.eventEditByIdWithValue(true, event._id));
  }, []);

  const onFilterChange = useCallback(
    e => {
      setFilter({
        ...filter,
        [e.target.name]: e.target.value
      });
    },
    [filter, setFilter]
  );

  const onFilter = useCallback(
    _ => {
      setIsUseFilter(true);
    },
    [setIsUseFilter]
  );

  const onClearFilter = useCallback(_ => {
    setFilter(emptyFilter);
    setIsUseFilter(true);
  }, []);

  /* end of event handlers */

  if (events === null || eventsLoading) {
    return (
      <div className='loading-container'>
        <Loading />
      </div>
    );
  }

  const addEventButton = (
    <LinkButton to={routes.eventAdd(true)}>
      {uiWordings['EventList.AddEvent']}
    </LinkButton>
  );

  const rows = addIdx(events.map(Event.getEventForDisplay));

  return (
    <>
      <Form>
        <div className='w3-half'>
          <div className='w3-half'>
            <InputText
              name='text'
              className='w3-section'
              placeholder={uiWordings['EventList.FilterTextPlaceHolder']}
              onChange={onFilterChange}
              value={filter.text}
            />
          </div>
          <div className='w3-half w3-container'>
            <div className='w3-half'>
              <Button onClick={onFilter}>
                {uiWordings['EventList.FilterButton']}
              </Button>
            </div>
            <div className='w3-half'>
              <Button onClick={onClearFilter}>
                {uiWordings['EventList.ClearFilterButton']}
              </Button>
            </div>
          </div>
        </div>
        <div className='w3-right'>{addEventButton}</div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={eventsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEditEvent}
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
