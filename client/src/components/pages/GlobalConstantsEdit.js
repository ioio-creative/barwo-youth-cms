import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import GlobalConstantsContext from 'contexts/globalConstants/globalConstantsContext';
import GlobalConstantsContainer from 'components/globalConstants/GlobalConstantsContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import GlobalConstants from 'models/globalConstants';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const originalGlobalConstants = new GlobalConstants();
const defaultState = originalGlobalConstants;

const GlobalConstantsEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    globalConstants: fetchedGlobalConstants,
    globalConstantsErrors,
    globalConstantsLoading,
    getGlobalConstants,
    clearGlobalConstants,
    clearGlobalConstantsErrors,
    updateGlobalConstants
  } = useContext(GlobalConstantsContext);

  const [globalConstants, setGlobalConstants] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // componentDidMount
  useEffect(_ => {
    // getGlobalConstants(); TODO!
    return _ => {
      clearGlobalConstants();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedGlobalConstants
  useEffect(
    _ => {
      if (!globalConstantsLoading) {
        setGlobalConstants(
          fetchedGlobalConstants
            ? GlobalConstants.getGlobalConstantsForDisplay(
                fetchedGlobalConstants
              )
            : defaultState
        );
        setIsAddMode(!fetchedGlobalConstants);
      }
    },
    [
      globalConstantsLoading,
      fetchedGlobalConstants,
      setGlobalConstants,
      setIsAddMode
    ]
  );

  // globalConstantsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(globalConstantsErrors)) {
        setAlerts(
          globalConstantsErrors
            .filter(
              errorType =>
                errorType !==
                GlobalConstants.globalConstantsResponseTypes
                  .GLOBAL_CONSTANTS_PAGE_NOT_EXISTS.type
            )
            .map(globalConstantsError => {
              console.log(globalConstantsError);
              return new Alert(
                GlobalConstants.globalConstantsResponseTypes[
                  globalConstantsError
                ].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearGlobalConstantsErrors();
      }
    },
    [globalConstantsErrors, setAlerts, clearGlobalConstantsErrors]
  );

  /* methods */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      setGlobalConstants({
        ...globalConstants,
        [e.target.name]: e.target.value
      });
    },
    [globalConstants, setGlobalConstants, removeAlerts]
  );

  const validInput = useCallback(globalConstantsInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      e.preventDefault();
      let isSuccess = validInput(globalConstants);
      let returnedGlobalConstants = null;
      if (isSuccess) {
        returnedGlobalConstants = await updateGlobalConstants(globalConstants);
        isSuccess = Boolean(returnedGlobalConstants);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings[
              'GlobalConstantsEdit.UpdateGlobalConstantsSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );

        setGlobalConstants(returnedGlobalConstants);
      }

      scrollToTop();
    },
    [
      updateGlobalConstants,
      setGlobalConstants,
      globalConstants,
      setAlerts,
      validInput
    ]
  );

  /* end of event handlers */

  if (globalConstantsLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['GlobalConstantsEdit.EditGlobalConstantsTitle']}</h4>
      <LabelInputTextPair
        name='latestShow_tc'
        value={globalConstants.latestShow_tc}
        labelMessage={uiWordings['GlobalConstants.LatestShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <SubmitButton
        label={uiWordings['GlobalConstantsEdit.UpdateGlobalConstantsSubmit']}
      />
    </Form>
  );
};

const GlobalConstantsEditWithContainer = _ => (
  <GlobalConstantsContainer>
    <GlobalConstantsEdit />
  </GlobalConstantsContainer>
);

export default GlobalConstantsEditWithContainer;
