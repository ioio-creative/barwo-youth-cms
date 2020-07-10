import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import ActivitiesContext from './activitiesContext';
import activitiesReducer from './activitiesReducer';
import Activity from 'models/activity';
import handleServerError from '../handleServerError';
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
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  activities: null,
  activitiesPaginationMeta: null,
  activity: null,
  activitiesErrors: null,
  activitiesLoading: false
};

const ActivitiesState = ({ children }) => {
  const [state, dispatch] = useReducer(activitiesReducer, initialState);

  // Get Activities
  const getActivities = useCallback(async options => {
    dispatch({ type: SET_ACTIVITIES_LOADING });
    let url = '/api/backend/activities/activities';
    let queryString = '';
    if (options) {
      const { page, sortOrder, sortBy, filterText, limit } = options;
      queryString = setQueryStringValues(
        {
          page,
          sortOrder,
          sortBy,
          filterText,
          limit
        },
        ''
      );
    }
    //console.log(url + queryString);
    try {
      const res = await axios.get(url + queryString);
      const { docs, ...meta } = res.data;
      const payload = {
        activities: docs,
        meta: meta
      };
      dispatch({ type: GET_ACTIVITIES, payload: payload });
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
  }, []);

  // Clear Activities
  const clearActivities = useCallback(_ => {
    dispatch({ type: CLEAR_ACTIVITIES });
  }, []);

  // Get Activity
  const getActivity = useCallback(async activityId => {
    if (!activityId) {
      dispatch({
        type: ACTIVITIES_ERRORS,
        payload: [Activity.activitiesResponseTypes.ACTIVITY_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_ACTIVITIES_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/activities/activities/${activityId}`
      );
      dispatch({ type: GET_ACTIVITY, payload: res.data });
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
  }, []);

  // Clear Activity
  const clearActivity = useCallback(_ => {
    dispatch({ type: CLEAR_ACTIVITY });
  }, []);

  // Add Activity
  const addActivity = useCallback(async activity => {
    let newActivity = null;
    dispatch({ type: SET_ACTIVITIES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/activities/activities',
        activity,
        config
      );
      dispatch({ type: ADD_ACTIVITY, payload: res.data });
      newActivity = res.data;
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
    return newActivity;
  }, []);

  // Update Activity
  const updateActivity = useCallback(async activity => {
    let newActivity = null;
    dispatch({ type: SET_ACTIVITIES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/activities/activities/${activity._id}`,
        activity,
        config
      );
      dispatch({ type: UPDATE_ACTIVITY, payload: res.data });
      newActivity = res.data;
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
    return newActivity;
  }, []);

  // Clear Activities Error
  const clearActivitiesErrors = useCallback(_ => {
    dispatch({ type: CLEAR_ACTIVITIES_ERRORS });
  }, []);

  return (
    <ActivitiesContext.Provider
      value={{
        activities: state.activities,
        activitiesPaginationMeta: state.activitiesPaginationMeta,
        activity: state.activity,
        activitiesErrors: state.activitiesErrors,
        getActivities,
        clearActivities,
        getActivity,
        clearActivity,
        addActivity,
        updateActivity,
        clearActivitiesErrors
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesState;