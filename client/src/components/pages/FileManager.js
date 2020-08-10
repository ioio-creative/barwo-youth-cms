import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import FileManagerComponent from 'components/form/FileManager';
import uiWordings from 'globals/uiWordings';

const containerStyle = {
  height: 'calc(100vh - 51px)'
};

const FileManager = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['FileManager.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div style={containerStyle}>
      <FileManagerComponent />
    </div>
  );
};

export default FileManager;
