import React, { useState, useRef } from 'react';
// ckeditor

import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

const Hello = () => {
  const toolbarEl = useRef(null);
  const setToolbar = (ref) => {
    toolbarEl.current = ref;
  }
  return <>
    <div id="toolbar" ref={setToolbar} />
    <div id="editableArea" style={{
      height: 500
    }}>
      <CKEditor
        onInit={ editor => {
            console.log( 'Editor is ready to use!', editor );
            toolbarEl.current.append( editor.ui.view.toolbar.element );
        } }
        style={{
          height: '100%'
        }}
        onChange={ ( event, editor ) => console.log( { event, editor } ) }
        editor={ DecoupledEditor }
        data="<p>Hello from CKEditor 5's DecoupledEditor!</p>"
        config={ /* the editor configuration */ }
      />
    </div>
  </>;
}


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

