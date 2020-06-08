import React, { useContext, useCallback } from 'react';

// https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_examples_material
// Open and close the sidebar on medium and small screens
const w3_open = _ => {
  document.getElementById('mySidebar').style.display = 'block';
  document.getElementById('myOverlay').style.display = 'block';
};

const Topbar = _ => {
  return (
    <>
      <div id='myTop' className='w3-container w3-top w3-theme w3-large'>
        <p>
          <i
            className='fa fa-bars w3-button w3-teal w3-hide-large w3-xlarge'
            onClick={w3_open}
          ></i>
          <span id='myIntro' className='w3-hide'>
            W3.CSS: Introduction
          </span>
        </p>
      </div>

      <header
        className='w3-container w3-theme'
        style={{ padding: '64px 32px' }}
      >
        <h1 className='w3-xxxlarge'>W3.CSS</h1>
      </header>
    </>
  );
};

export default Topbar;
