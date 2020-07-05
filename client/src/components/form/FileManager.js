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
import MyLabel from './Label';
import MyInputText from './InputText';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import Loading from 'components/layout/loading/DefaultLoading';

import './FileManager.css';

// routes //
// images
// videos
// audios21312fdsaf
// pdfs
// find by name //
// filterText

// const paramsToType = {
//   images: 'IMAGE',
//   videos: 'video',
//   audios: 'audio',
//   pdfs: 'pdf'
// };

const mediumTypes = Medium.mediumTypes;

/*
const media = [
  {
    name: 'Image 01',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Video 01',
    alternativeText: 'this is a sample video',
    type: mediumTypes.VIDEO.value,
    tags: ['aaa', 'bbb'],
    url: 'http://techslides.com/demos/sample-videos/small.mp4'
  },
  {
    name: 'Audio 01',
    alternativeText: 'this is a sample audio',
    type: mediumTypes.AUDIO.value,
    tags: ['ccc'],
    url:
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    name: 'PDF 01',
    alternativeText: 'this is a sample pdf',
    type: mediumTypes.PDF.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  },
  {
    name: 'Image 1 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 1'
  },
  {
    name: 'Image 2 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/400x200?text=Image 2'
  },
  {
    name: 'Image 3 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/400x300?text=Image 3'
  },
  {
    name: 'Image 4 (a, b)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['aaa', 'bbb'],
    url: 'http://placehold.it/400x225?text=Image 4'
  },
  {
    name: 'Image 5 (c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc'],
    url: 'http://placehold.it/300x200?text=Image 5'
  },
  {
    name: 'Image 6 (b, c)',
    alternativeText: 'this is a sample image',
    type: mediumTypes.IMAGE.value,
    tags: ['ccc', 'bbb'],
    url: 'http://placehold.it/300x200?text=Image 6'
  }
];
*/
const tags = [];
// const tags = ["aaa", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc", "bbb", "ccc"];

const MediumElement = ({
  idx,
  medium,
  selectedTag,
  selectedFile,
  onSelectMedium,
  onReturnMedium
}) => {
  const handleClick = useCallback(
    _ => {
      onSelectMedium(idx);
    },
    [idx, onSelectMedium]
  );
  const handleDoubleClick = useCallback(
    _ => {
      onReturnMedium(medium);
    },
    [medium, onReturnMedium]
  );

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
      }${idx === selectedFile ? ' selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
      </div>
    </div>
  );
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
  mediumType: mediumTypes.IMAGE
};

const FileManager = () => {
  //const [showDetails, setShowDetails] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);
  // const [selectedFile, setSelectedFile] = useState('');
  const [selectedFile, setSelectedFile] = useState(-1);
  // const [showDetails, setShowDetails] = useState(false);
  //const [dragEnter, setDragEnter] = useState(false);

  const [uploadingQueue, setUploadingQueue] = useState([]);
  const [uploadedQueue, setUploadedQueue] = useState([]);

  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    media: fetchedMedia,
    getMedia,
    clearMedia,
    // medium: fetchedMedium,
    // getMedium,
    // clearMedium,
    // addMedium,
    mediaLoading,
    mediaErrors,
    clearMediaErrors
  } = useContext(MediaContext);

  const CKEditorFuncNumAndSetter = useQueryParam(
    'CKEditorFuncNum',
    NumberParam
  );
  const CKEditorFuncNum = CKEditorFuncNumAndSetter[0];

  const { fileType: mediaType, additionalCallbackParam } = useParams();
  // console.log(mediaType);
  const mediumTypeObj = useMemo(
    _ => {
      return Medium.getMediumTypeFromApiRoute(mediaType);
    },
    [mediaType]
  );
  //console.log(mediumTypeObj);

  const fileManagerEl = useRef(null);

  const selectedFetchedMedium =
    selectedFile !== -1 ? fetchedMedia[selectedFile] : null;

  /* methods */

  const setFileManagerEl = useCallback(ref => {
    fileManagerEl.current = ref;
    console.log('setFileManagerEl', ref);
  }, []);
  const returnFileUrl = useCallback(
    medium => {
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
        window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, medium.url);
      }
      window.close();
    },
    [additionalCallbackParam, CKEditorFuncNum]
  );
  const selectTag = useCallback(tagName => {
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
  }, []);
  const addMedium = useCallback(newMedium => {
    setUploadedQueue(prevUploadedQueue => {
      return [newMedium, ...prevUploadedQueue];
    });
  }, []);
  const handleUpload = useCallback(
    files => {
      const newQueue = Array.from(files).map(file => (
        <UploadingElement
          key={Date.now()}
          file={file}
          onComplete={addMedium}
          mediumType={mediumTypeObj}
        />
      ));
      setUploadingQueue(prevUploadingQueue => {
        return [...prevUploadingQueue, ...newQueue];
      });
    },
    [addMedium, mediumTypeObj]
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
      if (selectedFile === idx) {
        setSelectedFile(-1);
      } else {
        setSelectedFile(idx);
      }
    },
    [selectedFile]
  );
  const handleMediumElementReturnMedium = useCallback(
    medium => {
      returnFileUrl(medium);
    },
    [returnFileUrl]
  );

  const handleSelectFile = useCallback(
    _ => {
      returnFileUrl(selectedFetchedMedium);
    },
    [selectedFetchedMedium, returnFileUrl]
  );

  /* end of methods */

  // componentDidMount
  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter, false);
    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('dragleave', handleDragLeave, false);
    document.addEventListener('drop', handleDropUpload, false);

    getMedia(mediumTypeObj, {
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

      clearMedia();
      removeAlerts();
    };
  }, [
    mediumTypeObj,
    getMedia,
    clearMedia,
    removeAlerts,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDropUpload
  ]);
  // useEffect(() => {
  //   console.log(fetchedMedia);
  // }, [fetchedMedia]);

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
              })}
            {!mediaLoading ? (
              getArraySafe(fetchedMedia)
                .filter(
                  medium =>
                    medium.type ===
                    mediumTypeObj.value /* paramsToType[mediaType] */
                )
                .map((medium, idx) => {
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
                <MyLabel message='Media Preview' />
                <br />
                {
                  {
                    image: (
                      <img
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                      />
                    ),
                    video: (
                      <video
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                        controls
                        controlsList='nodownload'
                        disablePictureInPicture
                      />
                    ),
                    audio: (
                      <audio
                        className='media-preview'
                        src={selectedFetchedMedium.url}
                        alt={selectedFetchedMedium.alternativeText}
                        controls
                        controlsList='nodownload'
                      />
                    ),
                    pdf: (
                      <div className='media-preview pdf'>
                        <i class='fa fa-file-pdf-o fa-2x'></i>
                      </div>
                    )
                  }[selectedFetchedMedium.type]
                }
              </div>
              <div className='w3-row w3-section'>
                <MyLabel message='Media Url' />
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
                // onChange direct update
              />
              <LabelInputTextPair
                labelMessage='Alternate text'
                name='name'
                isHalf={false}
                value={selectedFetchedMedium.alternativeText}
                // onChange direct update
              />
              <div className='w3-container w3-center'>
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

const FileManagerWithContainer = _ => {
  return (
    <MediaState>
      <FileManager />
    </MediaState>
  );
};

export default FileManagerWithContainer;
