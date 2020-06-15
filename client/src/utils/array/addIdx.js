export default (array) => {
  return array.map((element, idx) => ({
    ...element,
    idx: idx + 1
  }));
}