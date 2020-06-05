import getHistory from 'react-router-global-history';

export const goToUrl = path => {
  getHistory().push(path);
};
