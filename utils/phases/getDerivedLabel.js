const getDerivedLabel = (year, phaseNumber) => {
  return (
    year.toString().padStart(4, '0') +
    '_' +
    phaseNumber.toString().padStart(2, '0')
  );
};

module.exports = getDerivedLabel;
