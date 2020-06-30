import React, { useCallback } from 'react';
import CKEditor from 'ckeditor4-react';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

const RichTextbox = ({
  className,
  name,
  value,
  onChange,
  required,
  minLength,
  disabled,
  filebrowserBrowseUrl,
  debug = false,
  config = {
    uiColor: '#f8f8f8',
    // removeButtons: 'Source, Styles, wsc, spellchecker, Scayt',
    // https://stackoverflow.com/questions/23538462/how-to-remove-buttons-from-ckeditor-4
    toolbar: [
      {
        name: 'document',
        groups: ['mode', 'document', 'doctools'],
        items: [
          'Source',
          '-',
          'Save',
          'NewPage',
          'Preview',
          'Print',
          '-',
          'Templates'
        ]
      },
      {
        name: 'clipboard',
        groups: ['clipboard', 'undo'],
        items: [
          'Cut',
          'Copy',
          'Paste',
          'PasteText',
          'PasteFromWord',
          '-',
          'Undo',
          'Redo'
        ]
      },
      {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker'],
        items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']
      },
      {
        name: 'forms',
        items: [
          'Form',
          'Checkbox',
          'Radio',
          'TextField',
          'Textarea',
          'Select',
          'Button',
          'ImageButton',
          'HiddenField'
        ]
      },
      '/',
      {
        name: 'basicstyles',
        groups: ['basicstyles', 'cleanup'],
        items: [
          'Bold',
          'Italic',
          'Underline',
          'Strike',
          'Subscript',
          'Superscript',
          '-',
          'RemoveFormat'
        ]
      },
      {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
        items: [
          'NumberedList',
          'BulletedList',
          '-',
          'Outdent',
          'Indent',
          '-',
          'Blockquote',
          'CreateDiv',
          '-',
          'JustifyLeft',
          'JustifyCenter',
          'JustifyRight',
          'JustifyBlock',
          '-',
          'BidiLtr',
          'BidiRtl',
          'Language'
        ]
      },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      {
        name: 'insert',
        items: [
          'Image',
          'Flash',
          'Table',
          'HorizontalRule',
          'Smiley',
          'SpecialChar',
          'PageBreak',
          'Iframe'
        ]
      },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
      { name: 'others', items: ['-'] },
      { name: 'about', items: ['About'] }
    ]
  }
}) => {
  const handleChange = useCallback(
    event => {
      invokeIfIsFunction(onChange, {
        target: {
          name: name,
          value: event.editor.getData()
        }
      });
    },
    [name, onChange]
  );

  return (
    <>
      <div className={`editableArea ${className}`}>
        <textarea name={name} value={value} hidden={!debug} />
        <CKEditor
          onChange={handleChange}
          ref={ref => console.log(ref)}
          data={value}
          type='classic'
          config={{
            filebrowserBrowseUrl: filebrowserBrowseUrl,
            ...config
          }}
        />
      </div>
    </>
  );
};

export default RichTextbox;
