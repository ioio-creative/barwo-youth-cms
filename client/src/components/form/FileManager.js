import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const media = [
  {
    "name": "Image 1 (a, b)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["aaa", "bbb"],
    "src": "http://placehold.it/300x200?text=Image 1",
  },
  {
    "name": "Image 2 (c)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["ccc"],
    "src": "http://placehold.it/300x200?text=Image 2",
  },
  {
    "name": "Image 3 (b, c)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["ccc", "bbb"],
    "src": "http://placehold.it/300x200?text=Image 3",
  },
]
const tags = ["aaa", "bbb", "ccc"];
const FileManager = () => {
  const searchQuery = document.location.search;
  const searchParams = new URLSearchParams(searchQuery);
  const CKEditorFuncNum = searchParams.get('CKEditorFuncNum');
  const returnFileUrl = (fileUrl) => {
    if (window.opener && window.opener.CKEDITOR && window.opener.CKEDITOR.tools) {
      // const fileUrl = ;
      window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, fileUrl);
      window.close();
    } else {
      // not in file selecting window?
    }
  }
  const selectTag = (tagName) => {
    // send request to server?
    // filter locally?
    // .then( refresh )
  }
  const selectFile = () => {
    // ???
  }
  return <div className="fileManager">
    <div className="tags">
      {tags.map(tag => {
        return <div className="tag" onClick={() => selectTag(tag['name'])}>
          {tag['display']}
        </div>
      })}
    </div>
    <div className="w3-row-padding w3-section w3-stretch media">
      {media.map(medium => {
        return (
          <div className="w3-col s4 medium"
            onClick={() => selectFile(medium['src'])}
            onDoubleClick={() => returnFileUrl(medium['src'])}
          >
            <div class="w3-card">
              <img className="w3-image w3-round" alt={medium['alt']} src={medium['src']} />
              <div className="w3-container">
                <h4>{medium['name']}</h4>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>;
};

export default FileManager;
