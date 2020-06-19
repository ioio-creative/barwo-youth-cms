import React, { useRef } from 'react';
// ckeditor

// import CKEditor from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import CKEditor from 'ckeditor4-react';
// import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
// import DataApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin';
// import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
// import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';
// import setDataInElement from '@ckeditor/ckeditor5-utils/src/dom/setdatainelement';
// import mix from '@ckeditor/ckeditor5-utils/src/mix';
// import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
// import './ckfinder.js';

const Hello = () => {
  const toolbarEl = useRef(null);
  const setToolbar = ref => {
    toolbarEl.current = ref;
  };
  return (
    <>
      <div id='toolbar' ref={setToolbar} />
      <div id='editableArea'>
        <CKEditor
          onChange={event => console.log(event)}
          data='<p>CKEditor 4 example</p>'
          type='classic'
          config={{
            filebrowserBrowseUrl: '/browser/browse.php'
            // filebrowserUploadUrl: '/uploader/upload.php'
          }}
        />
      </div>
      <></>
    </>
  );
};

// proseMirror
// import {EditorState} from "prosemirror-state"
// import {EditorView} from "prosemirror-view"
// import {Schema, DOMParser} from "prosemirror-model"
// import {schema} from "prosemirror-schema-basic"
// import {addListNodes} from "prosemirror-schema-list"
// import {exampleSetup} from "prosemirror-example-setup"

// const Hello = () => {
//   const [editorState, setEditorState] = useState(null);
//   const contentEl = useRef(null);
//   const editorEl = useRef(null);
//   const mySchema = new Schema({
//     nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
//     marks: schema.spec.marks
//   })
//   const initEditor = () => {
//     if (contentEl.current !== null && editorEl.current != null) {
//       new EditorView(editorEl.current, {
//         state: EditorState.create({
//           doc: DOMParser.fromSchema(mySchema).parse(contentEl.current),
//           // plugins: exampleSetup({schema: mySchema})
//         }),
//         // dispatchTransaction: this.dispatchTransaction,
//       });
//     }
//   }
//   const setContentEl = (elementRef) => {
//     contentEl.current = elementRef;
//     initEditor();
//   }
//   const setEditorEl = (elementRef) => {
//     editorEl.current = elementRef;
//     initEditor();
//   }
//   return <div id="editorWrapper">
//     <div ref={setEditorEl} />
//     <div ref={setContentEl} />
//     {/* <EditorView
//       editorState={editorState}
//       onEditorState={setEditorState}
//     /> */}
//   </div>;
// }

export default Hello;
