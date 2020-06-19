export default displayFieldNames => {
  return sortByString => {
    let cleanedSortByString = sortByString;
    // remove 'Display'
    if (displayFieldNames.includes(sortByString)) {
      cleanedSortByString = sortByString.substring(
        0,
        sortByString.length - 'Display'.length
      );
    }
    return cleanedSortByString;
  };
};
