import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import TicketingDefaultState from 'contexts/ticketingDefault/ticketingDefaultState';
import uiWordings from 'globals/uiWordings';

const TicketingDefaultContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['TicketingDefault.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <TicketingDefaultState>
      <div className='ticketing-default-container'>{children}</div>
    </TicketingDefaultState>
  );
};

export default TicketingDefaultContainer;
