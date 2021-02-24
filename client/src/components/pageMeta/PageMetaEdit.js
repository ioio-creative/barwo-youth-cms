import React, { useCallback } from 'react';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTextAreaPair from 'components/form/LabelTextAreaPair';
import LabelRichTextbox from 'components/form/LabelRichTextbox';
import FileUpload from 'components/form/FileUpload';
import uiWordings from 'globals/uiWordings';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import firstOrDefault from 'utils/js/array/firstOrDefault';

const emptyPageMeta = new PageMeta();
const defaultState = emptyPageMeta;

const mediumTypes = Medium.mediumTypes;

const PageMetaEdit = ({
  pageMeta,
  setPageMetaFunc,
  title,
  isHideOptionalFields,
  rftDescription = false
}) => {
  /* event handlers */

  const handleChange = useCallback(
    e => {
      const name = e.target.name;
      const value = e.target.value;
      setPageMetaFunc(prevPageMeta => ({
        ...prevPageMeta,
        [name]: value
      }));
    },
    [setPageMetaFunc]
  );

  const handleGetOgImagePicked = useCallback(
    newItemList => {
      setPageMetaFunc(prevPageMeta => ({
        ...prevPageMeta,
        ogImage: firstOrDefault(newItemList, null)
      }));
    },
    [setPageMetaFunc]
  );

  /* end of event handlers */

  const {
    title_tc,
    title_sc,
    title_en,

    description_tc,
    description_sc,
    description_en,

    ogSiteName_tc,
    ogSiteName_sc,
    ogSiteName_en,

    ogTitle_tc,
    ogTitle_sc,
    ogTitle_en,

    ogDescription_tc,
    ogDescription_sc,
    ogDescription_en,

    ogImage,

    ogImageAlt_tc,
    ogImageAlt_sc,
    ogImageAlt_en,

    facebookAppId
  } = pageMeta;

  return (
    <>
      {title && <h4>{title}</h4>}
      <LabelInputTextPair
        name='title_tc'
        value={title_tc}
        labelMessage={uiWordings['PageMeta.TitleTcLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='title_sc'
        value={title_sc}
        labelMessage={uiWordings['PageMeta.TitleScLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='title_en'
        value={title_en}
        labelMessage={uiWordings['PageMeta.TitleEnLabel']}
        placeholder=''
        onChange={handleChange}
      />

      <LabelInputTextPair
        name='ogTitle_tc'
        value={ogTitle_tc}
        labelMessage={uiWordings['PageMeta.OgTitleTcLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogTitle_sc'
        value={ogTitle_sc}
        labelMessage={uiWordings['PageMeta.OgTitleScLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogTitle_en'
        value={ogTitle_en}
        labelMessage={uiWordings['PageMeta.OgTitleEnLabel']}
        placeholder=''
        onChange={handleChange}
      />
      {rftDescription? 
      <>
        <LabelRichTextbox
          name='description_tc'
          value={description_tc}
          labelMessage={uiWordings['PageMeta.DescriptionTcLabel']}
          onChange={handleChange}
          placeholder=''
        />
        <LabelRichTextbox
          name='description_sc'
          value={description_sc}
          labelMessage={uiWordings['PageMeta.DescriptionScLabel']}
          onChange={handleChange}
          placeholder=''
        />
        <LabelRichTextbox
          name='description_en'
          value={description_en}
          labelMessage={uiWordings['PageMeta.DescriptionEnLabel']}
          onChange={handleChange}
          placeholder=''
        />
      </>:
      <>
        <LabelTextAreaPair
          name='description_tc'
          value={description_tc}
          labelMessage={uiWordings['PageMeta.DescriptionTcLabel']}
          onChange={handleChange}
          placeholder=''
        />
        <LabelTextAreaPair
          name='description_sc'
          value={description_sc}
          labelMessage={uiWordings['PageMeta.DescriptionScLabel']}
          onChange={handleChange}
          placeholder=''
        />
        <LabelTextAreaPair
          name='description_en'
          value={description_en}
          labelMessage={uiWordings['PageMeta.DescriptionEnLabel']}
          onChange={handleChange}
          placeholder=''
        />
      </>}

      <LabelTextAreaPair
        name='ogDescription_tc'
        value={ogDescription_tc}
        labelMessage={uiWordings['PageMeta.OgDescriptionTcLabel']}
        onChange={handleChange}
        placeholder=''
      />
      <LabelTextAreaPair
        name='ogDescription_sc'
        value={ogDescription_sc}
        labelMessage={uiWordings['PageMeta.OgDescriptionScLabel']}
        onChange={handleChange}
        placeholder=''
      />
      <LabelTextAreaPair
        name='ogDescription_en'
        value={ogDescription_en}
        labelMessage={uiWordings['PageMeta.OgDescriptionEnLabel']}
        onChange={handleChange}
        placeholder=''
      />

      <LabelInputTextPair
        name='ogSiteName_tc'
        value={ogSiteName_tc}
        labelMessage={uiWordings['PageMeta.OgSiteNameTcLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogSiteName_sc'
        value={ogSiteName_sc}
        labelMessage={uiWordings['PageMeta.OgSiteNameScLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogSiteName_en'
        value={ogSiteName_en}
        labelMessage={uiWordings['PageMeta.OgSiteNameEnLabel']}
        placeholder=''
        onChange={handleChange}
      />

      <FileUpload
        name='ogImage'
        labelMessage={uiWordings['PageMeta.OgImageLabel']}
        files={ogImage ? [ogImage] : null}
        onGetFiles={handleGetOgImagePicked}
        isMultiple={false}
        mediumType={mediumTypes.IMAGE}
      />

      <LabelInputTextPair
        name='ogImageAlt_tc'
        value={ogImageAlt_tc}
        labelMessage={uiWordings['PageMeta.OgImageAltTcLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogImageAlt_sc'
        value={ogImageAlt_sc}
        labelMessage={uiWordings['PageMeta.OgImageAltScLabel']}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='ogImageAlt_en'
        value={ogImageAlt_en}
        labelMessage={uiWordings['PageMeta.OgImageAltEnLabel']}
        placeholder=''
        onChange={handleChange}
      />

      {!isHideOptionalFields && (
        <LabelInputTextPair
          name='facebookAppId'
          value={facebookAppId}
          labelMessage={uiWordings['PageMeta.FacebookAppIdLabel']}
          placeholder=''
          onChange={handleChange}
        />
      )}
    </>
  );
};

PageMetaEdit.defaultProps = {
  pageMeta: defaultState,
  title: uiWordings['PageMeta.Title'],
  isHideOptionalFields: false
};

export default PageMetaEdit;
