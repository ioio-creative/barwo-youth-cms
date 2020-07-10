import {
  GET_ACTIVITIES,
  CLEAR_ACTIVITIES,
  GET_ACTIVITY,
  CLEAR_ACTIVITY,
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  ACTIVITIES_ERRORS,
  CLEAR_ACTIVITIES_ERRORS,
  SET_ACTIVITIES_LOADING
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
        activitiesErrors: action.payload
      };
    case CLEAR_ACTIVITIES_ERRORS:
      return {
        ...state,
        activitiesErrors: null
      };
    case SET_ACTIVITIES_LOADING:
      return {
        ...state,
        activitiesLoading: true
      };
    default:
      return state;
  }
};
