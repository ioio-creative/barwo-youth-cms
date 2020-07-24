const { getEntityPropByLanguage } = require('../../globals/languages');

module.exports = (pageMeta, language) => {
  return {
    title: getEntityPropByLanguage(pageMeta, 'title', language),
    description: getEntityPropByLanguage(pageMeta, 'description', language),
    ogSiteName: getEntityPropByLanguage(pageMeta, 'ogSiteName', language),
    ogTitle: getEntityPropByLanguage(pageMeta, 'title', language),
    ogDescription: getEntityPropByLanguage(pageMeta, 'ogDescription', language),
    ogImage: {
      src: pageMeta.ogImage && pageMeta.ogImage.url
    },
    ogImageAlt: getEntityPropByLanguage(pageMeta, 'ogImageAlt', language),
    // TODO:
    // ogImageWidth: 1200,
    // ogImageHeight: 630,
    facebookAppId: pageMeta.facebookAppId
  };
};
