import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import generalResponses from 'types/responses/general';

const handleServerError = (err, dispatchType, dispatchFunc) => {
  const dispatchContent = { type: dispatchType };
  // usually validation errors
  if (
    err &&
    err.response &&
    err.response.data &&
    isNonEmptyArray(err.response.data.errors)
  ) {
    dispatchContent.payload = err.response.data.errors;
  } else {
    console.log(err);
    dispatchContent.payload = [generalResponses.CLIENT_ERROR.type];
  }
  dispatchFunc(dispatchContent);
};

export default handleServerError;
