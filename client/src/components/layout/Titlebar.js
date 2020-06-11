import React, { useContext } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';

const Titlebar = _ => {
  const { title } = useContext(TitlebarContext);

  if (!title) {
    return null;
  }

  return (
    <div className='w3-container w3-teal'>
      <h1>{title}</h1>
    </div>
  );
};

export default Titlebar;
