import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import EventsContext from './eventsContext';
import eventsReducer from './eventsReducer';
import Event from 'models/event';
import handleServerError from '../handleServerError';
import {
  GET_EVENTS,
  CLEAR_EVENTS,
  GET_EVENT,
  CLEAR_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  EVENTS_ERRORS,
  CLEAR_EVENTS_ERRORS,
  SET_EVENTS_LOADING,
  GET_PHASE_EVENTS,
  CLEAR_PHASE_EVENTS,
  SET_PHASE_EVENTS_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  events: null,
  eventsPaginationMeta: null,
  event: null,
  eventsErrors: null,
  eventsLoading: false,
  phaseEvents: null,
  phaseEventsLoading: null
};

const EventsState = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  // Get Events
  const getEvents = useCallback(async options => {
    dispatch({ type: SET_EVENTS_LOADING });
    let url = '/api/backend/events/events';
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
        events: docs,
        meta: meta
      };
      dispatch({ type: GET_EVENTS, payload: payload });
    } catch (err) {
      handleServerError(err, EVENTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Events
  const clearEvents = useCallback(_ => {
    dispatch({ type: CLEAR_EVENTS });
  }, []);

  // Get Event
  const getEvent = useCallback(async eventId => {
    if (!eventId) {
      dispatch({
        type: EVENTS_ERRORS,
        payload: [Event.eventsResponseTypes.EVENT_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_EVENTS_LOADING });
    try {
      const res = await axios.get(`/api/backend/events/events/${eventId}`);
      dispatch({ type: GET_EVENT, payload: res.data });
    } catch (err) {
      handleServerError(err, EVENTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Event
  const clearEvent = useCallback(_ => {
    dispatch({ type: CLEAR_EVENT });
  }, []);

  // Add Event
  const addEvent = useCallback(async event => {
    let newEvent = null;
    dispatch({ type: SET_EVENTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/backend/events/events', event, config);
      dispatch({ type: ADD_EVENT, payload: res.data });
      newEvent = res.data;
    } catch (err) {
      handleServerError(err, EVENTS_ERRORS, dispatch);
    }
    return newEvent;
  }, []);

  // Update Event
  const updateEvent = useCallback(async event => {
    let newEvent = null;
    dispatch({ type: SET_EVENTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/events/events/${event._id}`,
        event,
        config
      );
      dispatch({ type: UPDATE_EVENT, payload: res.data });
      newEvent = res.data;
    } catch (err) {
      handleServerError(err, EVENTS_ERRORS, dispatch);
    }
    return newEvent;
  }, []);

  // Clear Events Error
  const clearEventsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_EVENTS_ERRORS });
  }, []);

  // Get Phase Events
  const getPhaseEvents = useCallback(async _ => {
    dispatch({ type: SET_PHASE_EVENTS_LOADING });
    try {
      const res = await axios.get('/api/backend/events/phaseEvents');
      dispatch({ type: GET_PHASE_EVENTS, payload: res.data });
    } catch (err) {
      handleServerError(err, EVENTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Phase Events
  const clearPhaseEvents = useCallback(_ => {
    dispatch({ type: CLEAR_PHASE_EVENTS });
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events: state.events,
        eventsPaginationMeta: state.eventsPaginationMeta,
        event: state.event,
        eventsErrors: state.eventsErrors,
        phaseEvents: state.phaseEvents,
        phaseEventsLoading: state.phaseEventsLoading,
        getEvents,
        clearEvents,
        getEvent,
        clearEvent,
        addEvent,
        updateEvent,
        clearEventsErrors,
        getPhaseEvents,
        clearPhaseEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export default EventsState;
