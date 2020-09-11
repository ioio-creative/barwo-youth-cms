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
  SET_CONTACTS_LOADING,
  DELETE_CONTACT,
  EXPORT_CONTACTS,
  SET_CONTACTS_EXPORT_LOADING,
  IMPORT_CONTACTS,
  SET_CONTACTS_IMPORT_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  contacts: null,
  contactsPaginationMeta: null,
  contact: null,
  contactsErrors: null,
  contactsLoading: false,
  contactsExportLoading: false
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
      dispatch({ type: ADD_CONTACT, payload: res.data });
      newContact = res.data;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
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

  // Delete Contact
  const deleteContact = useCallback(async contactId => {
    let isSuccess = false;
    dispatch({ type: SET_CONTACTS_LOADING });
    try {
      await axios.delete(`/api/backend/contacts/contacts/${contactId}`);
      dispatch({ type: DELETE_CONTACT });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  // Export Contacts
  const exportContacts = useCallback(async _ => {
    let contactsExport = null;
    dispatch({ type: SET_CONTACTS_EXPORT_LOADING });
    try {
      const res = await axios.get(
        'api/backend/contacts/exportAndImport/export'
      );
      dispatch({
        type: EXPORT_CONTACTS
      });
      contactsExport = res.data;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
    return contactsExport;
  }, []);

  // Import Contacts
  const importContacts = useCallback(async file => {
    let isSuccess = false;
    dispatch({ type: SET_CONTACTS_IMPORT_LOADING });
    try {
      const formData = new FormData();
      formData.append('fileImport', file);

      await axios.post('api/backend/contacts/exportAndImport/import', formData);
      dispatch({
        type: IMPORT_CONTACTS
      });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, CONTACTS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        contacts: state.contacts,
        contactsPaginationMeta: state.contactsPaginationMeta,
        contact: state.contact,
        contactsErrors: state.contactsErrors,
        contactsLoading: state.contactsLoading,
        contactsExportLoading: state.contactsExportLoading,
        contactsImportLoading: state.contactsImportLoading,
        getContacts,
        clearContacts,
        getContact,
        clearContact,
        addContact,
        updateContact,
        clearContactsErrors,
        deleteContact,
        exportContacts,
        importContacts
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsState;
