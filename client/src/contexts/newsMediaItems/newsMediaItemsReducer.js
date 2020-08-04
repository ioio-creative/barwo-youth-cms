import {
  GET_NEWS_MEDIA_ITEMS,
  CLEAR_NEWS_MEDIA_ITEMS,
  GET_NEWS_MEDIA_ITEM,
  CLEAR_NEWS_MEDIA_ITEM,
  ADD_NEWS_MEDIA_ITEM,
  UPDATE_NEWS_MEDIA_ITEM,
  NEWS_MEDIA_ITEMS_ERRORS,
  CLEAR_NEWS_MEDIA_ITEMS_ERRORS,
  SET_NEWS_MEDIA_ITEMS_LOADING,
  DELETE_NEWS_MEDIA_ITEM,
  GET_NEWS_MEDIA_ITEMS_FOR_GROUPING,
  CLEAR_NEWS_MEDIA_ITEMS_FOR_GROUPING,
  SET_NEWS_MEDIA_ITEMS_FOR_GROUPING_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_NEWS_MEDIA_ITEMS:
      return {
        ...state,
        newsMediaItems: action.payload.newsMediaItems,
        newsMediaItemsPaginationMeta: action.payload.meta,
        newsMediaItemsLoading: false
      };
    case CLEAR_NEWS_MEDIA_ITEMS:
      return {
        ...state,
        newsMediaItems: null,
        newsMediaItemsPaginationMeta: null,
        newsMediaItemsErrors: null
      };
    case GET_NEWS_MEDIA_ITEM:
      return {
        ...state,
        newsMediaItem: action.payload,
        newsMediaItemsLoading: false
      };
    case CLEAR_NEWS_MEDIA_ITEM:
      return {
        ...state,
        newsMediaItem: null,
        newsMediaItemsErrors: null
      };
    case ADD_NEWS_MEDIA_ITEM:
      return {
        ...state,
        newsMediaItemsLoading: false
      };
    case UPDATE_NEWS_MEDIA_ITEM:
      return {
        ...state,
        newsMediaItemsLoading: false
      };
    case NEWS_MEDIA_ITEMS_ERRORS:
      return {
        ...state,
        newsMediaItemsErrors: action.payload,
        newsMediaItemsLoading: false,
        newsMediaItemsForGroupingLoading: false
      };
    case CLEAR_NEWS_MEDIA_ITEMS_ERRORS:
      return {
        ...state,
        newsMediaItemsErrors: null
      };
    case DELETE_NEWS_MEDIA_ITEM:
      return {
        ...state,
        newsMediaItemsLoading: false
      };
    case SET_NEWS_MEDIA_ITEMS_LOADING:
      return {
        ...state,
        newsMediaItemsLoading: true
      };
    case GET_NEWS_MEDIA_ITEMS_FOR_GROUPING:
      return {
        ...state,
        newsMediaItemsForGrouping: action.payload,
        newsMediaItemsForGroupingLoading: false
      };
    case CLEAR_NEWS_MEDIA_ITEMS_FOR_GROUPING:
      return {
        ...state,
        newsMediaItemsForGrouping: null,
        newsMediaItemsErrors: null
      };
    case SET_NEWS_MEDIA_ITEMS_FOR_GROUPING_LOADING:
      return {
        ...state,
        newsMediaItemsForGroupingLoading: true
      };
    default:
      return state;
  }
};
