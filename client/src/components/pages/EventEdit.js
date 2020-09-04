import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsState from 'contexts/artists/ArtistsState';
import ArtistsContext from 'contexts/artists/artistsContext';
import EventsContext from 'contexts/events/eventsContext';
import EventsPageContainer from 'components/events/EventsPageContainer';
import EventEditArtDirectorSelect from 'components/events/EventEditArtDirectorSelect';
import EventEditArtistSelect from 'components/events/EventEditArtistSelect';
import EventEditShowSelect from 'components/events/EventEditShowSelect';
import EventEditScenaristSelect from 'components/events/EventEditScenaristSelect';
// import EventEditPriceSelect from 'components/events/EventEditPriceSelect';
// import EventEditPhoneSelect from 'components/events/EventEditPhoneSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelTextAreaPair from 'components/form/LabelTextAreaPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from 'components/form/LabelRichTextbox';
import ColorPickerModal from 'components/form/ColorPickerModal';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import Artist from 'models/artist';
import Event from 'models/event';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import { formatDateString } from 'utils/datetime';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const eventTypes = Event.eventTypes;

const emptyEvent = new Event();
const defaultState = emptyEvent;

const mediumTypes = Medium.mediumTypes;

/* shows related utils */

const cleanShow = show => ({
  date: formatDateString(show.date),
  startTime: show.startTime.toString().substr(0, 'HH:mm'.length)
});

/* end of shows related utils */

