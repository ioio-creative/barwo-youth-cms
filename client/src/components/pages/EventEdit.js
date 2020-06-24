import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistState from 'contexts/artists/ArtistsState';
import ArtistsContext from 'contexts/artists/artistsContext';
import EventsContext from 'contexts/events/eventsContext';
import EventsPageContainer from 'components/events/EventsPageContainer';
import EventEditArtDirectorSelect from 'components/events/EventEditArtDirectorSelect';
import EventEditArtistSelect from 'components/events/EventEditArtistSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Artist from 'models/artist';
import Event from 'models/event';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const emptyEvent = new Event();
const defaultState = emptyEvent;

const EventEdit = _ => {
  const { eventId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artistsErrors,
    clearArtistsErrors,
    getArtDirectors,
    clearArtDirectors,
    getEventArtists,
    clearEventArtists
  } = useContext(ArtistsContext);
  const {
    event: fetchedEvent,
    eventsErrors,
    eventsLoading,
    getEvent,
    clearEvent,
    addEvent,
    updateEvent,
    clearEventsErrors
  } = useContext(EventsContext);

  // event
  const [event, setEvent] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddEventMode, setIsAddEventMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // art directors in event
  const [artDirectorsPicked, setArtDirectorsPicked] = useState([]);

  // artists in event
  const [artistsPicked, setArtistsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getArtDirectors();
    getEventArtists();
    return _ => {
      clearArtDirectors();
      clearEventArtists();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (eventId) {
        getEvent(eventId);
      }

      return _ => {
        clearEvent();
      };
    },
    [eventId, getEvent, clearEvent]
  );

  // fetchedEvent
  useEffect(
    _ => {
      if (!eventsLoading) {
        setEvent(
          fetchedEvent ? Event.getEventForDisplay(fetchedEvent) : defaultState
        );
        if (fetchedEvent) {
          if (isNonEmptyArray(fetchedEvent.artDirectors)) {
            setArtDirectorsPicked(fetchedEvent.artDirectors);
          }
          if (isNonEmptyArray(fetchedEvent.artists)) {
            setArtistsPicked(fetchedEvent.artists);
          }
        }
        setIsAddEventMode(!fetchedEvent);
      }
    },
    [eventsLoading, fetchedEvent, setEvent]
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

        if (
          eventsErrors.includes(Event.eventsResponseTypes.EVENT_NOT_EXISTS.type)
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [eventsErrors, setAlerts, clearEventsErrors]
  );

  // artistsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(artistsErrors)) {
        setAlerts(
          artistsErrors.map(artistsError => {
            return new Alert(
              Artist.artistsResponseTypes[artistsError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearArtistsErrors();
      }
    },
    [artistsErrors, setAlerts, clearArtistsErrors]
  );

  /* methods */

  const validInput = useCallback(
    eventInput => {
      for (const artist of eventInput.artists) {
        // artist is acutally a string, which is artistId
        if (!artist) {
          setAlerts(
            new Alert(
              Event.eventsResponseTypes.EVENT_ARTIST_REQUIRED.msg,
              Alert.alertTypes.WARNING
            )
          );
          return false;
        }
      }
      return true;
    },
    [setAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      setEvent({ ...event, [e.target.name]: e.target.value });
    },
    [event, setEvent, removeAlerts]
  );

  const onGetArtDirectorsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setArtDirectorsPicked(newItemList);
    },
    [setArtDirectorsPicked]
  );

  const onGetArtistsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setArtistsPicked(newItemList);
    },
    [setArtistsPicked]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      e.preventDefault();

      // add art directors
      event.artDirectors = getArraySafe(artDirectorsPicked).map(
        artDirector => artDirector._id
      );

      // add artists
      event.artists = getArraySafe(
        artistsPicked.map(({ role_tc, role_sc, role_en, artist: { _id } }) => ({
          role_tc,
          role_sc,
          role_en,
          artist: _id
        }))
      );

      let isSuccess = validInput(event);
      let returnedEvent = null;

      if (isSuccess) {
        const funcToCall = isAddEventMode ? addEvent : updateEvent;
        returnedEvent = await funcToCall(event);
        isSuccess = Boolean(returnedEvent);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddEventMode
              ? uiWordings['EventEdit.AddEventSuccessMessage']
              : uiWordings['EventEdit.UpdateEventSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
        goToUrl(routes.eventEditByIdWithValue(true, returnedEvent._id));
      }
    },
    [
      isAddEventMode,
      updateEvent,
      addEvent,
      event,
      artDirectorsPicked,
      artistsPicked,
      setAlerts,
      validInput
    ]
  );

  /* end of event handlers */

  if (eventsLoading) {
    return <Loading />;
  }

  const backToEventListButton = (
    <Form>
      <LinkButton to={routes.eventList(true)}>
        {uiWordings['EventEdit.BackToEventList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToEventListButton}</>;
  }

  return (
    <>
      {backToEventListButton}

      <Form onSubmit={onSubmit}>
        <h4>
          {isAddEventMode
            ? uiWordings['EventEdit.AddEventTitle']
            : uiWordings['EventEdit.EditEventTitle']}
        </h4>

        <LabelInputTextPair
          name='name_tc'
          value={event.name_tc}
          labelMessage={uiWordings['Event.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={event.name_sc}
          labelMessage={uiWordings['Event.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_en'
          value={event.name_en}
          labelMessage={uiWordings['Event.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelInputTextPair
          name='desc_tc'
          value={event.desc_tc}
          labelMessage={uiWordings['Event.DescTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='desc_sc'
          value={event.desc_sc}
          labelMessage={uiWordings['Event.DescScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='desc_en'
          value={event.desc_en}
          labelMessage={uiWordings['Event.DescEnLabel']}
          placeholder=''
          onChange={onChange}
        />

        <EventEditArtDirectorSelect
          controlledArtDirectorsPicked={artDirectorsPicked}
          onGetArtDirectorsPicked={onGetArtDirectorsPicked}
        />

        <LabelInputTextPair
          name='writer_tc'
          value={event.writer_tc}
          labelMessage={uiWordings['Event.WriterTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='writer_sc'
          value={event.writer_sc}
          labelMessage={uiWordings['Event.WriterScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='writer_en'
          value={event.writer_en}
          labelMessage={uiWordings['Event.WriterEnLabel']}
          placeholder=''
          onChange={onChange}
        />

        <EventEditArtistSelect
          artistsPicked={artistsPicked}
          onGetArtistsPicked={onGetArtistsPicked}
        />

        <LabelTogglePair
          name='isEnabled'
          value={event.isEnabled}
          labelMessage={uiWordings['Event.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddEventMode && (
          <>
            <LabelLabelPair
              value={event.createDTDisplay}
              labelMessage={uiWordings['Event.CreateDTLabel']}
            />
            <LabelLabelPair
              value={event.lastModifyDTDisplay}
              labelMessage={uiWordings['Event.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={event.lastModifyUserDisplay}
              labelMessage={uiWordings['Event.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddEventMode
              ? uiWordings['EventEdit.AddEventSubmit']
              : uiWordings['EventEdit.UpdateEventSubmit']
          }
        />
      </Form>
    </>
  );
};

const EventEditWithContainer = _ => (
  <EventsPageContainer>
    <ArtistState>
      <EventEdit />
    </ArtistState>
  </EventsPageContainer>
);

export default EventEditWithContainer;
