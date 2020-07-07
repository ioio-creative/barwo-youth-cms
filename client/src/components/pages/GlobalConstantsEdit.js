import React, { useContext, useState, useEffect, useCallback } from 'react';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import GlobalConstants from 'models/globalConstants';
import GlobalConstantsContext from 'contexts/globalConstants/globalConstantsContext';
import GlobalConstantsContainer from 'components/globalConstants/GlobalConstantsContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
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
    getGlobalConstants();
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
            .filter(errorType => {
              return (
                errorType !==
                GlobalConstants.globalConstantsResponseTypes
                  .GLOBAL_CONSTANTS_PAGE_NOT_EXISTS.type
              );
            })
            .map(globalConstantsError => {
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

  /* end of methods */

  /* event handlers */

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let returnedGlobalConstants = null;
      returnedGlobalConstants = await updateGlobalConstants(globalConstants);
      let isSuccess = Boolean(returnedGlobalConstants);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings[
              'GlobalConstantsPageEdit.UpdateGlobalConstantsSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );

        getGlobalConstants();
      }

      scrollToTop();
    },
    [
      updateGlobalConstants,
      getGlobalConstants,
      globalConstants,
      setAlerts,
      removeAlerts
    ]
  );

  /* end of event handlers */

  if (globalConstantsLoading) {
    return <Loading />;
  }
  return (
    // originalGlobalConstants only use before finsihing the database
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
      <LabelInputTextPair
        name='latestShow_sc'
        value={globalConstants.latestShow_sc}
        labelMessage={uiWordings['GlobalConstants.LatestShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='latestShow_en'
        value={globalConstants.latestShow_en}
        labelMessage={uiWordings['GlobalConstants.LatestShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='scheduleOfShow_tc'
        value={globalConstants.scheduleOfShow_tc}
        labelMessage={uiWordings['GlobalConstants.ScheduleOfShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='scheduleOfShow_sc'
        value={globalConstants.scheduleOfShow_sc}
        labelMessage={uiWordings['GlobalConstants.ScheduleOfShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='scheduleOfShow_en'
        value={globalConstants.scheduleOfShow_en}
        labelMessage={uiWordings['GlobalConstants.ScheduleOfShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='artDirector_tc'
        value={globalConstants.artDirector_tc}
        labelMessage={uiWordings['GlobalConstants.ArtDirectorTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='artDirector_sc'
        value={globalConstants.artDirector_sc}
        labelMessage={uiWordings['GlobalConstants.ArtDirectorScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='artDirector_en'
        value={globalConstants.artDirector_en}
        labelMessage={uiWordings['GlobalConstants.ArtDirectorEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='actor_tc'
        value={globalConstants.actor_tc}
        labelMessage={uiWordings['GlobalConstants.ActorTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='actor_sc'
        value={globalConstants.actor_sc}
        labelMessage={uiWordings['GlobalConstants.ActorScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='actor_en'
        value={globalConstants.actor_en}
        labelMessage={uiWordings['GlobalConstants.ActorEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='detailsOfShow_tc'
        value={globalConstants.detailsOfShow_tc}
        labelMessage={uiWordings['GlobalConstants.DetailsOfShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='detailsOfShow_sc'
        value={globalConstants.detailsOfShow_sc}
        labelMessage={uiWordings['GlobalConstants.DetailsOfShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='detailsOfShow_en'
        value={globalConstants.detailsOfShow_en}
        labelMessage={uiWordings['GlobalConstants.DetailsOfShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='show_tc'
        value={globalConstants.show_tc}
        labelMessage={uiWordings['GlobalConstants.ShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='show_sc'
        value={globalConstants.show_sc}
        labelMessage={uiWordings['GlobalConstants.ShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='show_en'
        value={globalConstants.show_en}
        labelMessage={uiWordings['GlobalConstants.ShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='allShow_tc'
        value={globalConstants.allShow_tc}
        labelMessage={uiWordings['GlobalConstants.AllShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='allShow_sc'
        value={globalConstants.allShow_sc}
        labelMessage={uiWordings['GlobalConstants.AllShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='allShow_en'
        value={globalConstants.allShow_en}
        labelMessage={uiWordings['GlobalConstants.AllShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='activities_tc'
        value={globalConstants.activities_tc}
        labelMessage={uiWordings['GlobalConstants.ActivitiesTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='activities_sc'
        value={globalConstants.activities_sc}
        labelMessage={uiWordings['GlobalConstants.ActivitiesScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='activities_en'
        value={globalConstants.activities_en}
        labelMessage={uiWordings['GlobalConstants.ActivitiesEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='downloadPDF_tc'
        value={globalConstants.downloadPDF_tc}
        labelMessage={uiWordings['GlobalConstants.DownloadPDFTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='downloadPDF_sc'
        value={globalConstants.downloadPDF_sc}
        labelMessage={uiWordings['GlobalConstants.DownloadPDFScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='downloadPDF_en'
        value={globalConstants.downloadPDF_en}
        labelMessage={uiWordings['GlobalConstants.DownloadPDFEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='ourActors_tc'
        value={globalConstants.ourActors_tc}
        labelMessage={uiWordings['GlobalConstants.OurActorsTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='ourActors_sc'
        value={globalConstants.ourActors_sc}
        labelMessage={uiWordings['GlobalConstants.OurActorsScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='ourActors_en'
        value={globalConstants.ourActors_en}
        labelMessage={uiWordings['GlobalConstants.OurActorsEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='ymtTheater_tc'
        value={globalConstants.ymtTheater_tc}
        labelMessage={uiWordings['GlobalConstants.YmtTheaterTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='ymtTheater_sc'
        value={globalConstants.ymtTheater_sc}
        labelMessage={uiWordings['GlobalConstants.YmtTheaterScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='ymtTheater_en'
        value={globalConstants.ymtTheater_en}
        labelMessage={uiWordings['GlobalConstants.YmtTheaterEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='followUs_tc'
        value={globalConstants.followUs_tc}
        labelMessage={uiWordings['GlobalConstants.FollowUsTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='followUs_sc'
        value={globalConstants.followUs_sc}
        labelMessage={uiWordings['GlobalConstants.FollowUsScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='followUs_en'
        value={globalConstants.followUs_en}
        labelMessage={uiWordings['GlobalConstants.FollowUsEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='all_tc'
        value={globalConstants.all_tc}
        labelMessage={uiWordings['GlobalConstants.AllTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='all_sc'
        value={globalConstants.all_sc}
        labelMessage={uiWordings['GlobalConstants.AllScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='all_en'
        value={globalConstants.all_en}
        labelMessage={uiWordings['GlobalConstants.AllEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='boy_tc'
        value={globalConstants.boy_tc}
        labelMessage={uiWordings['GlobalConstants.BoyTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='boy_sc'
        value={globalConstants.boy_sc}
        labelMessage={uiWordings['GlobalConstants.BoyScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='boy_en'
        value={globalConstants.boy_en}
        labelMessage={uiWordings['GlobalConstants.BoyEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='girl_tc'
        value={globalConstants.girl_tc}
        labelMessage={uiWordings['GlobalConstants.GirlTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='girl_sc'
        value={globalConstants.girl_sc}
        labelMessage={uiWordings['GlobalConstants.GirlScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='girl_en'
        value={globalConstants.girl_en}
        labelMessage={uiWordings['GlobalConstants.GirlEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      {!isAddMode && (
        <>
          <LabelLabelPair
            value={globalConstants.lastModifyDTDisplay}
            labelMessage={uiWordings['GlobalConstants.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={globalConstants.lastModifyUserDisplay}
            labelMessage={uiWordings['GlobalConstants.LastModifyUserLabel']}
          />
        </>
      )}
      <SubmitButton
        disabled={!isSubmitEnabled}
        label={
          uiWordings['GlobalConstantsPageEdit.UpdateGlobalConstantsSubmit']
        }
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
