import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
  useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import { useQueryParam, NumberParam } from 'use-query-params';

import MediaState from 'contexts/media/MediaState';
import MediaContext from 'contexts/media/mediaContext';
import AlertContext from 'contexts/alert/alertContext';
import Medium from 'models/medium';
import Alert from 'models/alert';
import LabelInputTextPair from './LabelInputTextPair';
import Label from './Label';
import InputText from './InputText';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import Loading from 'components/layout/loading/DefaultLoading';
import config from 'config/default.json';
import './FileManager.css';

const numberOfFilesInExplorer = config.FileManager.numberOfFilesInExplorer;
const maxFileUploadCount = config.FileManager.filesCount;
const maxFileUploadSize = config.FileManager.fileSizeInMBs * 1024 * 1024;
const fileUploadAlertTimeout = config.FileManager.fileUploadAlertTimeoutInMs;

const mediumTypes = Medium.mediumTypes;

// routes //
// images
// videos
// audios21312fdsaf
// pdfs
// find by name //
// filterText
const RETURNTYPE = {
  Unknown: 0,
  Modal: 1,
  CKEditor: 2,
  Popup: 3
};

const tags = [];
// const tags = ["aaa", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc"];

const MediumElement = ({
  idx,
  medium,
  selectedTag,
  selectedFile,
  onSelectMedium
  //onReturnMedium
}) => {
  const handleClick = useCallback(
    _ => {
      onSelectMedium(idx);
    },
    [idx, onSelectMedium]
  );

  // const handleDoubleClick = useCallback(
  //   _ => {
  //     onReturnMedium(medium);
  //   },
  //   [medium, onReturnMedium]
  // );

  if (!medium) {
    return null;
  }

  return (
    // https://stackoverflow.com/a/25926600
    <div
      className={`w3-col s3 medium-item${
        selectedTag.length === 0 ||
        medium.tags.some(r => selectedTag.indexOf(r) >= 0)
          ? ''
          : ' hidden'
      }${selectedFile.includes(idx) ? ' selected' : ''}`}
      onClick={handleClick}
      /* onDoubleClick={handleDoubleClick} */
    >
      <div className='medium-wrapper'>
        {
          {
            IMAGE: (
              <img
                className='media-preview'
                src={medium.url}
                alt={medium.alternativeText}
              />
            ),
            VIDEO: (
              <video
                className='media-preview'
                src={medium.url}
                alt={medium.alternativeText}
                preload='metadata'
              />
            ),
            AUDIO: <i className='fa fa-volume-up fa-2x'></i>,
            PDF: <i className='fa fa-file-pdf-o fa-2x'></i>
          }[medium.type]
        }
        <div className='media-name'>{medium.name}</div>
      </div>
    </div>
  );
};

MediumElement.defaultProps = {
  selectedTag: []
};

