import React, { Suspense } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from './AsyncLoading';

// https://objectpartners.com/2018/12/05/migrate-from-react-loadable-to-react-suspense/
const MyLoadable = ({ loader, loading: MyLoading, delay }) => {
  /**
   * !!!Important!!! This has to be a class as useMemo cannot be used in callbacks.
   */
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.myAsyncComponent = React.lazy(loader);

      this.state = {
        isLoadingTimerPast: false
      };
    }

    componentDidMount() {
      setTimeout(_ => {
        this.setState({
          isLoadingTimerPast: true
        });
      }, delay);
    }

    render() {
      const props = this.props;
      const { isLoadingTimerPast } = this.state;
      const MyAsyncComponent = this.myAsyncComponent;
      return (
        <ErrorBoundary>
          <Suspense fallback={<MyLoading isLoading={isLoadingTimerPast} />}>
            <MyAsyncComponent {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    }
  };
};

export default (funcToImportPage, loadingComponent, delay) => {
  return MyLoadable({
    loader: funcToImportPage,
    loading: loadingComponent || Loading,
    delay: delay || 200
  });
};
