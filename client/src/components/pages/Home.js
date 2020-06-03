import React, { useContext, useEffect } from 'react';
// import Contacts from '../contacts/Contacts';
// import ContactForm from '../contacts/ContactForm';
// import ContactFilter from '../contacts/ContactFilter';
import AuthContext from 'contexts/auth/authContext';

const Home = _ => {
  const { loadUser } = useContext(AuthContext);
  useEffect(_ => {
    loadUser();
    // eslint-disable-next-line
  }, []);
  return (
    <div className='grid-2'>
      <div>{/* <ContactForm /> */}</div>
      <div>{/* <ContactFilter />
        <Contacts /> */}</div>
    </div>
  );
};

export default Home;
