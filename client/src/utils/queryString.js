import qs from 'query-string';

// https://medium.com/swlh/using-react-hooks-to-sync-your-component-state-with-the-url-query-string-81ccdfcb174f

export const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  return `?${newQsValue}`;
};

export const setQueryStringValues = (
  queryStringObj,
  queryString = window.location.search
) => {
  const qsObj = qs.parse(queryString);
  const newQsObj = {
    ...qsObj,
    ...queryStringObj
  };
  // delete empty fields
  Object.keys(newQsObj).forEach(key => {
    if (['', null, undefined].includes(newQsObj[key])) {
      delete newQsObj[key];
    }
  });
  const newQsStr = qs.stringify(newQsObj);
  return `?${newQsStr}`;
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};

export const getQueryStringValues = (queryString = window.location.search) => {
  return qs.parse(queryString);
};