const EventEdit = _ => {
  const { eventId } = useParams();
  const isCommunityPerformanceEdit = Boolean(
    useRouteMatch(routes.communityPerformanceEditById)
  );
  const isCommunityPerformanceAdd = Boolean(
    useRouteMatch(routes.communityPerformanceAdd(false))
  );
  const isCommunityPerformance =
    isCommunityPerformanceEdit || isCommunityPerformanceAdd;

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
    clearEventsErrors,
    deleteEvent
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

  // // prices in event
  // const [pricesPicked, setPricesPicked] = useState([]);

  // // phones in event
  // const [phonesPicked, setPhonesPicked] = useState([]);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // gallery
  const [galleryPicked, setGalleryPicked] = useState([]);

  // pageMeta
  const [pageMeta, setPageMeta] = useState(new PageMeta());

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
      setEvent(
        fetchedEvent ? Event.getEventForDisplay(fetchedEvent) : defaultState
      );
      if (fetchedEvent) {
        setArtDirectorsPicked(getArraySafe(fetchedEvent.artDirectors));
        setArtistsPicked(getArraySafe(fetchedEvent.artists));
        setShowsPicked(getArraySafe(fetchedEvent.shows));
        setScenaristsPicked(getArraySafe(fetchedEvent.scenarists));
        // setPricesPicked(getArraySafe(fetchedEvent.prices));
        // setPhonesPicked(getArraySafe(fetchedEvent.phones));

        setFeaturedImagePicked(fetchedEvent.featuredImage);
        setGalleryPicked(getArraySafe(fetchedEvent.gallery));

        if (fetchedEvent.pageMeta) {
          setPageMeta(fetchedEvent.pageMeta);
        }
      }
      setIsAddMode(!fetchedEvent);
    },
    [fetchedEvent]
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
      // Note: artist is an object
      for (const artist of eventInput.artists) {
        let errorType = null;

        if (artist.isGuestArtist === true) {
          if (!artist.guestArtistName_tc) {
            errorType =
              Event.eventsResponseTypes.EVENT_GUEST_ARTIST_NAME_TC_REQUIRED;
          } else if (!artist.guestArtistName_sc) {
            errorType =
              Event.eventsResponseTypes.EVENT_GUEST_ARTIST_NAME_SC_REQUIRED;
          } /*else if (!artist.guestArtistName_en) {
            errorType =
              Event.eventsResponseTypes.EVENT_GUEST_ARTIST_NAME_EN_REQUIRED;
          }*/
        } else {
          // artist.artist is acutally a string, which is artistId
          if (!artist.artist) {
            errorType = Event.eventsResponseTypes.EVENT_ARTIST_REQUIRED;
          }
        }

        if (errorType) {
          const alertMsgPrefix = `${uiWordings['Event.ArtistsLabel']} - ${uiWordings['EventEdit.Artist.RoleTcPlaceholder']} - ${artist.role_tc} - `;
          setAlerts(
            new Alert(alertMsgPrefix + errorType.msg, Alert.alertTypes.WARNING)
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
      // https://reactjs.org/docs/events.html#event-pooling
      const name = e.target.name;
      const value = e.target.value;
      setEvent(prevEvent => ({
        ...prevEvent,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetArtDirectorsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setArtDirectorsPicked(newItemList);
  }, []);

  const onGetArtistsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setArtistsPicked(newItemList);
  }, []);

  const onGetShowsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setShowsPicked(newItemList);
  }, []);

  const onGetScenaristsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setScenaristsPicked(newItemList);
  }, []);

  // const onGetPricesPicked = useCallback(newItemList => {
  //   setIsSubmitEnabled(true);
  //   setPricesPicked(newItemList);
  // }, []);

  // const onGetPhonesPicked = useCallback(newItemList => {
  //   setIsSubmitEnabled(true);
  //   setPhonesPicked(newItemList);
  // }, []);

  const onGetFeaturedImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetGalleryPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setGalleryPicked(newItemList);
  }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const eventDelete = useCallback(
    async _ => {
      const isSuccess = await deleteEvent(eventId);
      if (isSuccess) {
        goToUrl(routes.eventList(true));
        setAlerts(
          new Alert(
            uiWordings[
              isCommunityPerformance
                ? 'CommunityPerformanceEdit.DeleteCommunityPerformanceSuccessMessage'
                : 'EventEdit.DeleteEventSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [isCommunityPerformance, eventId, deleteEvent, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add type
      event.type = (isCommunityPerformance
        ? eventTypes.COMMUNITY_PERFORMANCE
        : eventTypes.EVENT
      ).value;

      // add art directors
      event.artDirectors = getArraySafe(artDirectorsPicked).map(
        artDirector => artDirector._id
      );

      /**
       * !!!Important!!!
       * guestArtistRemarks is now used by both guest and non-guest artists
       */

      // add artists
      event.artists = getArraySafe(
        artistsPicked.map(
          ({
            role_tc,
            role_sc,
            role_en,
            artist,
            isGuestArtist,
            guestArtistName_tc,
            guestArtistName_sc,
            guestArtistName_en,
            guestArtistRemarks_tc,
            guestArtistRemarks_sc,
            guestArtistRemarks_en,
            guestArtistImage
          }) => ({
            role_tc,
            role_sc,
            role_en,
            artist: artist ? artist._id : null,
            isGuestArtist,
            guestArtistName_tc,
            guestArtistName_sc,
            guestArtistName_en,
            guestArtistRemarks_tc,
            guestArtistRemarks_sc,
            guestArtistRemarks_en,
            guestArtistImage: guestArtistImage ? guestArtistImage._id : null
          })
        )
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

      // // add prices
      // event.prices = getArraySafe(pricesPicked).map(
      //   ({ price_tc, price_sc, price_en }) => {
      //     return {
      //       price_tc,
      //       price_sc,
      //       price_en
      //     };
      //   }
      // );

      // // add phones
      // event.phones = getArraySafe(phonesPicked).map(
      //   ({ label_tc, label_sc, label_en, phone }) => {
      //     return {
      //       label_tc,
      //       label_sc,
      //       label_en,
      //       phone
      //     };
      //   }
      // );

      // add featuredImage
      event.featuredImage = featuredImagePicked
        ? featuredImagePicked._id
        : null;

      // add gallery
      event.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });

      // add pageMeta
      event.pageMeta = PageMeta.cleanPageMetaBeforeSubmit(pageMeta);
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
              ? uiWordings[
                  isCommunityPerformance
                    ? 'CommunityPerformanceEdit.AddCommunityPerformanceSuccessMessage'
                    : 'EventEdit.AddEventSuccessMessage'
                ]
              : uiWordings[
                  isCommunityPerformance
                    ? 'CommunityPerformanceEdit.UpdateCommunityPerformanceSuccessMessage'
                    : 'EventEdit.UpdateEventSuccessMessage'
                ],
            Alert.alertTypes.INFO
          )
        );

        getEvent(returnedEvent._id);
      }

      scrollToTop();
    },
    [
      isCommunityPerformance,
      isAddMode,
      updateEvent,
      addEvent,
      getEvent,
      event,
      artDirectorsPicked,
      artistsPicked,
      showsPicked,
      scenaristsPicked,
      // pricesPicked,
      // phonesPicked,
      featuredImagePicked,
      galleryPicked,
      setAlerts,
      removeAlerts,
      validInput,
      pageMeta
    ]
  );

  /* end of event handlers */

  if (eventsLoading) {
    return <Loading />;
  }

  const backToEventListButton = (
    <GroupContainer>
      <LinkButton to={routes.eventList(true)}>
        {
          uiWordings[
            `${
              isCommunityPerformance
                ? 'CommunityPerformanceEdit.BackToCommunityPerformanceList'
                : 'EventEdit.BackToEventList'
            }`
          ]
        }
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToEventListButton}</>;
  }

  return (
    <>
      {backToEventListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m4'>
            <h4>
              {isAddMode
                ? uiWordings[
                    `${
                      isCommunityPerformance
                        ? 'CommunityPerformanceEdit.AddCommunityPerformanceTitle'
                        : 'EventEdit.AddEventTitle'
                    }`
                  ]
                : uiWordings[
                    `${
                      isCommunityPerformance
                        ? 'CommunityPerformanceEdit.EditCommunityPerformanceTitle'
                        : 'EventEdit.EditEventTitle'
                    }`
                  ]}
            </h4>
          </div>
          <div className='w3-rest w3-row'>
            <div className='w3-col m4'>
              <ColorPickerModal
                name='themeColor'
                value={event.themeColor || defaultState.themeColor}
                labelMessage={uiWordings['Event.ThemeColorLabel']}
                onChange={onChange}
              />
            </div>
            <div className='w3-col m4'>
              <PageMetaEditWithModal
                pageMeta={pageMeta}
                setPageMetaFunc={setPageMetaFunc}
                isHideOptionalFields={true}
              />
            </div>
            <div className='w3-col m4'>
              <Label
                htmlFor='isEnabled'
                message={uiWordings['Event.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={event.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

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

        <LabelTextAreaPair
          name='nameForLongDisplay_tc'
          value={event.nameForLongDisplay_tc}
          labelMessage={uiWordings['Event.NameForLongDisplayTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />
        <LabelTextAreaPair
          name='nameForLongDisplay_sc'
          value={event.nameForLongDisplay_sc}
          labelMessage={uiWordings['Event.NameForLongDisplayScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />
        <LabelTextAreaPair
          name='nameForLongDisplay_en'
          value={event.nameForLongDisplay_en}
          labelMessage={uiWordings['Event.NameForLongDisplayEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />

        <AccordionRegion title={uiWordings['EventEdit.MediaRegionTitle']}>
          <FileUpload
            name='featuredImage'
            labelMessage={uiWordings['Event.FeaturedImageLabel']}
            files={featuredImagePicked ? [featuredImagePicked] : null}
            onGetFiles={onGetFeaturedImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='gallery'
            labelMessage={uiWordings['Event.GalleryLabel']}
            files={getArraySafe(galleryPicked)}
            onGetFiles={onGetGalleryPicked}
            isMultiple={true}
            mediumType={mediumTypes.IMAGE}
          />
        </AccordionRegion>

        <AccordionRegion title={uiWordings['EventEdit.PeopleRegionTitle']}>
          <EventEditArtDirectorSelect
            artDirectorsPicked={artDirectorsPicked}
            onGetArtDirectorsPicked={onGetArtDirectorsPicked}
          />
          <EventEditScenaristSelect
            scenarists={scenaristsPicked}
            onGetScenarists={onGetScenaristsPicked}
          />
          <EventEditArtistSelect
            artistsPicked={artistsPicked}
            onGetArtistsPicked={onGetArtistsPicked}
          />
        </AccordionRegion>

        <AccordionRegion title={uiWordings['EventEdit.ShowsRegionTitle']}>
          <EventEditShowSelect
            shows={showsPicked}
            onGetShows={onGetShowsPicked}
          />

          <LabelRichTextbox
            name='remarks_tc'
            value={event.remarks_tc}
            labelMessage={uiWordings['Event.RemarksTcLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='remarks_sc'
            value={event.remarks_sc}
            labelMessage={uiWordings['Event.RemarksScLabel']}
            placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='remarks_en'
            value={event.remarks_en}
            labelMessage={uiWordings['Event.RemarksEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        {/* <AccordionRegion title={uiWordings['EventEdit.TicketRegionTitle']}>
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
            required={true}
          />
          <LabelRichTextbox
            name='priceRemarks_sc'
            value={event.priceRemarks_sc}
            labelMessage={uiWordings['Event.PriceRemarksScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='priceRemarks_en'
            value={event.priceRemarks_en}
            labelMessage={uiWordings['Event.PriceRemarksEnLabel']}
            onChange={onChange}
            required={true}
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
        </AccordionRegion> */}

        <AccordionRegion title={uiWordings['EventEdit.DescriptionRegionTitle']}>
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
          />
          <LabelRichTextbox
            name='desc_sc'
            value={event.desc_sc}
            labelMessage={uiWordings['Event.DescScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_en'
            value={event.desc_en}
            labelMessage={uiWordings['Event.DescEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

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
              ? uiWordings[
                  `${
                    isCommunityPerformance
                      ? 'CommunityPerformanceEdit.AddCommunityPerformanceSubmit'
                      : 'EventEdit.AddEventSubmit'
                  }`
                ]
              : uiWordings[
                  `${
                    isCommunityPerformance
                      ? 'CommunityPerformanceEdit.UpdateCommunityPerformanceSubmit'
                      : 'EventEdit.UpdateEventSubmit'
                  }`
                ]
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={eventDelete}>
              {
                uiWordings[
                  `${
                    isCommunityPerformance
                      ? 'CommunityPerformanceEdit.DeleteCommunityPerformance'
                      : 'EventEdit.DeleteEvent'
                  }`
                ]
              }
            </DeleteWithConfirmButton>
          </div>
        )}
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
