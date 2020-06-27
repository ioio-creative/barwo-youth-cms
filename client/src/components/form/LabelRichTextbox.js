import React from 'react';
import Label from './Label';
import RichTextbox from './RichTextbox';

const LabelRichTextbox = ({
  className,
  name,
  value,
  labelMessage,
  onChange = () => {},
  // required,
  // minLength,
  disabled,
  filebrowserBrowseUrl,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <br />
        <RichTextbox
          className={className}
          name={name}
          value={value}
          //onChange={onChange}
          // debug={true}
          disabled={disabled}
          filebrowserBrowseUrl={filebrowserBrowseUrl}
        />
      </div>
    </div>
  );
};

/* <RichTextbox
      // debug={true}
      onChange={(e) => console.log(e)}
      filebrowserBrowseUrl={routes.fileManager}
  />
    <FileManager /> */

LabelRichTextbox.defaultProps = {
  isHalf: false
};

export default LabelRichTextbox;
