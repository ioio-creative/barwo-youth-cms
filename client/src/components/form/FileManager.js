import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './FileManager.css';

// routes //
// images
// videos
// audios
// pdfs
// find by name //
// filterText

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
    "src": "http://placehold.it/400x200?text=Image 2",
  },
  {
    "name": "Image 3 (b, c)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["ccc", "bbb"],
    "src": "http://placehold.it/400x300?text=Image 3",
  },
  {
    "name": "Image 4 (a, b)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["aaa", "bbb"],
    "src": "http://placehold.it/400x225?text=Image 4",
  },
  {
    "name": "Image 5 (c)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["ccc"],
    "src": "http://placehold.it/300x200?text=Image 5",
  },
  {
    "name": "Image 6 (b, c)",
    "alt": "this is a sample image",
    "type": "image",
    "tags": ["ccc", "bbb"],
    "src": "http://placehold.it/300x200?text=Image 6",
  },
]
const tags = ["aaa", "bbb", "ccc"];

const FileManager = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);
  // const [showDetails, setShowDetails] = useState(false);
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
    setSelectedTag((prevSelectedTag) => {
      const searchTagIdx = prevSelectedTag.indexOf(tagName);
      if (searchTagIdx === -1) {
        return [
          ...prevSelectedTag,
          tagName
        ];
      } else {
        return [
          ...prevSelectedTag.slice(0, searchTagIdx),
          ...prevSelectedTag.slice(searchTagIdx + 1, prevSelectedTag.length)
        ];
      }
    })
  }
  const selectFile = () => {
    // ???
  }
  const toggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  }
  return <div className={`fileManager${showDetails ? " show" : ""}`}>
    <div className="w3-row-padding w3-section w3-stretch tags">
      {tags.map(tag => {
        return <div className={`w3-border w3-btn${selectedTag.indexOf(tag) !== -1 ? ' w3-blue' : ''} tag`} key={tag} onClick={() => selectTag(tag)}>
          {tag}
        </div>
      })}
    </div>
    <div className="w3-row-padding w3-section w3-stretch media">
      {media.map(medium => {
        return (
          <div className={`w3-col s4 medium w3-margin-bottom`}
            onClick={() => selectFile(medium['src'])}
            onDoubleClick={() => returnFileUrl(medium['src'])}
          >
            <div class="w3-card">
              <div className="image-wrapper">
                <img className="w3-image w3-modal-content w3-round" alt={medium['alt']} src={medium['src']} />

              </div>
              <div className="w3-container">
                <h4>{medium['name']}</h4>
              </div>
            </div>
          </div>
        )
      })}
    </div>
    <div className="media-details-toggle-btn" onClick={toggleDetails}>
      <i className="fa fa-caret-up" />
      <i className="fa fa-caret-down" />
    </div>
    <div className="media-details">
      <div className="media-details-wrapper">
      </div>
      <div className="medium-wrapper w3-col s4">
      </div>
    </div>
  </div>;
};

export default FileManager;
