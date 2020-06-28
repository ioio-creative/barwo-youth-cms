import { useCallback, useEffect } from 'react';

// https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
// https://www.w3schools.com/jsref/dom_obj_body.asp
const useEnterButtonPress = onEnterButtonPress => {
  const handleEnterButtonPress = useCallback(
    e => {
      if (e.keyCode === 13) {
        console.log('reach here');
        e.preventDefault();
        onEnterButtonPress();
      }
    },
    [onEnterButtonPress]
  );

  // componentDidMount
  useEffect(_ => {
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('keyup', handleEnterButtonPress);
    return body.removeEventListener('keyup', handleEnterButtonPress);
  }, []);
};

export default useEnterButtonPress;
