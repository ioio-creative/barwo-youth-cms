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

      <LabelInputTextPair
        name='inherit_tc'
        value={globalConstants.inherit_tc}
        labelMessage={uiWordings['GlobalConstants.InheritTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='inherit_sc'
        value={globalConstants.inherit_sc}
        labelMessage={uiWordings['GlobalConstants.InheritScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='inherit_en'
        value={globalConstants.inherit_en}
        labelMessage={uiWordings['GlobalConstants.InheritEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='share_tc'
        value={globalConstants.share_tc}
        labelMessage={uiWordings['GlobalConstants.ShareTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='share_sc'
        value={globalConstants.share_sc}
        labelMessage={uiWordings['GlobalConstants.ShareScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='share_en'
        value={globalConstants.share_en}
        labelMessage={uiWordings['GlobalConstants.ShareEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='relatedShow_tc'
        value={globalConstants.relatedShow_tc}
        labelMessage={uiWordings['GlobalConstants.RelatedShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedShow_sc'
        value={globalConstants.relatedShow_sc}
        labelMessage={uiWordings['GlobalConstants.RelatedShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedShow_en'
        value={globalConstants.relatedShow_en}
        labelMessage={uiWordings['GlobalConstants.RelatedShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='relatedArtists_tc'
        value={globalConstants.relatedArtists_tc}
        labelMessage={uiWordings['GlobalConstants.RelatedArtistsTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedArtists_sc'
        value={globalConstants.relatedArtists_sc}
        labelMessage={uiWordings['GlobalConstants.RelatedArtistsScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedArtists_en'
        value={globalConstants.relatedArtists_en}
        labelMessage={uiWordings['GlobalConstants.RelatedArtistsEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='relatedDrama_tc'
        value={globalConstants.relatedDrama_tc}
        labelMessage={uiWordings['GlobalConstants.RelatedDramaTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedDrama_sc'
        value={globalConstants.relatedDrama_sc}
        labelMessage={uiWordings['GlobalConstants.RelatedDramaScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='relatedDrama_en'
        value={globalConstants.relatedDrama_en}
        labelMessage={uiWordings['GlobalConstants.RelatedDramaEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='allShows_tc'
        value={globalConstants.allShows_tc}
        labelMessage={uiWordings['GlobalConstants.AllShowsTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='allShows_sc'
        value={globalConstants.allShows_sc}
        labelMessage={uiWordings['GlobalConstants.AllShowsScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='allShows_en'
        value={globalConstants.allShows_en}
        labelMessage={uiWordings['GlobalConstants.AllShowsEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='more_tc'
        value={globalConstants.more_tc}
        labelMessage={uiWordings['GlobalConstants.MoreTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='more_sc'
        value={globalConstants.more_sc}
        labelMessage={uiWordings['GlobalConstants.MoreScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='more_en'
        value={globalConstants.more_en}
        labelMessage={uiWordings['GlobalConstants.MoreEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='scenarist_tc'
        value={globalConstants.scenarist_tc}
        labelMessage={uiWordings['GlobalConstants.ScenaristTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='scenarist_sc'
        value={globalConstants.scenarist_sc}
        labelMessage={uiWordings['GlobalConstants.ScenaristScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='scenarist_en'
        value={globalConstants.scenarist_en}
        labelMessage={uiWordings['GlobalConstants.ScenaristEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='introduction_tc'
        value={globalConstants.introduction_tc}
        labelMessage={uiWordings['GlobalConstants.IntroductionTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='introduction_sc'
        value={globalConstants.introduction_sc}
        labelMessage={uiWordings['GlobalConstants.IntroductionScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='introduction_en'
        value={globalConstants.introduction_en}
        labelMessage={uiWordings['GlobalConstants.IntroductionEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='buyNow_tc'
        value={globalConstants.buyNow_tc}
        labelMessage={uiWordings['GlobalConstants.BuyNowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='buyNow_sc'
        value={globalConstants.buyNow_sc}
        labelMessage={uiWordings['GlobalConstants.BuyNowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='buyNow_en'
        value={globalConstants.buyNow_en}
        labelMessage={uiWordings['GlobalConstants.BuyNowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='participating_tc'
        value={globalConstants.participating_tc}
        labelMessage={uiWordings['GlobalConstants.ParticipatingTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='participating_sc'
        value={globalConstants.participating_sc}
        labelMessage={uiWordings['GlobalConstants.ParticipatingScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='participating_en'
        value={globalConstants.participating_en}
        labelMessage={uiWordings['GlobalConstants.ParticipatingEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='role_tc'
        value={globalConstants.role_tc}
        labelMessage={uiWordings['GlobalConstants.RoleTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='role_sc'
        value={globalConstants.role_sc}
        labelMessage={uiWordings['GlobalConstants.RoleScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='role_en'
        value={globalConstants.role_en}
        labelMessage={uiWordings['GlobalConstants.RoleEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='studentShow_tc'
        value={globalConstants.studentShow_tc}
        labelMessage={uiWordings['GlobalConstants.StudentShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='studentShow_sc'
        value={globalConstants.studentShow_sc}
        labelMessage={uiWordings['GlobalConstants.StudentShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='studentShow_en'
        value={globalConstants.studentShow_en}
        labelMessage={uiWordings['GlobalConstants.StudentShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='nextSchedule_tc'
        value={globalConstants.nextSchedule_tc}
        labelMessage={uiWordings['GlobalConstants.NextScheduleTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='nextSchedule_sc'
        value={globalConstants.nextSchedule_sc}
        labelMessage={uiWordings['GlobalConstants.NextScheduleScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='nextSchedule_en'
        value={globalConstants.nextSchedule_en}
        labelMessage={uiWordings['GlobalConstants.NextScheduleEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='leaveContact_tc'
        value={globalConstants.leaveContact_tc}
        labelMessage={uiWordings['GlobalConstants.LeaveContactTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='leaveContact_sc'
        value={globalConstants.leaveContact_sc}
        labelMessage={uiWordings['GlobalConstants.LeaveContactScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='leaveContact_en'
        value={globalConstants.leaveContact_en}
        labelMessage={uiWordings['GlobalConstants.LeaveContactEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='publicShow_tc'
        value={globalConstants.publicShow_tc}
        labelMessage={uiWordings['GlobalConstants.PublicShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='publicShow_sc'
        value={globalConstants.publicShow_sc}
        labelMessage={uiWordings['GlobalConstants.PublicShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='publicShow_en'
        value={globalConstants.publicShow_en}
        labelMessage={uiWordings['GlobalConstants.PublicShowEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='programOfShow_tc'
        value={globalConstants.programOfShow_tc}
        labelMessage={uiWordings['GlobalConstants.ProgramOfShowTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='programOfShow_sc'
        value={globalConstants.programOfShow_sc}
        labelMessage={uiWordings['GlobalConstants.ProgramOfShowScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='programOfShow_en'
        value={globalConstants.programOfShow_en}
        labelMessage={uiWordings['GlobalConstants.ProgramOfShowEnLabel']}
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