export const compareForStringsAscending = (str1, str2) => {
  if (str1 < str2) {
    return -1;
  }
  if (str1 > str2) {
    return 1;
  }
  return 0;
};

export const compareForStringsDescending = (str1, str2) => {
  return -1 * compareForStringsAscending(str1, str2);
};
