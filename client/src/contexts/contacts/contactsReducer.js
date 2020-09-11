import {
  GET_CONTACTS,
  CLEAR_CONTACTS,
  GET_CONTACT,
  CLEAR_CONTACT,
  ADD_CONTACT,
  UPDATE_CONTACT,
  CONTACTS_ERRORS,
  CLEAR_CONTACTS_ERRORS,
  DELETE_CONTACT,
  SET_CONTACTS_LOADING,
  EXPORT_CONTACTS,
  SET_CONTACTS_EXPORT_LOADING,
  IMPORT_CONTACTS,
  SET_CONTACTS_IMPORT_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contacts: action.payload.contacts,
        contactsPaginationMeta: action.payload.meta,
        contactsLoading: false
      };
    case CLEAR_CONTACTS:
      return {
        ...state,
        contacts: null,
        contactsPaginationMeta: null,
        contactsErrors: null
      };
    case GET_CONTACT:
      return {
        ...state,
        contact: action.payload,
        contactsLoading: false
      };
    case CLEAR_CONTACT:
      return {
        ...state,
        contact: null,
        contactsErrors: null
      };
    case ADD_CONTACT:
      return {
        ...state,
        contactsLoading: false
      };
    case UPDATE_CONTACT:
      return {
        ...state,
        contactsLoading: false
      };
    case CONTACTS_ERRORS:
      return {
        ...state,
        contactsErrors: action.payload,
        contactsLoading: false,
        contactsExportLoading: false,
        contactsImportLoading: false
      };
    case CLEAR_CONTACTS_ERRORS:
      return {
        ...state,
        contactsErrors: null
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contactsLoading: false
      };
    case SET_CONTACTS_LOADING:
      return {
        ...state,
        contactsLoading: true
      };
    case EXPORT_CONTACTS:
      return {
        ...state,
        contactsExportLoading: false
      };
    case SET_CONTACTS_EXPORT_LOADING:
      return {
        ...state,
        contactsExportLoading: true
      };
    case IMPORT_CONTACTS:
      return {
        ...state,
        contactsImportLoading: false
      };
    case SET_CONTACTS_IMPORT_LOADING:
      return {
        ...state,
        contactsImportLoading: true
      };
    default:
      return state;
  }
};
