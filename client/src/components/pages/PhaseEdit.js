import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import EventsState from 'contexts/events/EventsState';
import EventsContext from 'contexts/events/eventsContext';
import PhasesContext from 'contexts/phases/phasesContext';
import PhasesPageContainer from 'components/phases/PhasesPageContainer';
import PhaseEditEventSelect from 'components/phases/PhaseEditEventSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelSelectPair from 'components/form/LabelSelectPair';
import ColorPickerModal from 'components/form/ColorPickerModal';
import LabelDatePickerPair from 'components/form/LabelDatePickerPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import Event from 'models/event';
import Phase from 'models/phase';
import Medium from 'models/medium';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import { formatDateString } from 'utils/datetime';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyPhase = new Phase();
const defaultState = emptyPhase;

const mediumTypes = Medium.mediumTypes;

const PhaseEdit = _ => {
  const { phaseId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    eventsErrors,
    clearEventsErrors,
    getPhaseEvents,
    clearPhaseEvents
  } = useContext(EventsContext);
  const {
    phase: fetchedPhase,
    phasesErrors,
    phasesLoading,
    getPhase,
    clearPhase,
    addPhase,
    updatePhase,
    clearPhasesErrors,
    deletePhase
  } = useContext(PhasesContext);

  // phase
  const [phase, setPhase] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // downloadMedium
  const [downloadMediumPicked, setDownloadMediumPicked] = useState(null);

  // events in phase
  const [eventsPicked, setEventsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getPhaseEvents();
    return _ => {
      clearPhaseEvents();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // phaseId
  useEffect(
    _ => {
      if (phaseId) {
        getPhase(phaseId);
      }

      return _ => {
        clearPhase();
      };
    },
    [phaseId, getPhase, clearPhase]
  );

  // fetchedPhase
  useEffect(
    _ => {
      setPhase(
        fetchedPhase ? Phase.getPhaseForDisplay(fetchedPhase) : defaultState
      );
      if (fetchedPhase) {
        setDownloadMediumPicked(fetchedPhase.downloadMedium);
        setEventsPicked(getArraySafe(fetchedPhase.events));
      }
      setIsAddMode(!fetchedPhase);
    },
    [fetchedPhase]
  );

  // phasesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(phasesErrors)) {
        setAlerts(
          phasesErrors.map(phasesError => {
            return new Alert(
              Phase.phasesResponseTypes[phasesError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearPhasesErrors();

        if (
          phasesErrors.includes(Phase.phasesResponseTypes.PHASE_NOT_EXISTS.type)
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [phasesErrors, setAlerts, clearPhasesErrors]
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

  /* methods */

  const validInput = useCallback(phaseInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setPhase(prevPhase => ({ ...prevPhase, [name]: value }));
    },
    [removeAlerts]
  );

  const onGetDownloadMediumPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setDownloadMediumPicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetEventsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setEventsPicked(newItemList);
  }, []);

  const phaseDelete = useCallback(
    async _ => {
      const isSuccess = await deletePhase(phaseId);
      if (isSuccess) {
        goToUrl(routes.phaseList(true));
        setAlerts(
          new Alert(
            uiWordings['PhaseEdit.DeletePhaseSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [phaseId, deletePhase, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add downloadMedium
      phase.downloadMedium = downloadMediumPicked
        ? downloadMediumPicked._id
        : null;

      // add events
      phase.events = getArraySafe(eventsPicked).map(event => event._id);

      // format dates
      phase.fromDate = formatDateString(phase.fromDate);
      phase.toDate = formatDateString(phase.toDate);

      let isSuccess = validInput(phase);
      let returnedPhase = null;

      if (isSuccess) {
        const funcToCall = isAddMode ? addPhase : updatePhase;
        returnedPhase = await funcToCall(phase);
        isSuccess = Boolean(returnedPhase);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['PhaseEdit.AddPhaseSuccessMessage']
              : uiWordings['PhaseEdit.UpdatePhaseSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getPhase(returnedPhase._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updatePhase,
      addPhase,
      getPhase,
      phase,
      eventsPicked,
      setAlerts,
      removeAlerts,
      validInput,
      downloadMediumPicked
    ]
  );

  /* end of event handlers */

  if (phasesLoading) {
    return <Loading />;
  }

  const backToPhaseListButton = (
    <GroupContainer>
      <LinkButton to={routes.phaseList(true)}>
        {uiWordings['PhaseEdit.BackToPhaseList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToPhaseListButton}</>;
  }

  return (
    <>
      {backToPhaseListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m6'>
            <h4>
              {isAddMode
                ? uiWordings['PhaseEdit.AddPhaseTitle']
                : uiWordings['PhaseEdit.EditPhaseTitle']}
            </h4>
          </div>
          <div className='w3-rest w3-row'>
            <div className='w3-col m6'>
              <ColorPickerModal
                name='themeColor'
                value={phase.themeColor || defaultState.themeColor}
                labelMessage={uiWordings['Phase.ThemeColorLabel']}
                onChange={onChange}
              />
            </div>
            <div className='w3-col m6'>
              <Label
                htmlFor='isEnabled'
                message={uiWordings['Phase.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={phase.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelSelectPair
          name='year'
          value={phase.year}
          options={Phase.yearOptions}
          labelMessage={uiWordings['Phase.YearLabel']}
          onChange={onChange}
        />
        <LabelSelectPair
          name='phaseNumber'
          value={phase.phaseNumber}
          options={Phase.phaseNumberOptions}
          labelMessage={uiWordings['Phase.PhaseNumberLabel']}
          onChange={onChange}
        />

        <LabelDatePickerPair
          name='fromDate'
          value={phase.fromDate}
          labelMessage={uiWordings['Phase.FromDateLabel']}
          placeholder={uiWordings['PhaseEdit.SelectFromDatePlaceholder']}
          onChange={onChange}
        />
        <LabelDatePickerPair
          name='toDate'
          value={phase.toDate}
          labelMessage={uiWordings['Phase.ToDateLabel']}
          placeholder={uiWordings['PhaseEdit.SelectToDatePlaceholder']}
          onChange={onChange}
        />

        <LabelInputTextPair
          name='ticketSaleRemarks_tc'
          value={phase.ticketSaleRemarks_tc}
          labelMessage={uiWordings['Phase.TicketSaleRemarksTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='ticketSaleRemarks_sc'
          value={phase.ticketSaleRemarks_sc}
          labelMessage={uiWordings['Phase.TicketSaleRemarksScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='ticketSaleRemarks_en'
          value={phase.ticketSaleRemarks_en}
          labelMessage={uiWordings['Phase.TicketSaleRemarksEnLabel']}
          placeholder=''
          onChange={onChange}
        />

        <LabelInputTextPair
          name='downloadName_tc'
          value={phase.downloadName_tc}
          labelMessage={uiWordings['Phase.DownloadNameTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='downloadName_sc'
          value={phase.downloadName_sc}
          labelMessage={uiWordings['Phase.DownloadNameScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='downloadName_en'
          value={phase.downloadName_en}
          labelMessage={uiWordings['Phase.DownloadNameEnLabel']}
          placeholder=''
          onChange={onChange}
        />

        <FileUpload
          name='downloadMedium'
          labelMessage={uiWordings['Phase.DownloadMediumLabel']}
          files={downloadMediumPicked ? [downloadMediumPicked] : null}
          onGetFiles={onGetDownloadMediumPicked}
          isMultiple={false}
          mediumType={mediumTypes.PDF}
        />

        <PhaseEditEventSelect
          eventsPicked={eventsPicked}
          onGetEventsPicked={onGetEventsPicked}
        />

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={phase.createDTDisplay}
              labelMessage={uiWordings['Phase.CreateDTLabel']}
            />
            <LabelLabelPair
              value={phase.lastModifyDTDisplay}
              labelMessage={uiWordings['Phase.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={phase.lastModifyUserDisplay}
              labelMessage={uiWordings['Phase.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['PhaseEdit.AddPhaseSubmit']
              : uiWordings['PhaseEdit.UpdatePhaseSubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={phaseDelete}>
              {uiWordings['PhaseEdit.DeletePhase']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const PhaseEditWithContainer = _ => (
  <PhasesPageContainer>
    <EventsState>
      <PhaseEdit />
    </EventsState>
  </PhasesPageContainer>
);

export default PhaseEditWithContainer;
