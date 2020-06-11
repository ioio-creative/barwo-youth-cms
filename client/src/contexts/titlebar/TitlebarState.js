import React, { useReducer, useCallback } from 'react';
import TitlebarContext from './titlebarContext';
import titlebarReducer from './titlebarReducer';
import { SET_TITLE, REMOVE_TITLE } from '../types';

const initialState = '';

const TitleState = ({ children }) => {
  const [state, dispatch] = useReducer(titlebarReducer, initialState);

  // Set Title
  const setTitle = useCallback(title => {
    dispatch({ type: SET_TITLE, payload: title });
  }, []);

  // Remove Title
  const removeTitle = useCallback(_ => {
    dispatch({ type: REMOVE_TITLE });
  }, []);

  return (
    <TitlebarContext.Provider
      value={{
        title: state,
        setTitle,
        removeTitle
      }}
    >
      {children}
    </TitlebarContext.Provider>
  );
};

export default TitleState;
