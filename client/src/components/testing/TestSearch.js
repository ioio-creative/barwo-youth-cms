import React, { useCallback } from 'react';

const TestSearch = _ => {
  const onTestSearch = useCallback(async _ => {
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      const response = await fetch('/api/frontend/search/tc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryStr: '一点鴻'
        })
      });
      console.log(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);
  return <button onClick={onTestSearch}>Test Search</button>;
};

export default TestSearch;
