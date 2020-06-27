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
import Form from 'components/form/Form';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Event from 'models/event';
import Phase from 'models/phase';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyPhase = new Phase();
const defaultState = emptyPhase;

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
    clearPhasesErrors
  } = useContext(PhasesContext);

  // phase
  const [phase, setPhase] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

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
      if (!phasesLoading) {
        setPhase(
          fetchedPhase ? Phase.getPhaseForDisplay(fetchedPhase) : defaultState
        );
        if (fetchedPhase) {
          if (isNonEmptyArray(fetchedPhase.events)) {
            setEventsPicked(fetchedPhase.events);
          }
        }
        setIsAddMode(!fetchedPhase);
      }
    },
    [phasesLoading, fetchedPhase, setPhase, setIsAddMode]
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
      setPhase({ ...phase, [e.target.name]: e.target.value });
    },
    [phase, setPhase, removeAlerts, setIsSubmitEnabled]
  );

  const onGetEventsPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setEventsPicked(newItemList);
    },
    [setEventsPicked, setIsSubmitEnabled]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add events
      phase.events = getArraySafe(eventsPicked).map(event => event._id);

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

        goToUrl(routes.phaseEditByIdWithValue(true, returnedPhase._id));
        setPhase(returnedPhase);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updatePhase,
      addPhase,
      setPhase,
      phase,
      eventsPicked,
      setAlerts,
      removeAlerts,
      validInput
    ]
  );

  /* end of event handlers */

  if (phasesLoading) {
    return <Loading />;
  }

  const backToPhaseListButton = (
    <Form>
      <LinkButton to={routes.phaseList(true)}>
        {uiWordings['PhaseEdit.BackToPhaseList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToPhaseListButton}</>;
  }

  return (
    <>
      {backToPhaseListButton}

      <Form onSubmit={onSubmit}>
        <h4>
          {isAddMode
            ? uiWordings['PhaseEdit.AddPhaseTitle']
            : uiWordings['PhaseEdit.EditPhaseTitle']}
        </h4>

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

        <PhaseEditEventSelect
          eventsPicked={eventsPicked}
          onGetEventsPicked={onGetEventsPicked}
        />

        <LabelTogglePair
          name='isEnabled'
          value={phase.isEnabled}
          labelMessage={uiWordings['Phase.IsEnabledLabel']}
          onChange={onChange}
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
