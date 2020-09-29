import React, { useCallback, useState } from 'react';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Button from 'components/form/Button';

const TestContactUnsubscribe = _ => {
  const [state, setState] = useState({
    contactId: ''
  });

  const onChange = useCallback(async e => {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const onSubscribeContact = useCallback(
    async _ => {
      try {
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch('/api/frontend/contacts/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: state.contactId
          })
        });

        if (response.status !== 200) {
          console.log('Unsubscribing contact failed.');
        } else {
          console.log('Unsubscribing contact succeeded.');
        }
      } catch (err) {
        console.error(err);
      }
    },
    [state.contactId]
  );

  return (
    <>
      <LabelInputTextPair
        name='contactId'
        value={state.contactId}
        labelMessage='Contact ID'
        placeholder=''
        onChange={onChange}
      />
      <Button onClick={onSubscribeContact}>Unsubscribe</Button>
    </>
  );
};

export default TestContactUnsubscribe;
