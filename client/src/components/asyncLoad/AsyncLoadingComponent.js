import Loadable from 'react-loadable';
import DefaultLoading from './node_modules/components/layout/DefaultLoading';

export default (funcToImportPage, loadingComponent) => {
  return Loadable({
    loader: funcToImportPage,
    loading: loadingComponent || DefaultLoading
  });
};
