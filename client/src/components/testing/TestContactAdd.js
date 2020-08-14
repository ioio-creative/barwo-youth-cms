import React, { useCallback, useState } from 'react';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Button from 'components/form/Button';

const TestContactAdd = _ => {
  const [state, setState] = useState({});

  const onChange = useCallback(async e => {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const onSubmitContact = useCallback(
    async _ => {
      try {
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch('/api/frontend/contacts/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailAddress: state.email,
            language: 'tc'
          })
        });
        console.log(await response.json());
      } catch (err) {
        console.error(err);
      }
    },
    [state.email]
  );

  return (
    <>
      <LabelInputTextPair
        name='email'
        value={state.email}
        labelMessage='Subscription Email'
        placeholder=''
        onChange={onChange}
      />
      <Button onClick={onSubmitContact}>Submit Contact</Button>
    </>
  );
};

export default TestContactAdd;
