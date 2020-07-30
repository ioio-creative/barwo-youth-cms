import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewsesContext from 'contexts/newses/newsesContext';
import NewsesPageContainer from 'components/newses/NewsesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import LabelSelectPair from 'components/form/LabelSelectPair';
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

  // news type
  const [newsTypePicked, setNewsTypePicked] = useState(
    News.defaultNewsType.value
  );

  // newses
  const [newsesPicked, setNewsesPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      clearNewsesInOrder();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedNewses
  useEffect(
    _ => {
      setNewsesPicked(getArraySafe(fetchedNewses));
      if (!isNonEmptyArray(fetchedNewses)) {
        setIsSubmitEnabled(false);
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

  // newsTypePicked
  useEffect(
    _ => {
      getNewsesInOrder(newsTypePicked);
    },
    [newsTypePicked]
  );

  /* event handlers */

  const onNewsTypeChange = useCallback(e => {
    setNewsTypePicked(e.target.value);
  }, []);

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

        <LabelSelectPair
          name='type'
          value={newsTypePicked}
          options={News.newsTypeOptions}
          labelMessage={uiWordings['News.TypeLabel']}
          onChange={onNewsTypeChange}
        />

        <SubmitButton
          disabled={!isSubmitEnabled}
          label={uiWordings['NewsesOrder.Submit']}
        />

        <Ordering
          listWidth={350}
          items={newsesPicked}
          onGetItems={onGetNewsesPicked}
        />
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
