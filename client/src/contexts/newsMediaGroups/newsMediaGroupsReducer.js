import {
  GET_NEWS_MEDIA_GROUPS,
  CLEAR_NEWS_MEDIA_GROUPS,
  GET_NEWS_MEDIA_GROUP,
  CLEAR_NEWS_MEDIA_GROUP,
  ADD_NEWS_MEDIA_GROUP,
  UPDATE_NEWS_MEDIA_GROUP,
  NEWS_MEDIA_GROUPS_ERRORS,
  CLEAR_NEWS_MEDIA_GROUPS_ERRORS,
  SET_NEWS_MEDIA_GROUPS_LOADING,
  DELETE_NEWS_MEDIA_GROUP,
  GET_NEWS_MEDIA_GROUPS_IN_ORDER,
  CLEAR_NEWS_MEDIA_GROUPS_IN_ORDER,
  ORDER_NEWS_MEDIA_GROUPS,
  SET_NEWS_MEDIA_GROUPS_IN_ORDER_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_NEWS_MEDIA_GROUPS:
      return {
        ...state,
        newsMediaGroups: action.payload.newsMediaGroups,
        newsMediaGroupsPaginationMeta: action.payload.meta,
        newsMediaGroupsLoading: false
      };
    case CLEAR_NEWS_MEDIA_GROUPS:
      return {
        ...state,
        newsMediaGroups: null,
        newsMediaGroupsPaginationMeta: null,
        newsMediaGroupsErrors: null
      };
    case GET_NEWS_MEDIA_GROUP:
      return {
        ...state,
        newsMediaGroup: action.payload,
        newsMediaGroupsLoading: false
      };
    case CLEAR_NEWS_MEDIA_GROUP:
      return {
        ...state,
        newsMediaGroup: null,
        newsMediaGroupsErrors: null
      };
    case ADD_NEWS_MEDIA_GROUP:
      return {
        ...state,
        newsMediaGroupsLoading: false
      };
    case UPDATE_NEWS_MEDIA_GROUP:
      return {
        ...state,
        newsMediaGroupsLoading: false
      };
    case NEWS_MEDIA_GROUPS_ERRORS:
      return {
        ...state,
        newsMediaGroupsErrors: action.payload,
        newsMediaGroupsLoading: false,
        newsMediaGroupsInOrderLoading: false
      };
    case CLEAR_NEWS_MEDIA_GROUPS_ERRORS:
      return {
        ...state,
        newsMediaGroupsErrors: null
      };
    case DELETE_NEWS_MEDIA_GROUP:
      return {
        ...state,
        newsMediaGroupsLoading: false
      };
    case SET_NEWS_MEDIA_GROUPS_LOADING:
      return {
        ...state,
        newsMediaGroupsLoading: true
      };
    case GET_NEWS_MEDIA_GROUPS_IN_ORDER:
      return {
        ...state,
        newsMediaGroupsInOrder: action.payload,
        newsMediaGroupsInOrderLoading: false
      };
    case CLEAR_NEWS_MEDIA_GROUPS_IN_ORDER:
      return {
        ...state,
        newsMediaGroupsInOrder: null,
        newsMediaGroupsErrors: null
      };
    case ORDER_NEWS_MEDIA_GROUPS:
      return {
        ...state,
        newsMediaGroupsInOrderLoading: false
      };
    case SET_NEWS_MEDIA_GROUPS_IN_ORDER_LOADING:
      return {
        ...state,
        newsMediaGroupsInOrderLoading: true
      };
    default:
      return state;
  }
};
