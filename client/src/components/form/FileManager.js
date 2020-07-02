import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import './FileManager.css';
import LabelInputTextPair from './LabelInputTextPair';
import MyLabel from './Label';
import MyInputText from './InputText';
import uiWordings from 'globals/uiWordings';

// routes //
// images
// videos
// audios21312fdsaf
// pdfs
// find by name //
// filterText
const paramsToType = {
  images: 'image',
  videos: 'video',
  audios: 'audio',
  pdfs: 'pdf'
};

const media = [
  {
    name: 'Image 01',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Video 01',
    alt: 'this is a sample video',
    type: 'video',
    tags: ['aaa', 'bbb'],
    src: 'http://techslides.com/demos/sample-videos/small.mp4'
  },
  {
    name: 'Audio 01',
    alt: 'this is a sample audio',
    type: 'audio',
    tags: ['ccc'],
    src:
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    name: 'PDF 01',
    alt: 'this is a sample pdf',
    type: 'pdf',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['aaa', 'bbb'],
    src: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc'],
    src: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alt: 'this is a sample image',
    type: 'image',
    tags: ['ccc', 'bbb'],
    src: 'http://placehold.it/300x200?text=Image 6'
  }
];
const tags = [];
// const tags = ["aaa", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc"];

const FileManager = () => {
  //const [showDetails, setShowDetails] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);
  // const [selectedFile, setSelectedFile] = useState('');
  const [selectedFile, setSelectedFile] = useState(-1);
  // const [showDetails, setShowDetails] = useState(false);
  const searchQuery = document.location.search;
  const searchParams = new URLSearchParams(searchQuery);
  const CKEditorFuncNum = searchParams.get('CKEditorFuncNum');

  const { fileType: mediaType, additionalCallbackParam } = useParams();
  console.log(mediaType);

  const returnFileUrl = medium => {
    if (window.opener && window.opener.getMediaData) {
      // not in file selecting window?
      window.opener.getMediaData({
        additionalCallbackParam,
        medium
      });
    } else if (
      window.opener &&
      window.opener.CKEDITOR &&
      window.opener.CKEDITOR.tools
    ) {
      // const medium = ;
      window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, medium['src']);
    }
    window.close();
  };
  const selectTag = tagName => {
    // send request to server?
    // filter locally?
    // .then( refresh )
    setSelectedTag(prevSelectedTag => {
      const searchTagIdx = prevSelectedTag.indexOf(tagName);
      if (searchTagIdx === -1) {
        return [...prevSelectedTag, tagName];
      } else {
        return [
          ...prevSelectedTag.slice(0, searchTagIdx),
          ...prevSelectedTag.slice(searchTagIdx + 1, prevSelectedTag.length)
        ];
      }
    });
  };
  // const toggleDetails = () => {
  //   setShowDetails(prevShowDetails => !prevShowDetails);
  // };
  return (
    <div className={`w3-stretch fileManager`}>
      <div className='search-bar w3-col s9'>
        <div className='w3-container'>
          {tags.length > 0 && (
            <div className='w3-col s9 tags'>
              {tags.map(tag => {
                return (
                  <div
                    className={`w3-border w3-btn${
                      selectedTag.indexOf(tag) !== -1 ? ' w3-blue' : ''
                    } tag`}
                    key={tag}
                    onClick={() => selectTag(tag)}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          )}
          <div className={`w3-col s${tags.length > 0 ? 3 : 6}`}>
            <MyInputText placeholder='Search media items...' />
          </div>
          <div className='w3-col s6 w3-right-align'>
            <label class='w3-btn w3-blue upload-btn'>
              {uiWordings['FileManager.UploadButton']} <input type='file' />
            </label>
          </div>
        </div>
      </div>
      <div className={`w3-col s9 media-list`}>
        <div className='w3-container'>
          <div className='w3-row-padding w3-section w3-stretch media'>
            {media.map((medium, idx) => {
              if (medium['type'] === paramsToType[mediaType]) {
                return (
                  // https://stackoverflow.com/a/25926600
                  <div
                    key={idx}
                    className={`w3-col s3 medium-item${
                      selectedTag.length === 0 ||
                      medium['tags'].some(r => selectedTag.indexOf(r) >= 0)
                        ? ''
                        : ' hidden'
                    }${idx === selectedFile ? ' selected' : ''}`}
                    // onClick={() => setSelectedFile(medium['src'])}
                    onClick={() =>
                      selectedFile === idx
                        ? setSelectedFile(-1)
                        : setSelectedFile(idx)
                    }
                    onDoubleClick={() => returnFileUrl(medium)}
                  >
                    <div className='image-wrapper'>
                      {
                        {
                          image: (
                            <img
                              className='media-preview'
                              src={medium['src']}
                              alt={medium['alt']}
                            />
                          ),
                          video: (
                            <video
                              className='media-preview'
                              src={medium['src']}
                              alt={medium['alt']}
                              preload='metadata'
                            />
                          ),
                          audio: <i className='fa fa-volume-up fa-2x'></i>,
                          pdf: <i className='fa fa-file-pdf-o fa-2x'></i>
                        }[medium['type']]
                      }
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
      <div className='w3-col s3 media-details'>
        {selectedFile !== -1 && (
          <>
            <div className='w3-container'>
              <div className='w3-row w3-section'>
                <MyLabel message='Media Preview' />
                <br />
                {
                  {
                    image: (
                      <img
                        className='media-preview'
                        src={media[selectedFile]['src']}
                        alt={media[selectedFile]['alt']}
                      />
                    ),
                    video: (
                      <video
                        className='media-preview'
                        src={media[selectedFile]['src']}
                        alt={media[selectedFile]['alt']}
                        controls
                        controlsList='nodownload'
                        disablePictureInPicture
                      />
                    ),
                    audio: (
                      <audio
                        className='media-preview'
                        src={media[selectedFile]['src']}
                        alt={media[selectedFile]['alt']}
                        controls
                        controlsList='nodownload'
                      />
                    ),
                    pdf: (
                      <div className='media-preview pdf'>
                        <i class='fa fa-file-pdf-o fa-2x'></i>
                      </div>
                    )
                  }[media[selectedFile]['type']]
                }
              </div>
              <div className='w3-row w3-section'>
                <MyLabel message='Media Url' />
                <a
                  href={media[selectedFile]['src']}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w3-bar w3-button w3-white w3-border media-link'
                >
                  {media[selectedFile]['src']}
                </a>
              </div>
              <LabelInputTextPair
                labelMessage='Name'
                name='name'
                isHalf={false}
                value={media[selectedFile]['name']}
                // onChange direct update
              />
              <LabelInputTextPair
                labelMessage='Alternate text'
                name='name'
                isHalf={false}
                value={media[selectedFile]['alt']}
                // onChange direct update
              />
            </div>
            <div className='select-btn w3-btn w3-blue'>
              {uiWordings['FileManager.SelectFile']}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileManager;
