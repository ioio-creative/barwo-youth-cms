import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewsesContext from 'contexts/newses/newsesContext';
import NewsesPageContainer from 'components/newses/NewsesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import Ordering from 'components/form/Ordering';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import News from 'models/news';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const NewsesOrder = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsesErrors,
    clearNewsesErrors,
    newsesInOrder: fetchedNewses,
    newsesInOrderLoading: fetchedNewsesLoading,
    getNewsesInOrder,
    clearNewsesInOrder,
    orderNewses
  } = useContext(NewsesContext);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // newses
  const [newsesPicked, setNewsesPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getNewsesInOrder();
    return _ => {
      clearNewsesInOrder();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedNewses
  useEffect(
    _ => {
      if (isNonEmptyArray(fetchedNewses)) {
        setNewsesPicked(fetchedNewses);
      }
    },
    [fetchedNewses]
  );

  // newsesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newsesErrors)) {
        setAlerts(
          newsesErrors.map(newsesError => {
            return new Alert(
              News.newsesResponseTypes[newsesError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewsesErrors();
      }
    },
    [newsesErrors, setAlerts, clearNewsesErrors]
  );

  /* event handlers */

  const onGetNewsesPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setNewsesPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      const newsesToSubmit = getArraySafe(newsesPicked).map(news => ({
        _id: news._id
      }));

      const isSuccess = await orderNewses(newsesToSubmit);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['NewsesOrder.OrderNewsesSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      }

      scrollToTop();
    },
    [setAlerts, removeAlerts, orderNewses, newsesPicked]
  );

  /* end of event handlers */

  if (fetchedNewsesLoading) {
    return <Loading />;
  }

  return (
    <>
      <GroupContainer>
        <LinkButton to={routes.newsList(true)}>
          {uiWordings['NewsesOrder.BackToNewsList']}
        </LinkButton>
      </GroupContainer>

      <Form onSubmit={onSubmit}>
        <h4 className='w3-show-inline-block w3-margin-right'>
          {uiWordings['NewsesOrder.Title']}
        </h4>

        <SubmitButton
          disabled={!isSubmitEnabled}
          label={uiWordings['NewsesOrder.Submit']}
        />

        <Ordering items={newsesPicked} onGetItems={onGetNewsesPicked} />
      </Form>
    </>
  );
};

const NewsesOrderWithContainer = _ => (
  <NewsesPageContainer>
    <NewsesOrder />
  </NewsesPageContainer>
);

export default NewsesOrderWithContainer;
