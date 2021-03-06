import React, { useCallback } from 'react';
import FileUpload from 'components/form/FileUpload';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import {
  mediumLinkTypes,
  mediumLinkTypeOptions,
  defaultMediumLinkType
} from 'types/mediumLink';
import firstOrDefault from 'utils/js/array/firstOrDefault';

const FileUploadOrUrl = ({
  nameTcLabelMessage,
  nameScLabelMessage,
  nameEnLabelMessage,
  selectLabelMessage,
  mediumLabelMessage,
  urlTcLabelMessage,
  urlScLabelMessage,
  urlEnLabelMessage,
  mediumType,
  data,
  onChange
}) => {
  let {
    type,
    name_tc,
    name_sc,
    name_en,
    medium,
    url_tc,
    url_sc,
    url_en
  } = data;

  type = type || defaultMediumLinkType.value;
  data.type = type;

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

  //console.log(medium);

  return (
    <div className='w3-card w3-container w3-margin-bottom'>
      <LabelSelectPair
        name='type'
        value={type}
        options={mediumLinkTypeOptions}
        labelMessage={selectLabelMessage}
        onChange={handleChange}
      />

      <LabelInputTextPair
        name='name_tc'
        value={name_tc}
        labelMessage={nameTcLabelMessage}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='name_sc'
        value={name_sc}
        labelMessage={nameScLabelMessage}
        placeholder=''
        onChange={handleChange}
      />
      <LabelInputTextPair
        name='name_en'
        value={name_en}
        labelMessage={nameEnLabelMessage}
        placeholder=''
        onChange={handleChange}
      />

      {type === mediumLinkTypes.MEDIUM.value && (
        <FileUpload
          name='medium'
          labelMessage={mediumLabelMessage}
          files={medium ? [medium] : null}
          onGetFiles={onGetMedium}
          isMultiple={false}
          mediumType={mediumType}
        />
      )}

      {type === mediumLinkTypes.URL.value && (
        <>
          <LabelInputTextPair
            name='url_tc'
            value={url_tc}
            labelMessage={urlTcLabelMessage}
            placeholder=''
            onChange={handleChange}
          />
          <LabelInputTextPair
            name='url_sc'
            value={url_sc}
            labelMessage={urlScLabelMessage}
            placeholder=''
            onChange={handleChange}
          />
          <LabelInputTextPair
            name='url_en'
            value={url_en}
            labelMessage={urlEnLabelMessage}
            placeholder=''
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
};

export default FileUploadOrUrl;