const UploadingElement = ({
  // uploadedPercent,
  file,
  mediumType, // for file type validation
  onComplete
}) => {
  const { addMedium } = useContext(MediaContext);
  const [uploadedPercent, setUploadedPercent] = useState(0);

  useEffect(
    _ => {
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

      // console.log('formData to upload:');
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      const addMediumPromise = addMedium(mediumType, formData, {
        onUploadProgress: event => {
          setUploadedPercent((event.loaded / event.total) * 100);
        }
      });

      addMediumPromise.then(newMedium => {
        // console.log('newMedium:');
        // console.log(newMedium);
        onComplete(newMedium);
      });
    },
    [file, mediumType, onComplete, addMedium]
  );

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

UploadingElement.defaultProps = {
  mediumType: Medium.defaultMediumType
};

const FileManager = ({ multiple, mediumType, onSelect }) => {
  //const [showDetails, setShowDetails] = useState(false);
  //const [selectedTag, setSelectedTag] = useState([]);
  // const [selectedFile, setSelectedFile] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);
  // const [showDetails, setShowDetails] = useState(false);
  const [uploadingQueue, setUploadingQueue] = useState([]);
  //const [uploadedQueue, setUploadedQueue] = useState([]);
  const returnElementType = useRef(null);
  const multipleSelect = useRef(multiple);

  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    media: fetchedMedia,
    getMedia,
    clearMedia,
    // medium: fetchedMedium,
    // getMedium,
    // clearMedium,
    // addMedium,
    updateMedium,
    mediaLoading,
    mediaErrors,
    clearMediaErrors
  } = useContext(MediaContext);

  const [mediaList, setMediaList] = useState(fetchedMedia);
  const [filterText, setFilterText] = useState('');
  const CKEditorFuncNumAndSetter = useQueryParam(
    'CKEditorFuncNum',
    NumberParam
  );

  const CKEditorFuncNum = CKEditorFuncNumAndSetter[0];

  const { fileType: mediumTypeFromUrl, additionalCallbackParam } = useParams();
  //console.log(mediumTypeFromUrl);
  const mediumTypeObj = useMemo(
    _ => {
      return (
        mediumType ||
        Medium.getMediumTypeFromApiRoute(
          mediumTypeFromUrl || Medium.defaultMediumType.apiRoute
        )
      );
    },
    [mediumType, mediumTypeFromUrl]
  );
  //console.log(mediumTypeObj);

  const fileManagerEl = useRef(null);

  const selectedFetchedMedium =
    selectedFile.length === 1 ? mediaList[selectedFile[0]] : null;

  /* methods */
  const updateMediaName = useCallback(
    async newName => {
      const mediumToUpdate = mediaList[selectedFile];
      mediumToUpdate['name'] = newName;
      await updateMedium(mediumTypeObj, mediumToUpdate);
      // await getMedia(mediumTypeObj, {
      //   // page,
      //   sortOrder: -1,
      //   sortBy: 'createDT',
      //   filterText,
      //   limit: numberOfFilesInExplorer
      // });
    },
    [mediaList, selectedFile, mediumTypeObj, updateMedium]
  );
  const setFileManagerEl = useCallback(ref => {
    fileManagerEl.current = ref;
    //console.log('setFileManagerEl', ref);
  }, []);
  const returnFileUrl = useCallback(
    selectedFiles => {
      // using onSelect props
      //console.log('CKEditorFuncNum:', CKEditorFuncNum);
      if (onSelect) {
        const selectedMedia = selectedFiles.map(idx => mediaList[idx]);
        onSelect(selectedMedia);
      } else if (
        CKEditorFuncNum &&
        window.opener &&
        window.opener.CKEDITOR &&
        window.opener.CKEDITOR.tools
      ) {
        // call from CKEditor
        const medium = mediaList[selectedFiles[0]];
        window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, medium.url);
        window.close();
      } else if (window.opener && window.opener.getMediaData) {
        // const selectedMedia = selectedFiles.map(idx => mediaList[idx]);
        const medium = mediaList[selectedFiles[0]];
        window.opener.getMediaData({
          additionalCallbackParam,
          medium: medium
        });
        window.close();
      } else {
        // maybe some other use case?
        // window.close();
      }
    },
    [mediaList, onSelect, CKEditorFuncNum, additionalCallbackParam]
  );
  // const selectTag = useCallback(tagName => {
  //   // send request to server?
  //   // filter locally?
  //   // .then( refresh )
  //   setSelectedTag(prevSelectedTag => {
  //     const searchTagIdx = prevSelectedTag.indexOf(tagName);
  //     if (searchTagIdx === -1) {
  //       return [...prevSelectedTag, tagName];
  //     } else {
  //       return [
  //         ...prevSelectedTag.slice(0, searchTagIdx),
  //         ...prevSelectedTag.slice(searchTagIdx + 1, prevSelectedTag.length)
  //       ];
  //     }
  //   });
  // }, []);
  const addMedium = useCallback(newMedium => {
    setMediaList(prevMediaList => {
      return [newMedium, ...prevMediaList];
    });
    // setUploadedQueue(prevUploadedQueue => {
    //   return [newMedium, ...prevUploadedQueue];
    // });
  }, []);
  const handleUpload = useCallback(
    files => {
      const filesArray = Array.from(files);
      // TODO: can set the limit number of files and file size here
      if (filesArray.length > maxFileUploadCount) {
        setAlerts(
          // mediaErrors.map(mediaError => {
          [
            new Alert(
              Medium.mediaResponseTypes.TOO_MANY_FILES.msg,
              Alert.alertTypes.WARNING
            )
          ],
          fileUploadAlertTimeout
          // })
        );
      }
      const newQueue = filesArray.slice(0, maxFileUploadCount).map(file => {
        if (file.size > maxFileUploadSize) {
          setAlerts(
            // mediaErrors.map(mediaError => {
            [
              new Alert(
                `${file.name} - ${Medium.mediaResponseTypes.FILE_TOO_LARGE.msg}`,
                Alert.alertTypes.WARNING
              )
            ],
            fileUploadAlertTimeout
            // })
          );
          return null;
        } else {
          return (
            <UploadingElement
              key={Date.now()}
              file={file}
              onComplete={addMedium}
              mediumType={mediumTypeObj}
            />
          );
        }
      });
      setUploadingQueue(prevUploadingQueue => {
        return [...prevUploadingQueue, ...newQueue];
      });
    },
    [addMedium, setAlerts, mediumTypeObj]
  );
  const handleDropUpload = useCallback(
    e => {
      document.body.classList.remove('dragEnter');
      handleUpload(e.dataTransfer.files);
      e.preventDefault();
      e.stopPropagation();
    },
    [handleUpload]
  );
  const handleInputUpload = useCallback(
    e => {
      handleUpload(e.target.files);
      e.preventDefault();
      e.stopPropagation();
    },
    [handleUpload]
  );
  const handleDragEnter = useCallback(e => {
    document.body.classList.add('dragEnter');
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragOver = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragLeave = useCallback(e => {
    if (e.target === document.body) {
      document.body.classList.remove('dragEnter');
    }
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleMediumElementSelectMedium = useCallback(
    idx => {
      const selectIdxOfIdx = selectedFile.indexOf(idx);
      if (selectIdxOfIdx !== -1) {
        setSelectedFile(prevSelectedFile => {
          return prevSelectedFile
            .slice(0, selectIdxOfIdx)
            .concat(
              prevSelectedFile.slice(
                selectIdxOfIdx + 1,
                prevSelectedFile.length
              )
            );
        });
      } else if (multipleSelect.current === false) {
        setSelectedFile([idx]);
      } else {
        setSelectedFile(prevSelectedFile => {
          return prevSelectedFile.concat(idx);
        });
      }
    },
    [selectedFile]
  );
  const handleMediumElementReturnMedium = useCallback(
    medium => {
      returnFileUrl(selectedFile);
    },
    [returnFileUrl, selectedFile]
  );

  const handleSelectFile = useCallback(
    _ => {
      returnFileUrl(selectedFile);
    },
    [selectedFile, returnFileUrl]
  );

  /* end of methods */

  // componentDidMount
  useEffect(
    _ => {
      document.addEventListener('dragenter', handleDragEnter, false);
      document.addEventListener('dragover', handleDragOver, false);
      document.addEventListener('dragleave', handleDragLeave, false);
      document.addEventListener('mouseup', handleDragLeave, false);
      document.addEventListener('drop', handleDropUpload, false);

      getMedia(mediumTypeObj, {
        // page,
        sortOrder: -1,
        sortBy: 'createDT',
        filterText,
        limit: numberOfFilesInExplorer
      });
      return _ => {
        document.removeEventListener('dragenter', handleDragEnter, false);
        document.removeEventListener('dragover', handleDragOver, false);
        document.removeEventListener('dragleave', handleDragLeave, false);
        document.addEventListener('mouseup', handleDragLeave, false);
        document.removeEventListener('drop', handleDropUpload, false);

        clearMedia();
        removeAlerts();
      };
    },
    [
      mediumTypeObj,
      getMedia,
      clearMedia,
      removeAlerts,
      filterText,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDropUpload
    ]
  );

  useEffect(
    _ => {
      if (onSelect) {
        returnElementType.current = RETURNTYPE.Modal;
      } else if (
        CKEditorFuncNum &&
        window.opener &&
        window.opener.CKEDITOR &&
        window.opener.CKEDITOR.tools
      ) {
        // call from CKEditor
        returnElementType.current = RETURNTYPE.CKEditor;
        multipleSelect.current = false;
      } else if (window.opener && window.opener.getMediaData) {
        returnElementType.current = RETURNTYPE.Popup;
      } else {
        // maybe some other use case?
        // window.close();
        returnElementType.current = RETURNTYPE.Unknown;
      }
    },
    [onSelect, CKEditorFuncNum, additionalCallbackParam]
  );

  // fetchedMedia
  useEffect(
    _ => {
      if (fetchedMedia) {
        setMediaList(
          fetchedMedia.filter(medium =>
            [mediumTypes.ALL.value, medium.type].includes(mediumTypeObj.value)
          )
        );
      }
    },
    [fetchedMedia, mediumTypeObj.value]
  );

  // mediaErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(mediaErrors)) {
        setAlerts(
          mediaErrors.map(mediaError => {
            return new Alert(
              Medium.mediaResponseTypes[mediaError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearMediaErrors();
      }
    },
    [mediaErrors, clearMediaErrors, setAlerts]
  );

  return (
    <div
      className={`w3-stretch fileManager ${mediumTypeObj.apiRoute} ${
        multiple ? 'multiple' : 'single'
      }`}
      ref={setFileManagerEl}
    >
      <div className='dragFileOverlay'>
        {uiWordings['FileManager.DragToUploadHint']}
      </div>
      <div className='search-bar w3-col s9'>
        <div className='w3-container'>
          {/*tags.length > 0 && (
            <div className='w3-col s9 tags'>
              {tags.map(tag => {
                return (
                  <div
                    className={`w3-border w3-btn${
                      selectedTag.indexOf(tag) !== -1 ? ' w3-blue' : ''
                      } tag`}
                    key={tag}
                    onClick={_ => selectTag(tag)}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          )*/}
          <div className={`w3-col s${tags.length > 0 ? 3 : 6}`}>
            <InputText
              placeholder='Search media items...'
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
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
            {/*uploadedQueue &&
              uploadedQueue.map((medium, idx) => {
                return (
                  <MediumElement
                    key={idx}
                    idx={idx}
                    medium={medium}
                    selectedTag={selectedTag}
                    selectedFile={selectedFile}
                    onSelectMedium={handleMediumElementSelectMedium}
                    onReturnMedium={handleMediumElementReturnMedium}
                  />
                );
              })*/}
            {!mediaLoading ? (
              getArraySafe(mediaList)
                .filter(
                  medium =>
                    medium &&
                    [mediumTypes.ALL.value, medium.type].includes(
                      mediumTypeObj.value
                    )
                )
                .map((medium, idx) => {
                  return (
                    <MediumElement
                      key={idx}
                      idx={idx}
                      medium={medium}
                      //selectedTag={selectedTag}
                      selectedFile={selectedFile}
                      onSelectMedium={handleMediumElementSelectMedium}
                      onReturnMedium={handleMediumElementReturnMedium}
                    />
                  );
                })
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
      <div className='w3-col s3 media-details'>
        {selectedFetchedMedium && (
          <>
            <div className='w3-container'>
              <div className='w3-row w3-section'>
                <Label message='Media Preview' />
                <br />
                {
                  {
                    IMAGE: (
                      <img
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                      />
                    ),
                    VIDEO: (
                      <video
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                        controls
                        controlsList='nodownload'
                        disablePictureInPicture
                      />
                    ),
                    AUDIO: (
                      <audio
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                        controls
                        controlsList='nodownload'
                      />
                    ),
                    PDF: (
                      <div className='media-preview pdf'>
                        <i class='fa fa-file-pdf-o fa-2x'></i>
                      </div>
                    )
                  }[selectedFetchedMedium.type]
                }
              </div>
              <div className='w3-row w3-section'>
                <Label message='Media Url' />
                <a
                  href={selectedFetchedMedium.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w3-bar w3-button w3-white w3-border media-link'
                >
                  {selectedFetchedMedium.url}
                </a>
              </div>
              <LabelInputTextPair
                labelMessage='Name'
                name='name'
                isHalf={false}
                value={selectedFetchedMedium.name}
                onChange={async e => await updateMediaName(e.target.value)}
                // onChange direct update
                // TODO: can use useTimeout to implement own throttle for
                // limiting the frequency of calling updateMediaName
              />
              {/* <LabelInputTextPair
                labelMessage='Alternate text'
                name='name'
                isHalf={false}
                value={selectedFetchedMedium.alternativeText}
              // onChange direct update
              /> */}
              <div className='w3-center action-btn-wrapper'>
                <div
                  className='w3-btn w3-blue select-btn'
                  onClick={handleSelectFile}
                >
                  {uiWordings['FileManager.SelectFile']}
                </div>
                {/* <div
                  className='w3-btn w3-text-red'
                  onClick={_ =>
                    alert(
                      'delete file from server here\nbut the file being deleted may be using somewhere'
                    )
                  }
                >
                  <i className='fa fa-trash' />
                </div> */}
              </div>
            </div>
          </>
        )}
        {selectedFile.length > 1 && (
          <>
            <div className='w3-container'>
              <div className='w3-row w3-section'>
                <Label message='Media Preview' />
                <br />
                {`${selectedFile.length}${uiWordings['FileManager.SelectFile']}`}
              </div>
              <div className='w3-center action-btn-wrapper'>
                <div
                  className='w3-btn w3-blue select-btn'
                  onClick={handleSelectFile}
                >
                  {uiWordings['FileManager.SelectFile']}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

FileManager.defaultProps = {
  multiple: false
  // Note: do not set default for mediumType
  // coz in that case, mediumType will always override mediumTypeFromUrl
  // even when the caller doesn't define it
  //mediumType: mediumTypes.defaultMediumType
};

const FileManagerWithContainer = params => {
  return (
    <MediaState>
      <FileManager {...params} />
    </MediaState>
  );
};

export default FileManagerWithContainer;
