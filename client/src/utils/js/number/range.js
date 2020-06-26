export function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

const range = (start, end) => [...rangeGenerator(start, end)];

export default range;
