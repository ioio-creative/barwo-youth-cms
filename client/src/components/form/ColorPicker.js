import React, { useCallback } from 'react';
import { SketchPicker } from 'react-color';

const defaultValue = '#ffffff00';

// http://casesandberg.github.io/react-color/
const MyColorPicker = ({ name, value, onChange, width }) => {
  const handleChangeComplete = useCallback(
    (color, event) => {
      let alphaStr = Math.floor(color.rgb.a * 255).toString(16);
      if (alphaStr.length === 1) {
        alphaStr = '0' + alphaStr;
      }
      onChange({
        //...event,
        target: {
          //...event.target,
          name: name,
          value: color.hex + alphaStr
        }
      });
    },
    [name, onChange]
  );

  let cleanedValue = value;
  if ([undefined, null, ''].includes(value)) {
    cleanedValue = defaultValue;
  }

  return (
    <SketchPicker
      width={width}
      color={cleanedValue}
      onChangeComplete={handleChangeComplete}
    />
  );
};

MyColorPicker.defaultProps = {
  width: 250
};

export default MyColorPicker;
