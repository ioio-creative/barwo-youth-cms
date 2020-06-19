import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const FileManager = () => {
  const CKEditorFuncNum = useParams('CKEditorFuncNum');
  const returnFileUrl = () => {
    const fileUrl = 'http://placehold.it/300x200';
    window.opener.CKEDITOR.tools.callFunction( CKEditorFuncNum, fileUrl);
  }
  return <div>
    <button onClick={returnFileUrl}>click me</button>
  </div>;
};

export default FileManager;
