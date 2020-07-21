import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import NewslettersContext from 'contexts/newsletters/newslettersContext';
import NewslettersPageContainer from 'components/newsletters/NewslettersPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import Button from '../form/Button';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Newsletter from 'models/newsletter';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyNewsletter = new Newsletter();
const defaultState = emptyNewsletter;

const NewsletterEdit = _ => {
  const { newsletterId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsletter: fetchedNewsletter,
    newslettersErrors,
    newslettersLoading,
    getNewsletter,
    clearNewsletter,
    addNewsletter,
    sendNewsletter,
    updateNewsletter,
    clearNewslettersErrors
  } = useContext(NewslettersContext);

  const [newsletter, setNewsletter] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
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

  // fetchedNewsletter
  useEffect(
    _ => {
      if (!newslettersLoading) {
        setNewsletter(
          fetchedNewsletter
            ? Newsletter.getNewsletterForDisplay(fetchedNewsletter)
            : defaultState
        );
        setIsAddMode(!fetchedNewsletter);
      }
    },
    [newslettersLoading, fetchedNewsletter]
  );

  // newslettersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newslettersErrors)) {
        setAlerts(
          newslettersErrors.map(NewsletterError => {
            return new Alert(
              Newsletter.newsletterResponseTypes[NewsletterError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewslettersErrors();

        if (
          newslettersErrors.includes(
            Newsletter.newsletterResponseTypes.NEWSLETTER_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [newslettersErrors, setAlerts, clearNewslettersErrors]
  );

  /* methods */

  const validInput = useCallback(newsletter => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onSendButtonClick = useCallback(
    async e => {
      // console.log('onSendButtonClick');
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = validInput(newsletter);
      let returnedNewsletter = null;
      if (isSuccess) {
        // const funcToCall = isAddMode ? addNewsletter : updateNewsletter;
        returnedNewsletter = await sendNewsletter(newsletter);
        // await sendNewsletter(newsletter);
        // isSuccess = Boolean(returnedNewsletter);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['NewsletterEdit.SendNewsletterSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        goToUrl(routes.newsletterEditByIdWithValue(true, newsletter._id));
        getNewsletter(newsletter._id);
      }
      scrollToTop();
    },
    [
      getNewsletter,
      newsletter,
      removeAlerts,
      sendNewsletter,
      setAlerts,
      validInput
    ]
  );

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setNewsletter(prevNewsletter => ({ ...prevNewsletter, [name]: value }));
    },
    [removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = validInput(newsletter);
      let returnedNewsletter = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addNewsletter : updateNewsletter;
        // console.log('debug');
        returnedNewsletter = await funcToCall(newsletter);
        // console.log(returnedNewsletter);
        isSuccess = Boolean(returnedNewsletter);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['NewsletterEdit.AddNewsletterSuccessMessage']
              : uiWordings['NewsletterEdit.UpdateNewsletterSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        goToUrl(
          routes.newsletterEditByIdWithValue(true, returnedNewsletter._id)
        );
        getNewsletter(returnedNewsletter._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateNewsletter,
      addNewsletter,
      getNewsletter,
      newsletter,
      setAlerts,
      removeAlerts,
      validInput
    ]
  );

  /* end of event handlers */

  if (newslettersLoading) {
    return <Loading />;
  }

  const backToNewsletterListButton = (
    <Form>
      <LinkButton to={routes.newsletterList(true)}>
        {uiWordings['NewsletterEdit.BackToNewsletterList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToNewsletterListButton}</>;
  }

  return (
    <>
      {backToNewsletterListButton}
      {!isSubmitEnabled && (
        <Button onClick={onSendButtonClick}>
          {uiWordings['NewsletterEdit.SendNewsletterSubmit']}
        </Button>
      )}
      <Form onSubmit={onSubmit}>
        <h4>
          {isAddMode
            ? uiWordings['NewsletterEdit.AddNewsletterTitle']
            : uiWordings['NewsletterEdit.EditNewsletterTitle']}
        </h4>
        <LabelInputTextPair
          name='label'
          value={newsletter.label}
          labelMessage={uiWordings['Newsletter.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='title_tc'
          value={newsletter.title_tc}
          labelMessage={uiWordings['Newsletter.TitleTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='message_tc'
          value={newsletter.message_tc}
          labelMessage={uiWordings['Newsletter.MessageTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='title_sc'
          value={newsletter.title_sc}
          labelMessage={uiWordings['Newsletter.TitleScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='message_sc'
          value={newsletter.message_sc}
          labelMessage={uiWordings['Newsletter.MessageScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='title_en'
          value={newsletter.title_en}
          labelMessage={uiWordings['Newsletter.TitleEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='message_en'
          value={newsletter.message_en}
          labelMessage={uiWordings['Newsletter.MessageEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelTogglePair
          name='isEnabled'
          value={newsletter.isEnabled}
          labelMessage={uiWordings['Newsletter.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddMode && (
          <>
            {/* <LabelLabelPair
              value={newsletter.createDTDisplay}
              labelMessage={uiWordings['Newsletter.CreateDTLabel']}
            /> */}
            <LabelLabelPair
              value={newsletter.lastModifyDTDisplay}
              labelMessage={uiWordings['Newsletter.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={newsletter.lastModifyUserDisplay}
              labelMessage={uiWordings['Newsletter.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['NewsletterEdit.AddNewsletterSubmit']
              : uiWordings['NewsletterEdit.UpdateNewsletterSubmit']
          }
        />
      </Form>
    </>
  );
};

const NewsletterEditWithContainer = _ => (
  <NewslettersPageContainer>
    <NewsletterEdit />
  </NewslettersPageContainer>
);

export default NewsletterEditWithContainer;