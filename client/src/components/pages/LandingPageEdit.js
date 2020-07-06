import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import LandingPageContext from 'contexts/landingPage/landingPageContext';
import LandingPageContainer from 'components/landingPage/LandingPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelLabelPair from 'components/form/LabelLabelPair';
import FileUpload from 'components/form/FileUpload';
import SubmitButton from 'components/form/SubmitButton';
import LandingPage from 'models/landingPage';
import Medium from 'models/medium';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyLandingPage = new LandingPage();
const defaultState = emptyLandingPage;

const mediumTypes = Medium.mediumTypes;

const LandingPageEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
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

  // featuredVideo
  const [featuredVideoPicked, setFeaturedVideoPicked] = useState(null);

  // featuredVideo2
  const [featuredVideo2Picked, setFeaturedVideo2Picked] = useState(null);

  // componentDidMount
  useEffect(_ => {
    getLandingPage();
    return _ => {
      clearLandingPage();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedLandingPage
  useEffect(
    _ => {
      if (!landingPageLoading) {
        setLandingPage(
          fetchedLandingPage
            ? LandingPage.getLandingPageForDisplay(fetchedLandingPage)
            : defaultState
        );
        if (fetchedLandingPage) {
          setFeaturedVideoPicked(fetchedLandingPage.featuredVideo);
          setFeaturedVideo2Picked(fetchedLandingPage.featuredVideo2);
        }
        setIsAddMode(!fetchedLandingPage);
      }
    },
    [
      landingPageLoading,
      fetchedLandingPage,
      setLandingPage,
      setIsAddMode,
      setFeaturedVideoPicked,
      setFeaturedVideo2Picked
    ]
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
  //     setLandingPage({ ...landingPage, [e.target.name]: e.target.value });
  //   },
  //   [landingPage, setLandingPage, removeAlerts]
  // );

  const onGetFeaturedVideoPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setFeaturedVideoPicked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setFeaturedVideoPicked]
  );

  const onGetFeaturedVideo2Picked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setFeaturedVideo2Picked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setFeaturedVideo2Picked]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add featuredVideo
      landingPage.featuredVideo = featuredVideoPicked
        ? featuredVideoPicked._id
        : null;

      // add featuredVideo2
      landingPage.featuredVideo2 = featuredVideo2Picked
        ? featuredVideo2Picked._id
        : null;

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
      featuredVideoPicked,
      featuredVideo2Picked
    ]
  );

  /* end of event handlers */

  if (landingPageLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['LandingPageEdit.EditLandingPageTitle']}</h4>

      <FileUpload
        name='featuredVideo'
        labelMessage={uiWordings['LandingPage.FeaturedVideoLabel']}
        files={featuredVideoPicked ? [featuredVideoPicked] : null}
        onGetFiles={onGetFeaturedVideoPicked}
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
    <LandingPageEdit />
  </LandingPageContainer>
);

export default LandingPageEditWithContainer;
