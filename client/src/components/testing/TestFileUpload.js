import React, { useRef, useContext, useEffect } from 'react';
import MediaContext from 'contexts/media/mediaContext';
import MediaState from 'contexts/media/MediaState';
import Medium from 'models/medium';

const TestFileUpload = _ => {
  const {
    media: fetchedMedia,
    getMedia,
    clearMedia,
    medium: fetchedMedium,
    getMedium,
    clearMedium,
    addMedium
  } = useContext(MediaContext);

  const filesRef = useRef();

  // componentDidMount
  useEffect(_ => {
    return _ => {
      clearMedia();
      clearMedium();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedMedia
  useEffect(
    _ => {
      if (fetchedMedia) {
        console.log('returnedMedia:');
        console.log(fetchedMedia);
      }
    },
    [fetchedMedia]
  );

  // fetchedMedium
  useEffect(
    _ => {
      if (fetchedMedium) {
        console.log('returnedMedium:');
        console.log(fetchedMedium);
      }
    },
    [fetchedMedium]
  );

  /* event handlers */

  const onUploadMedia = async e => {
    e.preventDefault();

    const files = filesRef.current.files;
    const formData = new FormData();

    // https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
    for (const file of files) {
      formData.append('media', file);
    }

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

    const newMedium = await addMedium(Medium.mediumTypes.IMAGE, formData);
    console.log('newMedium:');
    console.log(newMedium);
  };

  const onGetMedia = _ => {
    getMedia(Medium.mediumTypes.IMAGE, {
      // page,
      // limit,
      // sortOrder,
      // sortBy,
      // filterText
    });
  };

  const onGetOneMedium = async _ => {
    getMedium(Medium.mediumTypes.IMAGE, '5efaf014e6aa1118748b1ab0');
    // try {
    //   const res = await axios.get(
    //     '/api/backend/media/images/5efaf014e6aa1118748b1ab0'
    //   );
    //   console.log('returnedMedia:');
    //   console.log(res.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  /* end of event handlers */

  return (
    <div>
      <div>
        <label htmlFor='example-input-file'> </label>
        <input type='file' name='multi-files' multiple ref={filesRef} />
      </div>
      <div>
        <button onClick={onUploadMedia}>Submit</button>
      </div>
      <div>
        <button onClick={onGetMedia}>Get media</button>
      </div>
      <div>
        <button onClick={onGetOneMedium}>Get one medium</button>
      </div>
    </div>
  );
};

const TestFileUploadWithContainer = _ => {
  return (
    <MediaState>
      <TestFileUpload />
    </MediaState>
  );
};

export default TestFileUploadWithContainer;
