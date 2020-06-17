import {
  GET_EVENTS,
  CLEAR_EVENTS,
  GET_EVENT,
  CLEAR_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  EVENTS_ERRORS,
  CLEAR_EVENTS_ERRORS,
  SET_EVENTS_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload.events,
        eventsPaginationMeta: action.payload.meta,
        eventsLoading: false
      };
    case CLEAR_EVENTS:
      return {
        ...state,
        events: null,
        eventsPaginationMeta: null,
        eventsErrors: null
      };
    case GET_EVENT:
      return {
        ...state,
        event: action.payload,
        eventsLoading: false
      };
    case CLEAR_EVENT:
      return {
        ...state,
        event: null
      };
    case ADD_EVENT:
      return {
        ...state,
        eventsLoading: false
      };
    case UPDATE_EVENT:
      return {
        ...state,
        eventsLoading: false
      };
    case EVENTS_ERRORS:
      return {
        ...state,
        eventsErrors: action.payload
      };
    case CLEAR_EVENTS_ERRORS:
      return {
        ...state,
        eventsErrors: null
      };
    case SET_EVENTS_LOADING:
      return {
        ...state,
        eventsLoading: true
      };
    default:
      return state;
  }
};
