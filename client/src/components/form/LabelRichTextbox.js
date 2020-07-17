import React from 'react';
import Label from './Label';
import RichTextbox from './RichTextbox';

const LabelRichTextbox = ({
  name,
  value,
  labelMessage,
  onChange,
  required,
  // minLength,
  disabled,
  filebrowserBrowseUrl,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        {required === true ? '*' : ''}
        <RichTextbox
          name={name}
          value={value}
          onChange={onChange}
          debug={false}
          disabled={disabled}
          filebrowserBrowseUrl={filebrowserBrowseUrl}
          required={required}
        />
      </div>
    </div>
  );
};

LabelRichTextbox.defaultProps = {
  isHalf: false
};

export default LabelRichTextbox;
