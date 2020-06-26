import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import PhasesContext from './phasesContext';
import phasesReducer from './phasesReducer';
import Phase from 'models/phase';
import handleServerError from '../handleServerError';
import {
  GET_PHASES,
  CLEAR_PHASES,
  GET_PHASE,
  CLEAR_PHASE,
  ADD_PHASE,
  UPDATE_PHASE,
  PHASES_ERRORS,
  CLEAR_PHASES_ERRORS,
  SET_PHASES_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  phases: null,
  phasesPaginationMeta: null,
  phase: null,
  phasesErrors: null,
  phasesLoading: false
};

const PhasesState = ({ children }) => {
  const [state, dispatch] = useReducer(phasesReducer, initialState);

  // Get Phases
  const getPhases = useCallback(async options => {
    dispatch({ type: SET_PHASES_LOADING });
    let url = '/api/backend/phases/phases';
    let queryString = '';
    if (options) {
      const { page, sortOrder, sortBy, filterText } = options;
      queryString = setQueryStringValues(
        {
          page,
          sortOrder,
          sortBy,
          filterText
        },
        ''
      );
    }
    //console.log(url + queryString);
    try {
      const res = await axios.get(url + queryString);
      const { docs, ...meta } = res.data;
      const payload = {
        phases: docs,
        meta: meta
      };
      dispatch({ type: GET_PHASES, payload: payload });
    } catch (err) {
      handleServerError(err, PHASES_ERRORS, dispatch);
    }
  }, []);

  // Clear Phases
  const clearPhases = useCallback(_ => {
    dispatch({ type: CLEAR_PHASES });
  }, []);

  // Get Phase
  const getPhase = useCallback(async phaseId => {
    if (!phaseId) {
      dispatch({
        type: PHASES_ERRORS,
        payload: [Phase.phasesResponseTypes.PHASE_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_PHASES_LOADING });
    try {
      const res = await axios.get(`/api/backend/phases/phases/${phaseId}`);
      dispatch({ type: GET_PHASE, payload: res.data });
    } catch (err) {
      handleServerError(err, PHASES_ERRORS, dispatch);
    }
  }, []);

  // Clear Phase
  const clearPhase = useCallback(_ => {
    dispatch({ type: CLEAR_PHASE });
  }, []);

  // Add Phase
  const addPhase = useCallback(async phase => {
    let newPhase = null;
    dispatch({ type: SET_PHASES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/backend/phases/phases', phase, config);
      dispatch({ type: ADD_PHASE, payload: res.data });
      newPhase = res.data;
    } catch (err) {
      handleServerError(err, PHASES_ERRORS, dispatch);
    }
    return newPhase;
  }, []);

  // Update Phase
  const updatePhase = useCallback(async phase => {
    let newPhase = null;
    dispatch({ type: SET_PHASES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/phases/phases/${phase._id}`,
        phase,
        config
      );
      dispatch({ type: UPDATE_PHASE, payload: res.data });
      newPhase = res.data;
    } catch (err) {
      handleServerError(err, PHASES_ERRORS, dispatch);
    }
    return newPhase;
  }, []);

  // Clear Phases Error
  const clearPhasesErrors = useCallback(_ => {
    dispatch({ type: CLEAR_PHASES_ERRORS });
  }, []);

  return (
    <PhasesContext.Provider
      value={{
        phases: state.phases,
        phasesPaginationMeta: state.phasesPaginationMeta,
        phase: state.phase,
        phasesErrors: state.phasesErrors,
        getPhases,
        clearPhases,
        getPhase,
        clearPhase,
        addPhase,
        updatePhase,
        clearPhasesErrors
      }}
    >
      {children}
    </PhasesContext.Provider>
  );
};

export default PhasesState;
