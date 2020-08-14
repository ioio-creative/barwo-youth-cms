import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import NewslettersContext from 'contexts/newsletters/newslettersContext';
import NewslettersPageContainer from 'components/newsletters/NewslettersPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import Ordering from 'components/form/Ordering';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Newsletter from 'models/newsletter';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const NewslettersOrder = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newslettersErrors,
    clearNewslettersErrors,
    newslettersInOrder: fetchedNewslettersInOrder,
    newslettersInOrderLoading: fetchedNewslettersInOrderLoading,
    getNewslettersInOrder,
    clearNewslettersInOrder,
    orderNewsletters
  } = useContext(NewslettersContext);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // newsletters
  const [newslettersPicked, setNewslettersPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getNewslettersInOrder();
    return _ => {
      clearNewslettersInOrder();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedNewslettersInOrder
  useEffect(
    _ => {
      if (isNonEmptyArray(fetchedNewslettersInOrder)) {
        setNewslettersPicked(fetchedNewslettersInOrder);
      }
    },
    [fetchedNewslettersInOrder]
  );

  // newslettersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newslettersErrors)) {
        setAlerts(
          newslettersErrors.map(newslettersError => {
            return new Alert(
              Newsletter.newslettersResponseTypes[newslettersError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewslettersErrors();
      }
    },
    [newslettersErrors, setAlerts, clearNewslettersErrors]
  );

  /* event handlers */

  const onGetNewslettersPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setNewslettersPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      const newslettersToSubmit = getArraySafe(newslettersPicked).map(
        newsletter => ({
          _id: newsletter._id
        })
      );

      const isSuccess = await orderNewsletters(newslettersToSubmit);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['NewslettersOrder.OrderNewslettersSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      }

      scrollToTop();
    },
    [setAlerts, removeAlerts, orderNewsletters, newslettersPicked]
  );

  /* end of event handlers */

  if (fetchedNewslettersInOrderLoading) {
    return <Loading />;
  }

  return (
    <>
      <GroupContainer>
        <LinkButton to={routes.newsletterList(true)}>
          {uiWordings['NewslettersOrder.BackToNewsletterList']}
        </LinkButton>
      </GroupContainer>

      <Form onSubmit={onSubmit}>
        <h4 className='w3-show-inline-block w3-margin-right'>
          {uiWordings['NewslettersOrder.Title']}
        </h4>

        <SubmitButton
          disabled={!isSubmitEnabled}
          label={uiWordings['NewslettersOrder.Submit']}
        />

        <Ordering
          items={newslettersPicked}
          onGetItems={onGetNewslettersPicked}
          listWidth={300}
        />
      </Form>
    </>
  );
};

const NewslettersOrderWithContainer = _ => (
  <NewslettersPageContainer>
    <NewslettersOrder />
  </NewslettersPageContainer>
);

export default NewslettersOrderWithContainer;
