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

export default (state, action) => {
  switch (action.type) {
    case GET_PHASES:
      return {
        ...state,
        phases: action.payload.phases,
        phasesPaginationMeta: action.payload.meta,
        phasesLoading: false
      };
    case CLEAR_PHASES:
      return {
        ...state,
        phases: null,
        phasesPaginationMeta: null,
        phasesErrors: null
      };
    case GET_PHASE:
      return {
        ...state,
        phase: action.payload,
        phasesLoading: false
      };
    case CLEAR_PHASE:
      return {
        ...state,
        phase: null
      };
    case ADD_PHASE:
      return {
        ...state,
        phasesLoading: false
      };
    case UPDATE_PHASE:
      return {
        ...state,
        phasesLoading: false
      };
    case PHASES_ERRORS:
      return {
        ...state,
        phasesErrors: action.payload
      };
    case CLEAR_PHASES_ERRORS:
      return {
        ...state,
        phasesErrors: null
      };
    case SET_PHASES_LOADING:
      return {
        ...state,
        phasesLoading: true
      };
    default:
      return state;
  }
};
