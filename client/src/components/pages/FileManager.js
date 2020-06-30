import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import FileManagerComponent from 'components/form/FileManager';
import routes from 'globals/routes';

const FileManager = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle('Testing - File Manager');
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return <div className=''>
    <FileManagerComponent />
  </div>;
};

export default FileManager;
