import download from 'downloadjs';

// https://www.npmjs.com/package/downloadjs
export default (data, strFileName, strMimeType) => {
  // download(data, strFileName, strMimeType);


  download(new Blob(data), strFileName, strMimeType);
};
