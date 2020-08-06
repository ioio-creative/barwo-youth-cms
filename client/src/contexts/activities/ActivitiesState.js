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
  DELETE_ACTIVITY,
  SET_ACTIVITIES_LOADING,
  GET_ACTIVITIES_FOR_SELECT,
  CLEAR_ACTIVITIES_FOR_SELECT,
  SET_ACTIVITIES_FOR_SELECT_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  activities: null,
  activitiesPaginationMeta: null,
  activity: null,
  activitiesErrors: null,
  activitiesLoading: false,
  activitiesForSelect: null,
  activitiesForSelectLoading: false
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

  // Delete Activity
  const deleteActivity = useCallback(async activityId => {
    let isSuccess = false;
    dispatch({ type: SET_ACTIVITIES_LOADING });
    try {
      await axios.delete(`/api/backend/activities/activities/${activityId}`);
      dispatch({ type: DELETE_ACTIVITY });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  // Get Activites for Select
  const getActivitiesForSelect = useCallback(async _ => {
    dispatch({ type: SET_ACTIVITIES_FOR_SELECT_LOADING });
    try {
      const res = await axios.get(
        '/api/backend/activities/activitiesForSelect'
      );
      dispatch({ type: GET_ACTIVITIES_FOR_SELECT, payload: res.data });
    } catch (err) {
      handleServerError(err, ACTIVITIES_ERRORS, dispatch);
    }
  }, []);

  // Clear Activites for Select
  const clearActivitiesForSelect = useCallback(_ => {
    dispatch({ type: CLEAR_ACTIVITIES_FOR_SELECT });
  }, []);

  return (
    <ActivitiesContext.Provider
      value={{
        activities: state.activities,
        activitiesPaginationMeta: state.activitiesPaginationMeta,
        activity: state.activity,
        activitiesErrors: state.activitiesErrors,
        activitiesLoading: state.activitiesLoading,
        activitiesForSelect: state.activitiesForSelect,
        activitiesForSelectLoading: state.activitiesForSelectLoading,
        getActivities,
        clearActivities,
        getActivity,
        clearActivity,
        addActivity,
        updateActivity,
        clearActivitiesErrors,
        deleteActivity,
        getActivitiesForSelect,
        clearActivitiesForSelect
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesState;
