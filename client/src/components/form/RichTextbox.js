import React, { useCallback, useEffect, useState, useRef } from 'react';
import CKEditor from 'ckeditor4-react';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import cleanValueForTextInput from './utils/cleanValueForTextInput';

const RichTextbox = ({
  className,
  name,
  value = null,
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
  const [editorInstance, setEditorInstance] = useState(null);
  const handleChange = useCallback(
    event => {
      invokeIfIsFunction(onChange, {
        ...event,
        target: {
          ...event.target,
          name: name,
          value: event.editor.getData()
        }
      });
      // setValue(event.editor.getData());
    },
    [name, onChange]
  );
  useEffect(() => {
    if (editorInstance && value !== "") {
      waitForInstanceInitialized();
    }
  }, [editorInstance, value])
  const waitForInstanceInitialized = () => {
    if (editorInstance.editor) {
      if (editorInstance.editor.status == 'loaded') {
        editorInstance.editor.setData(value);
        console.log('loaded');
      } else {
        editorInstance.editor.on('instanceReady', () => {
          console.log('instanceReady');
          editorInstance.editor.setData(value);
        })
      }
    } else {
      // console.log('??? case');
      // why the instance not yet finish initialization ......
      setTimeout(waitForInstanceInitialized, 50);
    }
  }
  return (
    <>
      <div className={`editableArea ${className}`}>
        <textarea
          name={name}
          value={cleanValueForTextInput(value)}
          hidden={!debug}
          readOnly={true}
        />
        <CKEditor
          onChange={handleChange}
          ref={setEditorInstance}
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
