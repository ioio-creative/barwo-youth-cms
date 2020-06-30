import React, { useRef } from 'react';
import axios from 'axios';

const TestFileUpload = _ => {
  const filesRef = useRef();

  const onSubmit = async e => {
    e.preventDefault();

    const files = filesRef.current.files;
    const formData = new FormData();

    // https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
    for (const file of files) {
      formData.append('media', file);
    }

    const additonalFormData = {
      name: Date.now().toString(),
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
      const res = await axios.post(
        'http://localhost:5000/api/backend/media/images',
        formData
      );
      console.log('returnedMedium:');
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='form-group'>
        <label htmlFor='example-input-file'> </label>
        <input
          type='file'
          name='multi-files'
          multiple
          id='input-multi-files'
          className='form-control-file border'
          ref={filesRef}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Submit
      </button>
    </form>
  );
};

export default TestFileUpload;
