import {
  GET_ACTIVITIES,
  CLEAR_ACTIVITIES,
  GET_ACTIVITY,
  CLEAR_ACTIVITY,
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  ACTIVITIES_ERRORS,
  CLEAR_ACTIVITIES_ERRORS,
  DELETE_ACTIVITY,
  SET_ACTIVITIES_LOADING,
  GET_ACTIVITIES_FOR_SELECT,
  CLEAR_ACTIVITIES_FOR_SELECT,
  SET_ACTIVITIES_FOR_SELECT_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload.activities,
        activitiesPaginationMeta: action.payload.meta,
        activitiesLoading: false
      };
    case CLEAR_ACTIVITIES:
      return {
        ...state,
        activities: null,
        activitiesPaginationMeta: null,
        activitiesErrors: null
      };
    case GET_ACTIVITY:
      return {
        ...state,
        activity: action.payload,
        activitiesLoading: false
      };
    case CLEAR_ACTIVITY:
      return {
        ...state,
        activity: null
      };
    case ADD_ACTIVITY:
      return {
        ...state,
        activitiesLoading: false
      };
    case UPDATE_ACTIVITY:
      return {
        ...state,
        activitiesLoading: false
      };
    case ACTIVITIES_ERRORS:
      return {
        ...state,
        activitiesErrors: action.payload,
        activitiesLoading: false,
        activitiesForSelectLoading: false
      };
    case CLEAR_ACTIVITIES_ERRORS:
      return {
        ...state,
        activitiesErrors: null
      };
    case DELETE_ACTIVITY:
      return {
        ...state,
        activitiesLoading: false
      };
    case SET_ACTIVITIES_LOADING:
      return {
        ...state,
        activitiesLoading: true
      };
    case GET_ACTIVITIES_FOR_SELECT:
      return {
        ...state,
        activitiesForSelect: action.payload,
        activitiesForSelectLoading: false
      };
    case CLEAR_ACTIVITIES_FOR_SELECT:
      return {
        ...state,
        activitiesForSelect: null,
        activitiesErrors: null
      };
    case SET_ACTIVITIES_FOR_SELECT_LOADING:
      return {
        ...state,
        activitiesForSelectLoading: true
      };
    default:
      return state;
  }
};
