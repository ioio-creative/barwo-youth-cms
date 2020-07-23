import React, { useCallback, useEffect, useState, useMemo } from 'react';
import CKEditor from 'ckeditor4-react';
import routes from 'globals/routes';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import cleanValueForTextInput from './utils/cleanValueForTextInput';

const defaultConfig = {
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
};

const RichTextbox = ({
  className,
  name,
  value,
  onChange,
  required,
  minLength,
  disabled,
  filebrowserBrowseUrl,
  debug,
  config
}) => {
  /* derived values */

  const cleanedValue = useMemo(
    _ => {
      return cleanValueForTextInput(value);
    },
    [value]
  );

  /* end of derived values */

  /* states */

  const [editorInstance, setEditorInstance] = useState(null);
  // const [textareaEl, setTextareaEl] = useState(null);
  const [isInitCompleted, setIsInitCompleted] = useState(false);

  /* end of states */

  /* methods */

  const waitForInstanceInitialized = useCallback(
    _ => {
      if (editorInstance.editor && editorInstance.editor.status === 'ready') {
        if (!isInitCompleted) {
          if (editorInstance.editor.getData() === '' && cleanedValue !== '') {
            // if (editorInstance.editor.getData() !== cleanedValue) {
            //   console.log("special case");
            // }
            editorInstance.editor.setData(cleanedValue);
            console.log('RichTextbox loaded');
            // set every 50ms until successfully set
            setTimeout(waitForInstanceInitialized, 50);
          } else {
            setIsInitCompleted(true);
            console.log('RichTextbox cleanedValue set success');
            //
            // editorInstance.element.closest('form').addEventListener('submit', (e) => {
            //   console.log('onSubmit');
            //   e.preventDefault();
            //   return false;
            // }, { passive: false })
            // editorInstance.editor.document.$.body.innerText
          }
        }
      } else {
        // TODO: is it alright to do recursion when using react useCallback???
        console.log('RichTextbox ??? case');
        // why the instance not yet finish initialization ......
        setTimeout(waitForInstanceInitialized, 50);
      }
    },
    [cleanedValue, editorInstance, isInitCompleted]
  );

  /* end of methods */

  /* event handlers */

  const handleChange = useCallback(
    event => {
      if (isInitCompleted) {
        invokeIfIsFunction(onChange, {
          ...event,
          target: {
            ...event.target,
            name: name,
            value: event.editor.getData()
          }
        });
      }
      // setValue(event.editor.getData());
    },
    [name, onChange, isInitCompleted]
  );

  /* end of event handlers */

  /* useEffects */

  useEffect(() => {
    // cleanedValue check null commented out by chris
    if (editorInstance /*&& cleanedValue !== ''*/ && !isInitCompleted) {
      waitForInstanceInitialized();
    }
  }, [
    //cleanedValue,
    editorInstance,
    isInitCompleted,
    waitForInstanceInitialized
  ]);

  // useEffect(() => {
  //   if (textareaEl) {
  //     window.CKEDITOR.replace(textareaEl);
  //   }
  // }, [textareaEl])

  /* end of useEffects */

  // console.log(
  //   editorInstance && editorInstance.editor && editorInstance.editor.element
  // );

  return (
    <>
      <div className={`editableArea ${className ? className : ''}`}>
        <textarea
          name={name}
          // ref={setTextareaEl}
          value={cleanedValue}
          hidden={!debug}
          readOnly={true}
          required={required}
        />
        <CKEditor
          onChange={handleChange}
          ref={setEditorInstance}
          type='classic'
          config={{
            ...config,
            filebrowserBrowseUrl: filebrowserBrowseUrl,
            readOnly: disabled
          }}
        />
      </div>
    </>
  );
};

RichTextbox.defaultProps = {
  config: defaultConfig,
  debug: false,
  filebrowserBrowseUrl: routes.fileManagerForImages(true),
  value: null
};

export default RichTextbox;
