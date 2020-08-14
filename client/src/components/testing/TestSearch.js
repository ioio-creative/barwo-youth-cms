import React, { useCallback, useState } from 'react';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Button from 'components/form/Button';

const TestSearch = _ => {
  const [state, setState] = useState({
    searchText: '一点鴻'
  });

  const onChange = useCallback(async e => {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const onTestSearch = useCallback(
    async _ => {
      try {
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch('/api/frontend/search/tc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            queryStr: state.searchText
          })
        });
        console.log(await response.json());
      } catch (err) {
        console.error(err);
      }
    },
    [state.searchText]
  );

  return (
    <>
      <LabelInputTextPair
        name='searchText'
        value={state.searchText}
        labelMessage='Search Text'
        placeholder=''
        onChange={onChange}
      />
      <Button onClick={onTestSearch}>Test Search</Button>
    </>
  );
};

export default TestSearch;
