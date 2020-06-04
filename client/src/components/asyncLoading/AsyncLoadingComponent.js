import Loadable from 'react-loadable';
import Loading from './AsyncLoading';

export default (funcToImportPage, loadingComponent) => {
  return Loadable({
    loader: funcToImportPage,
    loading: loadingComponent || Loading
  });
};
