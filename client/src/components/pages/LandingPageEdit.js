import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsState from 'contexts/artists/ArtistsState';
import ArtistsContext from 'contexts/artists/artistsContext';
import ActivitiesState from 'contexts/activities/ActivitiesState';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import LandingPageContext from 'contexts/landingPage/landingPageContext';
import LandingPageContainer from 'components/landingPage/LandingPageContainer';
import LandingPageEditFeaturedArtistSelect from 'components/landingPage/LandingPageEditFeaturedArtistSelect';
import LandingPageEditFeaturedActivitySelect from 'components/landingPage/LandingPageEditFeaturedActivitySelect';
import Alert from 'models/alert';
import Artist from 'models/artist';
import Activity from 'models/activity';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import Form from 'components/form/Form';
import LabelLabelPair from 'components/form/LabelLabelPair';
import FileUpload from 'components/form/FileUpload';
import SubmitButton from 'components/form/SubmitButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import LandingPage from 'models/landingPage';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyLandingPage = new LandingPage();
const defaultState = emptyLandingPage;

const mediumTypes = Medium.mediumTypes;

const LandingPageEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artistsErrors,
    clearArtistsErrors,
    getEventArtists,
    clearEventArtists
  } = useContext(ArtistsContext);
  const {
    activitiesErrors,
    clearActivitiesErrors,
    getActivitiesForSelect,
    clearActivitiesForSelect
  } = useContext(ActivitiesContext);
  const {
    landingPage: fetchedLandingPage,
    landingPageErrors,
    landingPageLoading,
    getLandingPage,
    clearLandingPage,
    clearLandingPageErrors,
    updateLandingPage
  } = useContext(LandingPageContext);

  const [landingPage, setLandingPage] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // landingVideos
  const [landingVideosPicked, setLandingVideosPicked] = useState(null);

  // featuredVideo1
  const [featuredVideo1Picked, setFeaturedVideo1Picked] = useState(null);

  // featuredVideo2
  const [featuredVideo2Picked, setFeaturedVideo2Picked] = useState(null);

  // featuredArtists
  const [featuredArtistsPicked, setFeaturedArtistsPicked] = useState([]);

  // featuredActivities
  const [featuredActivitiesPicked, setFeaturedActivitiesPicked] = useState([]);

  // pageMeta
  const [pageMeta, setPageMeta] = useState(new PageMeta());

  // componentDidMount
  useEffect(_ => {
    getLandingPage();
    getEventArtists();
    getActivitiesForSelect();
    return _ => {
      clearLandingPage();
      clearEventArtists();
      clearActivitiesForSelect();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedLandingPage
  useEffect(
    _ => {
      setLandingPage(
        fetchedLandingPage
          ? LandingPage.getLandingPageForDisplay(fetchedLandingPage)
          : defaultState
      );
      if (fetchedLandingPage) {
        setLandingVideosPicked(getArraySafe(fetchedLandingPage.landingVideos));
        setFeaturedVideo1Picked(fetchedLandingPage.featuredVideo1);
        setFeaturedVideo2Picked(fetchedLandingPage.featuredVideo2);
        setFeaturedArtistsPicked(
          getArraySafe(fetchedLandingPage.featuredArtists)
        );
        setFeaturedActivitiesPicked(
          getArraySafe(fetchedLandingPage.featuredActivities)
        );
        if (fetchedLandingPage.pageMeta) {
          setPageMeta(fetchedLandingPage.pageMeta);
        }
      }
      setIsAddMode(!fetchedLandingPage);
    },
    [fetchedLandingPage]
  );

  // landingPageErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(landingPageErrors)) {
        setAlerts(
          landingPageErrors
            .filter(
              errorType =>
                errorType !==
                LandingPage.landingPageResponseTypes.LANDING_PAGE_NOT_EXISTS
                  .type
            )
            .map(landingPageError => {
              return new Alert(
                LandingPage.landingPageResponseTypes[landingPageError].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearLandingPageErrors();
      }
    },
    [landingPageErrors, setAlerts, clearLandingPageErrors]
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

  /* methods */

  const validInput = useCallback(landingPageInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  // const onChange = useCallback(
  //   e => {
  //     setIsSubmitEnabled(true);
  //     removeAlerts();
  //     const name = e.target.name;
  //     const value = e.target.value;
  //     setLandingPage(prevLanding => ({ ...prevLanding, [name]: value }));
  //   },
  //   [removeAlerts]
  // );

  const onGetLandingVideosPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setLandingVideosPicked(newItemList);
  }, []);

  const onGetFeaturedVideo1Picked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedVideo1Picked(firstOrDefault(newItemList, null));
  }, []);

  const onGetFeaturedVideo2Picked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedVideo2Picked(firstOrDefault(newItemList, null));
  }, []);

  const onGetFeaturedArtistsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedArtistsPicked(newItemList);
  }, []);

  const onGetFeaturedActivitiesPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedActivitiesPicked(newItemList);
  }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add landingVideos
      landingPage.landingVideos = getArraySafe(landingVideosPicked).map(
        medium => {
          return medium._id;
        }
      );

      // add featuredVideo1
      landingPage.featuredVideo1 = featuredVideo1Picked
        ? featuredVideo1Picked._id
        : null;

      // add featuredVideo2
      landingPage.featuredVideo2 = featuredVideo2Picked
        ? featuredVideo2Picked._id
        : null;

      // add featuredArtists
      landingPage.featuredArtists = getArraySafe(featuredArtistsPicked).map(
        artist => artist._id
      );

      // add featuredActivities
      landingPage.featuredActivities = getArraySafe(
        featuredActivitiesPicked
      ).map(activity => activity._id);

      // add pageMeta
      landingPage.pageMeta = pageMeta;

      let isSuccess = validInput(landingPage);
      let returnedLandingPage = null;
      if (isSuccess) {
        returnedLandingPage = await updateLandingPage(landingPage);
        isSuccess = Boolean(returnedLandingPage);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['LandingPageEdit.UpdateLandingPageSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getLandingPage();
      }

      scrollToTop();
    },
    [
      updateLandingPage,
      getLandingPage,
      landingPage,
      setAlerts,
      removeAlerts,
      validInput,
      landingVideosPicked,
      featuredVideo1Picked,
      featuredVideo2Picked,
      featuredArtistsPicked,
      featuredActivitiesPicked,
      pageMeta
    ]
  );

  /* end of event handlers */

  if (landingPageLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className='w3-row'>
        <div className='w3-col m10'>
          <h4>{uiWordings['LandingPageEdit.EditLandingPageTitle']}</h4>
        </div>
        <div className='w3-rest w3-row'>
          <div className='w3-col m12'>
            <PageMetaEditWithModal
              pageMeta={pageMeta}
              setPageMetaFunc={setPageMetaFunc}
            />
          </div>
        </div>
      </div>

      <AccordionRegion title={uiWordings['LandingPageEdit.MediaRegionTitle']}>
        <FileUpload
          name='landingVideos'
          labelMessage={uiWordings['LandingPage.LandingVideosLabel']}
          files={getArraySafe(landingVideosPicked)}
          onGetFiles={onGetLandingVideosPicked}
          isMultiple={true}
          mediumType={mediumTypes.VIDEO}
        />
        <FileUpload
          name='featuredVideo1'
          labelMessage={uiWordings['LandingPage.FeaturedVideo1Label']}
          files={featuredVideo1Picked ? [featuredVideo1Picked] : null}
          onGetFiles={onGetFeaturedVideo1Picked}
          isMultiple={false}
          mediumType={mediumTypes.VIDEO}
        />
        <FileUpload
          name='featuredVideo2'
          labelMessage={uiWordings['LandingPage.FeaturedVideo2Label']}
          files={featuredVideo2Picked ? [featuredVideo2Picked] : null}
          onGetFiles={onGetFeaturedVideo2Picked}
          isMultiple={false}
          mediumType={mediumTypes.VIDEO}
        />
      </AccordionRegion>

      <LandingPageEditFeaturedArtistSelect
        featuredArtistsPicked={featuredArtistsPicked}
        onGetFeaturedArtistsPicked={onGetFeaturedArtistsPicked}
      />

      <LandingPageEditFeaturedActivitySelect
        featuredActivitiesPicked={featuredActivitiesPicked}
        onGetFeaturedActivitiesPicked={onGetFeaturedActivitiesPicked}
      />

      {!isAddMode && (
        <>
          <LabelLabelPair
            value={landingPage.lastModifyDTDisplay}
            labelMessage={uiWordings['LandingPage.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={landingPage.lastModifyUserDisplay}
            labelMessage={uiWordings['LandingPage.LastModifyUserLabel']}
          />
        </>
      )}
      <SubmitButton
        disabled={!isSubmitEnabled}
        label={uiWordings['LandingPageEdit.UpdateLandingPageSubmit']}
      />
    </Form>
  );
};

const LandingPageEditWithContainer = _ => (
  <LandingPageContainer>
    <ArtistsState>
      <ActivitiesState>
        <LandingPageEdit />
      </ActivitiesState>
    </ArtistsState>
  </LandingPageContainer>
);

export default LandingPageEditWithContainer;
