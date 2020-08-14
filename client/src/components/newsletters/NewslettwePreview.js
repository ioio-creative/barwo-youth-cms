import React, { useContext, useState, useEffect } from 'react';
import Modal from 'components/layout/Modal';
import uiWordings from 'globals/uiWordings';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelLabelPair from 'components/form/LabelLabelPair';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import Sender from 'models/sender';
import SenderContext from 'contexts/sender/senderContext';
import Newsletter from 'models/newsletter';
import NewslettersContext from 'contexts/newsletters/newslettersContext';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import NewslettersPageContainer from 'components/newsletters/NewslettersPageContainer';
import SenderPageContainer from 'components/newsletters/SenderPageContainer';

const emptyNewsletter = new Newsletter();
const defaultNewsletterState = emptyNewsletter;

const originalSender = new Sender();
const defaultSenderState = originalSender;

const NewsletterPreview = ({ newsletterId }) => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsletter: fetchedNewsletter,
    newslettersErrors,
    newslettersLoading,
    getNewsletter,
    clearNewsletter,
    clearNewslettersErrors
  } = useContext(NewslettersContext);

  const {
    sender: fetchedSender,
    senderErrors,
    senderLoading,
    getSender,
    clearSender,
    clearSenderErrors
  } = useContext(SenderContext);

  const [newsletter, setNewsletter] = useState(defaultNewsletterState);
  const [sender, setSender] = useState(defaultSenderState);

  // componentDidMount
  useEffect(_ => {
    getSender();
    return _ => {
      clearSender();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // NewsletterId
  useEffect(
    _ => {
      if (newsletterId) {
        getNewsletter(newsletterId);
      }

      return _ => {
        clearNewsletter();
      };
    },
    [newsletterId, getNewsletter, clearNewsletter]
  );

  useEffect(
    _ => {
      setNewsletter(
        fetchedNewsletter
          ? Newsletter.getNewsletterForDisplay(fetchedNewsletter)
          : defaultNewsletterState
      );
    },
    [fetchedNewsletter]
  );

  // fetchedSender
  useEffect(
    _ => {
      if (fetchedSender) {
        setSender(
          fetchedSender
            ? Sender.getSenderForDisplay(fetchedSender)
            : defaultSenderState
        );
      }
    },
    [fetchedSender]
  );

  // newslettersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newslettersErrors)) {
        setAlerts(
          newslettersErrors.map(NewsletterError => {
            return new Alert(
              Newsletter.newslettersResponseTypes[NewsletterError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewslettersErrors();
      }
    },
    [newslettersErrors, setAlerts, clearNewslettersErrors]
  );

  // sender error
  useEffect(
    _ => {
      if (isNonEmptyArray(senderErrors)) {
        setAlerts(
          senderErrors
            .filter(errorType => {
              return (
                errorType !== Sender.senderResponseTypes.SENDER_NOT_EXISTS.type
              );
            })
            .map(senderError => {
              return new Alert(
                Sender.senderResponseTypes[senderError].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearSenderErrors();
      }
    },
    [senderErrors, setAlerts, clearSenderErrors]
  );

  if (newslettersLoading || senderLoading) {
    return <Loading />;
  }

  return (
    <Modal contentLabel={uiWordings['NewsletterPreview.Title']}>
      <h4>{uiWordings['NewsletterPreview.Title']}</h4>
      {uiWordings['NewsletterPreview.TcLabel']}
      <div className='w3-panel w3-card w3-container'>
        <>
          <LabelLabelPair
            value={newsletter.title_tc}
            labelMessage={uiWordings['NewsletterPreview.SubjectLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value={`<${sender.name_tc}> ${sender.emailAddress}`}
            labelMessage={uiWordings['NewsletterPreview.FromLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value='testing@preview.com'
            labelMessage={uiWordings['NewsletterPreview.ToLabel']}
            isHalf={true}
          />
          <div
            className='w3-container w3-panel w3-light-gray'
            dangerouslySetInnerHTML={{ __html: newsletter.message_tc }}
          />
        </>
      </div>
      <div className='w3-panel w3-card w3-container'>
        <>
          <LabelLabelPair
            value={newsletter.title_sc}
            labelMessage={uiWordings['NewsletterPreview.SubjectLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value={`<${sender.name_sc}> ${sender.emailAddress}`}
            labelMessage={uiWordings['NewsletterPreview.FromLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value='testing@preview.com'
            labelMessage={uiWordings['NewsletterPreview.ToLabel']}
            isHalf={true}
          />
          <div
            className='w3-container w3-panel w3-light-gray'
            dangerouslySetInnerHTML={{ __html: newsletter.message_sc }}
          />
        </>
      </div>
      <div className='w3-panel w3-card w3-container'>
        <>
          <LabelLabelPair
            value={newsletter.title_en}
            labelMessage={uiWordings['NewsletterPreview.SubjectLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value={`<${sender.name_en}> ${sender.emailAddress}`}
            labelMessage={uiWordings['NewsletterPreview.FromLabel']}
            isHalf={true}
          />
          <LabelLabelPair
            value='testing@preview.com'
            labelMessage={uiWordings['NewsletterPreview.ToLabel']}
            isHalf={true}
          />
          <div
            className='w3-container w3-panel w3-light-gray'
            dangerouslySetInnerHTML={{ __html: newsletter.message_en }}
          />
        </>
      </div>
    </Modal>
  );
};

NewsletterPreview.defaultProps = {
  Newsletter: defaultNewsletterState,
  Sender: defaultSenderState
};

const NewsletterPreviewWithContainer = _ => (
  <SenderPageContainer>
    <NewslettersPageContainer>
      <NewsletterPreview />
    </NewslettersPageContainer>
  </SenderPageContainer>
);

export default NewsletterPreviewWithContainer;
