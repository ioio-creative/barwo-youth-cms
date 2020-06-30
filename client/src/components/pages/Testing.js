import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import RichTextbox from 'components/form/RichTextbox';
import FileManager from 'components/form/FileManager';
import routes from 'globals/routes';
import { Link, generatePath } from 'react-router-dom';

const Testing = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle('Testing');
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return <div className=''>
    <div className="w3-row">
      <RichTextbox
        // debug={true}
        onChange={(e) => console.log(e)}
        filebrowserBrowseUrl={routes.fileManager}
        className={'w3-half'}
      />
    </div>
    <div className="">
      <button onClick={() => window.open(generatePath(routes.fileManager, { fileType: "images" }))}>open image file manager</button>
      <button onClick={() => window.open(generatePath(routes.fileManager, { fileType: "videos" }))}>open video file manager</button>
      <button onClick={() => window.open(generatePath(routes.fileManager, { fileType: "audios" }))}>open audio file manager</button>
      <button onClick={() => window.open(generatePath(routes.fileManager, { fileType: "pdfs" }))}>open pdf file manager</button>
    </div>
    {/* <FileManager /> */}
  </div>;
};

export default Testing;
