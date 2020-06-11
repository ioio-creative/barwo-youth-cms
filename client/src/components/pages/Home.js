import React from 'react';
import Titlebar from 'components/layout/Titlebar';
import RichTextbox from 'components/form/RichTextbox';

const Home = _ => {
  return (
    <div>
      <Titlebar title='Homepage' />
      <RichTextbox />
    </div>
  );
};

export default Home;
