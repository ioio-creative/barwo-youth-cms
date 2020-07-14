import React, { useCallback } from 'react';
import FileUpload from 'components/form/FileUpload';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import uiWordings from 'globals/uiWordings';
import firstOrDefault from 'utils/js/array/firstOrDefault';

const fileUploadOrUrlTypes = {
  MEDIUM: {
    value: 'MEDIUM',
    label: uiWordings['FileUploadOrUrl.Types.Medium.Label']
  },
  URL: {
    value: 'URL',
    label: uiWordings['FileUploadOrUrl.Types.Url.Label']
  }
};

const fileUploadOrUrlTypeOptions = Object.values(fileUploadOrUrlTypes);

const FileUploadOrUrl = ({
  nameTcLabelMessage,
  nameScLabelMessage,
  nameEnLabelMessage,
  selectLabelMessage,
  mediumLabelMessage,
  urlTcLabelMessage,
  urlScLabelMessage,
  urlEnLabelMessage,
  data,
  onChange
}) => {
  const {
    type,
    name_tc,
    name_sc,
    name_en,
    mediumType,
    medium,
    url_tc,
    url_sc,
    url_en
  } = data;

  /* event handlers */

  const handleChange = useCallback(
    e => {
      onChange({
        ...data,
        [e.target.name]: e.target.value
      });
    },
    [data, onChange]
  );

  const onGetMedium = useCallback(
    newItemList => {
      onChange({
        ...data,
        medium: firstOrDefault(newItemList, null)
      });
    },
    [data, onChange]
  );

  /* end of event handlers */

  return (
    <>
      <LabelInputTextPair
        name='name_tc'
        value={name_tc}
        labelMessage={nameTcLabelMessage}
        placeholder=''
        onChange={handleChange}
        required={true}
      />
      <LabelInputTextPair
        name='name_sc'
        value={name_sc}
        labelMessage={nameScLabelMessage}
        placeholder=''
        onChange={handleChange}
        required={true}
      />
      <LabelInputTextPair
        name='name_en'
        value={name_en}
        labelMessage={nameEnLabelMessage}
        placeholder=''
        onChange={handleChange}
        required={true}
      />

      <LabelSelectPair
        name='type'
        value={type.value}
        options={fileUploadOrUrlTypeOptions}
        labelMessage={selectLabelMessage}
        onChange={handleChange}
      />

      {type === fileUploadOrUrlTypes.MEDIUM.value && (
        <FileUpload
          name='medium'
          labelMessage={mediumLabelMessage}
          files={medium ? [medium] : null}
          onGetFiles={onGetMedium}
          isMultiple={false}
          mediumType={mediumType}
        />
      )}

      {type === fileUploadOrUrlTypes.URL.value && (
        <>
          <LabelInputTextPair
            name='url_tc'
            value={url_tc}
            labelMessage={urlTcLabelMessage}
            placeholder=''
            onChange={handleChange}
            required={true}
          />
          <LabelInputTextPair
            name='url_sc'
            value={url_sc}
            labelMessage={urlScLabelMessage}
            placeholder=''
            onChange={handleChange}
            required={true}
          />
          <LabelInputTextPair
            name='url_en'
            value={url_en}
            labelMessage={urlEnLabelMessage}
            placeholder=''
            onChange={handleChange}
            required={true}
          />
        </>
      )}
    </>
  );
};

export default FileUploadOrUrl;

export { fileUploadOrUrlTypes };
