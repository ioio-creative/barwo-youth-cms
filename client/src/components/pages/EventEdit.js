import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsState from 'contexts/artists/ArtistsState';
import ArtistsContext from 'contexts/artists/artistsContext';
import EventsContext from 'contexts/events/eventsContext';
import EventsPageContainer from 'components/events/EventsPageContainer';
import EventEditArtDirectorSelect from 'components/events/EventEditArtDirectorSelect';
import EventEditArtistSelect from 'components/events/EventEditArtistSelect';
import EventEditShowSelect from 'components/events/EventEditShowSelect';
import EventEditScenaristSelect from 'components/events/EventEditScenaristSelect';
import EventEditPriceSelect from 'components/events/EventEditPriceSelect';
import EventEditPhoneSelect from 'components/events/EventEditPhoneSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from 'components/form/LabelRichTextbox';
import LabelColorPickerPair from 'components/form/LabelColorPickerPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Artist from 'models/artist';
import Event from 'models/event';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import { formatDateString } from 'utils/datetime';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyEvent = new Event();
const defaultState = emptyEvent;

/* shows related utils */

const cleanShow = show => ({
  date: formatDateString(show.date),
  startTime: show.startTime.toString().substr(0, 'HH:mm'.length)
});

/* end of shows related utils */

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
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // art directors in event
  const [artDirectorsPicked, setArtDirectorsPicked] = useState([]);

  // artists in event
  const [artistsPicked, setArtistsPicked] = useState([]);

  // shows in event
  const [showsPicked, setShowsPicked] = useState([]);

  // scenarists in event
  const [scenaristsPicked, setScenaristsPicked] = useState([]);

  // prices in event
  const [pricesPicked, setPricesPicked] = useState([]);

  // phones in event
  const [phonesPicked, setPhonesPicked] = useState([]);

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

  // eventId
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
          if (isNonEmptyArray(fetchedEvent.shows)) {
            setShowsPicked(fetchedEvent.shows);
          }
          if (isNonEmptyArray(fetchedEvent.scenarists)) {
            setScenaristsPicked(fetchedEvent.scenarists);
          }
          if (isNonEmptyArray(fetchedEvent.prices)) {
            setPricesPicked(fetchedEvent.prices);
          }
          if (isNonEmptyArray(fetchedEvent.phones)) {
            setPhonesPicked(fetchedEvent.phones);
          }
        }
        setIsAddMode(!fetchedEvent);
      }
    },
    [
      eventsLoading,
      fetchedEvent,
      setEvent,
      setIsAddMode,
      setArtDirectorsPicked,
      setArtistsPicked,
      setShowsPicked,
      setScenaristsPicked,
      setPricesPicked,
      setPhonesPicked
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

        if (
          eventsErrors.includes(Event.eventsResponseTypes.EVENT_NOT_EXISTS.type)
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [eventsErrors, setAlerts, clearEventsErrors, setIsAbandonEdit]
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
    [event, setEvent, removeAlerts, setIsSubmitEnabled]
  );

  const onGetArtDirectorsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setArtDirectorsPicked(newItemList);
    },
    [setArtDirectorsPicked, setIsSubmitEnabled]
  );

  const onGetArtistsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setArtistsPicked(newItemList);
    },
    [setArtistsPicked, setIsSubmitEnabled]
  );

  const onGetShowsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setShowsPicked(newItemList);
    },
    [setShowsPicked, setIsSubmitEnabled]
  );

  const onGetScenaristsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setScenaristsPicked(newItemList);
    },
    [setScenaristsPicked, setIsSubmitEnabled]
  );

  const onGetPricesPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setPricesPicked(newItemList);
    },
    [setPricesPicked, setIsSubmitEnabled]
  );

  const onGetPhonesPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setPhonesPicked(newItemList);
    },
    [setPhonesPicked, setIsSubmitEnabled]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
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

      // add shows
      const cleanedShows = getArraySafe(
        showsPicked.map(({ date, startTime }) =>
          cleanShow({
            date,
            startTime
          })
        )
      );
      // note: backend will sort the shows as well
      // so no need to sort before submit
      event.shows = cleanedShows;

      // add scenarists
      event.scenarists = getArraySafe(scenaristsPicked).map(
        ({ name_tc, name_sc, name_en }) => {
          return {
            name_tc,
            name_sc,
            name_en
          };
        }
      );

      // add prices
      event.prices = getArraySafe(pricesPicked).map(
        ({ price_tc, price_sc, price_en }) => {
          return {
            price_tc,
            price_sc,
            price_en
          };
        }
      );

      // add phones
      event.phones = getArraySafe(phonesPicked).map(
        ({ label_tc, label_sc, label_en, phone }) => {
          return {
            label_tc,
            label_sc,
            label_en,
            phone
          };
        }
      );

      let isSuccess = validInput(event);
      let returnedEvent = null;

      if (isSuccess) {
        const funcToCall = isAddMode ? addEvent : updateEvent;
        returnedEvent = await funcToCall(event);
        isSuccess = Boolean(returnedEvent);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['EventEdit.AddEventSuccessMessage']
              : uiWordings['EventEdit.UpdateEventSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        goToUrl(routes.eventEditByIdWithValue(true, returnedEvent._id));
        setEvent(returnedEvent);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateEvent,
      addEvent,
      setEvent,
      event,
      artDirectorsPicked,
      artistsPicked,
      showsPicked,
      scenaristsPicked,
      pricesPicked,
      phonesPicked,
      setAlerts,
      removeAlerts,
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
          {isAddMode
            ? uiWordings['EventEdit.AddEventTitle']
            : uiWordings['EventEdit.EditEventTitle']}
        </h4>

        <LabelInputTextPair
          name='label'
          value={event.label}
          labelMessage={uiWordings['Event.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
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
        <EventEditArtDirectorSelect
          artDirectorsPicked={artDirectorsPicked}
          onGetArtDirectorsPicked={onGetArtDirectorsPicked}
        />
        <EventEditScenaristSelect
          scenarists={scenaristsPicked}
          onGetScenarists={onGetScenaristsPicked}
        />
        <EventEditShowSelect
          shows={showsPicked}
          onGetShows={onGetShowsPicked}
        />
        <LabelInputTextPair
          name='descHeadline_tc'
          value={event.descHeadline_tc}
          labelMessage={uiWordings['Event.DescHeadlineTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='descHeadline_sc'
          value={event.descHeadline_sc}
          labelMessage={uiWordings['Event.DescHeadlineScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='descHeadline_en'
          value={event.descHeadline_en}
          labelMessage={uiWordings['Event.DescHeadlineEnLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelRichTextbox
          name='desc_tc'
          value={event.desc_tc}
          labelMessage={uiWordings['Event.DescTcLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_sc'
          value={event.desc_sc}
          labelMessage={uiWordings['Event.DescScLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_en'
          value={event.desc_en}
          labelMessage={uiWordings['Event.DescEnLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelInputTextPair
          name='remarks_tc'
          value={event.remarks_tc}
          labelMessage={uiWordings['Event.RemarksTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='remarks_sc'
          value={event.remarks_sc}
          labelMessage={uiWordings['Event.RemarksScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='remarks_en'
          value={event.remarks_en}
          labelMessage={uiWordings['Event.RemarksEnLabel']}
          placeholder=''
          onChange={onChange}
        />
        {/* <LabelInputTextPair
          name='featuredImage'
          value={event.featuredImage}
          labelMessage={uiWordings['Event.FeaturedImageLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        />
        <LabelInputTextPair
          name='gallery'
          value={event.gallery}
          labelMessage={uiWordings['Event.GalleryLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        /> */}
        <EventEditArtistSelect
          artistsPicked={artistsPicked}
          onGetArtistsPicked={onGetArtistsPicked}
        />

        <div className='w3-card w3-container'>
          <h4>{uiWordings['EventEdit.Ticket.Title']}</h4>
          <LabelInputTextPair
            name='venue_tc'
            required={true}
            value={event.venue_tc}
            labelMessage={uiWordings['Event.VenueTcLabel']}
            placeholder=''
            onChange={onChange}
          />
          <LabelInputTextPair
            name='venue_sc'
            required={true}
            value={event.venue_sc}
            labelMessage={uiWordings['Event.VenueScLabel']}
            placeholder=''
            onChange={onChange}
          />
          <LabelInputTextPair
            name='venue_en'
            required={true}
            value={event.venue_en}
            labelMessage={uiWordings['Event.VenueEnLabel']}
            placeholder=''
            onChange={onChange}
          />

          <EventEditPriceSelect
            prices={pricesPicked}
            onGetPrices={onGetPricesPicked}
          />

          <LabelRichTextbox
            name='priceRemarks_tc'
            value={event.priceRemarks_tc}
            labelMessage={uiWordings['Event.PriceRemarksTcLabel']}
            onChange={onChange}
            filebrowserBrowseUrl={routes.fileManager}
          />
          <LabelRichTextbox
            name='priceRemarks_sc'
            value={event.priceRemarks_sc}
            labelMessage={uiWordings['Event.PriceRemarksScLabel']}
            onChange={onChange}
            filebrowserBrowseUrl={routes.fileManager}
          />
          <LabelRichTextbox
            name='priceRemarks_en'
            value={event.priceRemarks_en}
            labelMessage={uiWordings['Event.PriceRemarksEnLabel']}
            onChange={onChange}
            filebrowserBrowseUrl={routes.fileManager}
          />

          <EventEditPhoneSelect
            phones={phonesPicked}
            onGetPhones={onGetPhonesPicked}
          />

          <LabelInputTextPair
            name='ticketUrl'
            value={event.ticketUrl}
            labelMessage={uiWordings['Event.TicketUrlLabel']}
            placeholder=''
            onChange={onChange}
          />
        </div>

        <LabelColorPickerPair
          name='themeColor'
          value={event.themeColor || defaultState.themeColor}
          labelMessage={uiWordings['Event.ThemeColorLabel']}
          onChange={onChange}
        />

        <LabelTogglePair
          name='isEnabled'
          value={event.isEnabled}
          labelMessage={uiWordings['Event.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddMode && (
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
            isAddMode
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
    <ArtistsState>
      <EventEdit />
    </ArtistsState>
  </EventsPageContainer>
);

export default EventEditWithContainer;
