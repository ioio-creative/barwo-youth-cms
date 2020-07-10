import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import ContactsContext from './contactsContext';
import contactsReducer from './contactsReducer';
import Contact from 'models/contact';
import handleServerError from '../handleServerError';
import {
  GET_CONTACTS,
  CLEAR_CONTACTS,
  GET_CONTACT,
  CLEAR_CONTACT,
  ADD_CONTACT,
  UPDATE_CONTACT,
  CONTACTS_ERRORS,
  CLEAR_CONTACTS_ERRORS,
  SET_CONTACTS_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  contacts: null,
  contactsPaginationMeta: null,
  contact: null,
  contactsErrors: null,
  contactsLoading: false
};

const ContactsState = ({ children }) => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  // Get Contacts
  const getContacts = useCallback(async options => {
    dispatch({ type: SET_CONTACTS_LOADING });
    let url = '/api/backend/contacts/contacts';
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
    try {
      const res = await axios.get(url + queryString);
      const { docs, ...meta } = res.data;
      const payload = {
        contacts: docs,
        meta: meta
      };
      dispatch({ type: GET_CONTACTS, payload: payload });
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Contacts
  const clearContacts = useCallback(_ => {
    dispatch({ type: CLEAR_CONTACTS });
  }, []);

  // Get Contact
  const getContact = useCallback(async contactId => {
    if (!contactId) {
      dispatch({
        type: CONTACTS_ERRORS,
        payload: [Contact.contactResponseTypes.CONTACT_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_CONTACTS_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/contacts/contacts/${contactId}`
      );
      dispatch({ type: GET_CONTACT, payload: res.data });
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Contact
  const clearContact = useCallback(_ => {
    dispatch({ type: CLEAR_CONTACT });
  }, []);

  // Add Contact
  const addContact = useCallback(async contact => {
    let newContact = null;
    dispatch({ type: SET_CONTACTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/contacts/contacts',
        contact,
        config
      );
      console.log(res);
      dispatch({ type: ADD_CONTACT, payload: res.data });
      console.log(res.data);
      newContact = res.data;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
      console.error(err);
    }
    return newContact;
  }, []);

  // Update Contact
  const updateContact = useCallback(async contact => {
    let newContact = null;
    dispatch({ type: SET_CONTACTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/contacts/contacts/${contact._id}`,
        contact,
        config
      );
      dispatch({ type: UPDATE_CONTACT, payload: res.data });
      newContact = res.data;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
    return newContact;
  }, []);

  // Clear Contacts Error
  const clearContactsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_CONTACTS_ERRORS });
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        contacts: state.contacts,
        contactsPaginationMeta: state.contactsPaginationMeta,
        contact: state.contact,
        contactsErrors: state.contactsErrors,
        getContacts,
        clearContacts,
        getContact,
        clearContact,
        addContact,
        updateContact,
        clearContactsErrors
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsState;
