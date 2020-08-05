// https://stackoverflow.com/questions/7460272/getting-image-dimensions-using-javascript-file-api

const getImageFromFile = fileObj => {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(fileObj);
      const img = new Image();
      img.onload = _ => {
        resolve(img);
      };
      img.src = url;
    } catch (err) {
      console.error('getImageFromFile:', err);
      reject(err);
    }
  });
};

export default getImageFromFile;
