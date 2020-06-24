import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import RichTextbox from 'components/form/RichTextbox';
import FileManager from 'components/form/FileManager';
import routes from 'globals/routes';

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

  return <div className='w3-container'>
    <RichTextbox
      // debug={true}
      onChange={(e) => console.log(e)}
      filebrowserBrowseUrl={routes.fileManager}
      className={'w3-half'}
    />
    {/* <FileManager /> */}
  </div>;
};

export default Testing;
