const mediumLinkTypes = {
  MEDIUM: {
    value: 'MEDIUM',
    label: 'Medium'
  },
  URL: {
    value: 'URL',
    label: 'URL'
  }
};

const mediumLinkTypeOptions = Object.values(mediumLinkTypes);

const defaultMediumLinkType = mediumLinkTypes.MEDIUM;

export { mediumLinkTypes, mediumLinkTypeOptions, defaultMediumLinkType };
