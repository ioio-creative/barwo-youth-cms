import React, { useRef } from 'react';
import axios from 'axios';

const TestFileUpload = _ => {
  const filesRef = useRef();

  const onUploadMedia = async e => {
    e.preventDefault();

    const files = filesRef.current.files;
    const formData = new FormData();

    // https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
    for (const file of files) {
      formData.append('media', file);
    }

    const additonalFormData = {
      //name: Date.now().toString(),
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

    try {
      const res = await axios.post('/api/backend/media/images', formData);
      console.log('returnedMedium:');
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onGetMedia = async _ => {
    try {
      const res = await axios.get('/api/backend/media/images');
      const { docs, ...meta } = res.data;
      console.log('returnedMedia:');
      console.log(docs);
      console.log('returnedMedia meta:');
      console.log(meta);
    } catch (err) {
      console.error(err);
    }
  };

  const onGetOneMedium = async _ => {
    try {
      const res = await axios.get(
        '/api/backend/media/images/5efaf014e6aa1118748b1ab0'
      );
      console.log('returnedMedia:');
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

export default TestFileUpload;
