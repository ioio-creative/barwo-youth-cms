const cleanValueForTextInput = value => {
  let cleanedValue = value;
  if ([undefined, null].includes(value)) {
    cleanedValue = '';
  } else if (!(value instanceof String)) {
    cleanedValue = value.toString();
  }
  return cleanedValue;
};

export default cleanValueForTextInput;
