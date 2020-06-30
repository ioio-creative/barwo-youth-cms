import axios from 'axios';

const MediaUploader = async ({
  formData,
  path,
  onProgress
}) => {
  // upload the media to server
  try {
    const res = await axios.post(
      path,
      formData,
      {
        // https://github.com/axios/axios/issues/629
        onUploadProgress: onProgress
        // onDownloadProgress: onProgress
      }
    );
    return res;
  } catch (err) {
    console.error(err);
  }
}

export default MediaUploader;
