import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext
} from 'react';
import { useParams } from 'react-router-dom';

import MediaState from 'contexts/media/MediaState';
import MediaContext from 'contexts/media/mediaContext';
import Medium from 'models/medium';

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
  images: 'IMAGE',
  videos: 'video',
  audios: 'audio',
  pdfs: 'pdf'
};

const tags = [];
// const tags = ["aaa", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc"];

const UploadingElement = ({
  // uploadedPercent,
  file,
  onComplete
}) => {
  const { addMedium } = useContext(MediaContext);
  const [uploadedPercent, setUploadedPercent] = useState(0);

  useEffect(() => {
    const formData = new FormData();

    // https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
    // for (const file of files) {
    formData.append('media', file);
    // }

    const additonalFormData = {
      alernativeText: 'alt',
      tags: [],
      isEnabled: true
    };

    for (const pair of Object.entries(additonalFormData)) {
      formData.append(pair[0], pair[1]);
    }

    console.log('formData to upload:');
    for (const pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    const addMediumPromise = addMedium(Medium.mediumTypes.IMAGE, formData, {
      onUploadProgress: event => {
        setUploadedPercent((event.loaded / event.total) * 100);
      }
    });
    addMediumPromise.then(newMedium => {
      onComplete(newMedium);
    });
    // console.log('newMedium:');
    // console.log(newMedium);
  }, [file]);
  return (
    <>
      {uploadedPercent < 100 ? (
        <div className={`w3-col s3 medium-item uploading`}>
          <div className='medium-wrapper'>
            <i className='fa fa-upload fa-2x' />
            <div className='progress-bar'>
              <div
                className='uploaded-progress w3-blue'
                style={{
                  width: uploadedPercent + '%'
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const FileManager = ({
  onSelect
}) => {
  //const [showDetails, setShowDetails] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);
  // const [selectedFile, setSelectedFile] = useState('');
  const [selectedFile, setSelectedFile] = useState(-1);
  // const [showDetails, setShowDetails] = useState(false);
  const [uploadingQueue, setUploadingQueue] = useState([]);
  const [uploadedQueue, setUploadedQueue] = useState([]);

  const {
    media: fetchedMedia,
    getMedia
    // clearMedia,
    // medium: fetchedMedium,
    // getMedium,
    // clearMedium,
    // addMedium
  } = useContext(MediaContext);

  const searchQuery = document.location.search;
  const searchParams = new URLSearchParams(searchQuery);
  const CKEditorFuncNum = searchParams.get('CKEditorFuncNum');

  const { fileType: mediaType, additionalCallbackParam } = useParams();
  // console.log(mediaType);
  const fileManagerEl = useRef(null);
  const setFileManagerEl = useCallback(ref => {
    fileManagerEl.current = ref;
    console.log('setFileManagerEl', ref);
  }, []);
  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter, false);
    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('dragleave', handleDragLeave, false);
    document.addEventListener('drop', handleDropUpload, false);
    getMedia(Medium.mediumTypes.IMAGE, {
      // page,
      sortOrder: -1,
      sortBy: 'createDT'
      // filterText
    });
    return () => {
      document.removeEventListener('dragenter', handleDragEnter, false);
      document.removeEventListener('dragover', handleDragOver, false);
      document.removeEventListener('dragleave', handleDragLeave, false);
      document.removeEventListener('drop', handleDropUpload, false);
    };
  }, []);
  // useEffect(() => {
  //   console.log(fetchedMedia);
  // }, [fetchedMedia]);
  const returnFileUrl = medium => {
    // using onSelect props
    if (onSelect) {
      onSelect(medium);
    } else if (
      CKEditorFuncNum !== null &&
      window.opener &&
      window.opener.CKEDITOR &&
      window.opener.CKEDITOR.tools
    ) {
      // call from CKEditor
      window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, medium['src']);
    } else if (window.opener && window.opener.getMediaData) {
      window.opener.getMediaData({
        additionalCallbackParam,
        medium
      });
    } else {
      // maybe some other use case?
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
  const addMedium = newMedium => {
    console.log(newMedium);
    setUploadedQueue(prevUploadedQueue => {
      return [newMedium, ...prevUploadedQueue];
    });
  };
  const handleDropUpload = e => {
    const dataTransfer = e.dataTransfer;
    const files = dataTransfer.files;
    document.body.classList.remove('dragEnter');
    handleUpload(files);
    e.preventDefault();
    e.stopPropagation();
  };
  const handleInputUpload = e => {
    const target = e.target;
    const files = target.files;
    handleUpload(files);
    // console.log(e.target.files);
    e.preventDefault();
    e.stopPropagation();
  };
  const handleUpload = files => {
    const newQueue = [];
    Array.from(files).forEach(file => {
      newQueue.push(
        <UploadingElement key={Date.now()} file={file} onComplete={addMedium} />
      );
    });
    setUploadingQueue(prevUploadingQueue => {
      return [...prevUploadingQueue, ...newQueue];
    });
  };
  const handleDragEnter = e => {
    document.body.classList.add('dragEnter');
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = e => {
    if (e.target === document.body) {
      document.body.classList.remove('dragEnter');
    }
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className={`w3-stretch fileManager`} ref={setFileManagerEl}>
      <div className='dragFileOverlay'></div>
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
            <label className='w3-btn w3-blue upload-btn'>
              {uiWordings['FileManager.UploadButton']}{' '}
              <input type='file' onChange={handleInputUpload} multiple />
            </label>
          </div>
        </div>
      </div>
      <div className={`w3-col s9 media-list`}>
        <div className='w3-container'>
          <div className='w3-row-padding w3-section w3-stretch media'>
            {uploadingQueue && uploadingQueue.map(el => el)}
            {/* <UploadingElement uploadedPercent={30} /> */}
            {/* copy of the normal media list */}
            {uploadedQueue &&
              uploadedQueue.map((medium, idx) => {
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
                    <div className='medium-wrapper'>
                      {
                        {
                          IMAGE: (
                            <img
                              className='media-preview'
                              src={medium['url']}
                              alt={medium['alt']}
                            />
                          ),
                          VIDEO: (
                            <video
                              className='media-preview'
                              src={medium['url']}
                              alt={medium['alt']}
                              preload='metadata'
                            />
                          ),
                          AUDIO: <i className='fa fa-volume-up fa-2x'></i>,
                          PDF: <i className='fa fa-file-pdf-o fa-2x'></i>
                        }[medium['type']]
                      }
                    </div>
                  </div>
                );
              })}
            {fetchedMedia &&
              fetchedMedia.map((medium, idx) => {
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
                      <div className='medium-wrapper'>
                        {
                          {
                            IMAGE: (
                              <img
                                className='media-preview'
                                src={medium['url']}
                                alt={medium['alt']}
                              />
                            ),
                            VIDEO: (
                              <video
                                className='media-preview'
                                src={medium['url']}
                                alt={medium['alt']}
                                preload='metadata'
                              />
                            ),
                            AUDIO: <i className='fa fa-volume-up fa-2x'></i>,
                            PDF: <i className='fa fa-file-pdf-o fa-2x'></i>
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
                    "IMAGE": (
                      <img
                        className='media-preview'
                        src={fetchedMedia[selectedFile]['url']}
                        alt={fetchedMedia[selectedFile]['alt']}
                      />
                    ),
                    "VIDEO": (
                      <video
                        className='media-preview'
                        src={fetchedMedia[selectedFile]['url']}
                        alt={fetchedMedia[selectedFile]['alt']}
                        controls
                        controlsList='nodownload'
                        disablePictureInPicture
                      />
                    ),
                    "AUDIO": (
                      <audio
                        className='media-preview'
                        src={fetchedMedia[selectedFile]['url']}
                        alt={fetchedMedia[selectedFile]['alt']}
                        controls
                        controlsList='nodownload'
                      />
                    ),
                    "PDF": (
                      <div className='media-preview pdf'>
                        <i class='fa fa-file-pdf-o fa-2x'></i>
                      </div>
                    )
                  }[fetchedMedia[selectedFile]['type']]
                }
              </div>
              <div className='w3-row w3-section'>
                <MyLabel message='Media Url' />
                <a
                  href={fetchedMedia[selectedFile]['url']}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w3-bar w3-button w3-white w3-border media-link'
                >
                  {fetchedMedia[selectedFile]['url']}
                </a>
              </div>
              <LabelInputTextPair
                labelMessage='Name'
                name='name'
                isHalf={false}
                value={fetchedMedia[selectedFile]['name']}
              // onChange direct update
              />
              <LabelInputTextPair
                labelMessage='Alternate text'
                name='name'
                isHalf={false}
                value={fetchedMedia[selectedFile]['alt']}
              // onChange direct update
              />
            </div>
            <div className='action-btn-wrapper'>
              <div
                className='select-btn w3-btn w3-blue'
                onClick={() => returnFileUrl(fetchedMedia[selectedFile])}
              >
                {uiWordings['FileManager.SelectFile']}
              </div>
              <div
                className='delete-btn w3-btn w3-text-red'
                onClick={() => {
                  setSelectedFile(-1);
                  alert('under construction');
                }}
              >
                <i className="fa fa-trash" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FileManagerWithContainer = _ => {
  return (
    <MediaState>
      <FileManager />
    </MediaState>
  );
};

export default FileManagerWithContainer;
