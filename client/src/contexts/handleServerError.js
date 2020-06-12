import isNonEmptyArray from 'utils/array/isNonEmptyArray';

const handleServerError = (err, dispatchType, dispatchFunc) => {
  const dispatchContent = { type: dispatchType };
  // usually validation errors
  if (isNonEmptyArray(err.response.data.errors)) {
    dispatchContent.payload = err.response.data.errors;
  } else {
    dispatchContent.payload = null;
  }
  dispatchFunc(dispatchContent);
};

export default handleServerError;
