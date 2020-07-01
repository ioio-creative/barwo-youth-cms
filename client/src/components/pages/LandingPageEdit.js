import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import LandingPageContext from 'contexts/landingPage/landingPageContext';
import LandingPageContainer from 'components/landingPage/LandingPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LandingPage from 'models/landingPage';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyLandingPage = new LandingPage();
const defaultState = emptyLandingPage;

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
        setIsAddMode(!fetchedLandingPage);
      }
    },
    [landingPageLoading, fetchedLandingPage, setLandingPage, setIsAddMode]
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

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      e.preventDefault();
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

        setLandingPage(returnedLandingPage);
      }

      scrollToTop();
    },
    [updateLandingPage, setLandingPage, landingPage, setAlerts, validInput]
  );

  /* end of event handlers */

  if (landingPageLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['LandingPageEdit.EditLandingPageTitle']}</h4>

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
