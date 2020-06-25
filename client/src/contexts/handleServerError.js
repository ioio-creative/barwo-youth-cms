import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
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
    console.log(error);
    //console.log(JSON.stringify(err, null, 2));
    let error = generalResponses.CLIENT_ERROR;
    if (err.message.includes('500')) {
      error = generalResponses.SERVER_ERROR;
    }
    dispatchContent.payload = [error.type];
  }
  dispatchFunc(dispatchContent);
};

export default handleServerError;
