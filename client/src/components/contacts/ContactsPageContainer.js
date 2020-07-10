import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import ContactsState from 'contexts/contacts/contactsState';
import uiWordings from 'globals/uiWordings';

const ContactsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Contacts.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ContactsState>
      <div className='contacts-page-container'>{children}</div>
    </ContactsState>
  );
};

export default ContactsPageContainer;
