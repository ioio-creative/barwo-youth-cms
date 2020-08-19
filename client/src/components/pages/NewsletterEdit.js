import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import NewslettersContext from 'contexts/newsletters/newslettersContext';
import NewslettersPageContainer from 'components/newsletters/NewslettersPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Region from 'components/layout/Region';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import Button from 'components/form/Button';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import Newsletter from 'models/newsletter';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';
import SendOutList from 'components/sendhistory/SendOutList';
import NewsletterPreview from 'components/newsletters/NewslettwePreview';

const emptyNewsletter = new Newsletter();
const defaultState = emptyNewsletter;

const mediumTypes = Medium.mediumTypes;

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
    clearNewslettersErrors,
    deleteNewsletter
  } = useContext(NewslettersContext);

  const [newsletter, setNewsletter] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // pageMeta
  const [pageMeta, setPageMeta] = useState(new PageMeta());

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // newsletterId
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
      setNewsletter(
        fetchedNewsletter
          ? Newsletter.getNewsletterForDisplay(fetchedNewsletter)
          : defaultState
      );
      if (fetchedNewsletter) {
        setFeaturedImagePicked(fetchedNewsletter.featuredImage);
        if (fetchedNewsletter.pageMeta) {
          setPageMeta(fetchedNewsletter.pageMeta);
        }
      }
      setIsAddMode(!fetchedNewsletter);
    },
    [fetchedNewsletter]
  );

  // newslettersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newslettersErrors)) {
        setAlerts(
          newslettersErrors.map(newsletterError => {
            return new Alert(
              Newsletter.newslettersResponseTypes[newsletterError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewslettersErrors();

        if (
          newslettersErrors.includes(
            Newsletter.newslettersResponseTypes.NEWSLETTER_NOT_EXISTS.type
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

  const onGetFeaturedImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const newsletterDelete = useCallback(
    async _ => {
      const isSuccess = await deleteNewsletter(newsletterId);
      if (isSuccess) {
        goToUrl(routes.newsletterList(true));
        setAlerts(
          new Alert(
            uiWordings['NewsletterEdit.DeleteNewsletterSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [newsletterId, deleteNewsletter, setAlerts]
  );

  const onSendButtonClick = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = validInput(newsletter);
      if (isSuccess) {
        isSuccess = await sendNewsletter(newsletter);

        goToUrl(routes.newsletterEditByIdWithValue(true, newsletter._id));
        getNewsletter(newsletter._id);
        scrollToTop();
        setAlerts(
          new Alert(
            uiWordings['NewsletterEdit.SendNewsletterSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
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

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add featuredImage
      newsletter.featuredImage = featuredImagePicked
        ? featuredImagePicked._id
        : null;

      // add pageMeta
      newsletter.pageMeta = PageMeta.cleanPageMetaBeforeSubmit(pageMeta);
      let isSuccess = validInput(newsletter);
      let returnedNewsletter = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addNewsletter : updateNewsletter;
        returnedNewsletter = await funcToCall(newsletter);
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
      validInput,
      featuredImagePicked,
      pageMeta
    ]
  );

  /* end of event handlers */

  if (newslettersLoading) {
    return <Loading />;
  }

  const backToNewsletterListButton = (
    <GroupContainer>
      <LinkButton to={routes.newsletterList(true)}>
        {uiWordings['NewsletterEdit.BackToNewsletterList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToNewsletterListButton}</>;
  }

  return (
    <>
      {backToNewsletterListButton}

      <Form onSubmit={onSubmit}>
        {!isSubmitEnabled && (
          <Button onClick={onSendButtonClick} className='w3-container w3-right'>
            {uiWordings['NewsletterEdit.SendNewsletterSubmit']}
          </Button>
        )}

        <div className='w3-container w3-right'>
          <SendOutList newsletterId={newsletter._id} />
        </div>

        <h4>
          {isAddMode
            ? uiWordings['NewsletterEdit.AddNewsletterTitle']
            : uiWordings['NewsletterEdit.EditNewsletterTitle']}
        </h4>

        <FileUpload
          name='featuredImage'
          labelMessage={uiWordings['Newsletter.FeaturedImageLabel']}
          files={featuredImagePicked ? [featuredImagePicked] : null}
          onGetFiles={onGetFeaturedImagePicked}
          isMultiple={false}
          mediumType={mediumTypes.IMAGE}
        />

        <LabelInputTextPair
          name='label'
          value={newsletter.label}
          labelMessage={uiWordings['Newsletter.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <Region>
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
        </Region>

        <Region>
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
        </Region>

        <Region>
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
        </Region>

        <PageMetaEditWithModal
          pageMeta={pageMeta}
          setPageMetaFunc={setPageMetaFunc}
        />

        <LabelTogglePair
          name='isEnabled'
          value={newsletter.isEnabled}
          labelMessage={uiWordings['Newsletter.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddMode && (
          <>
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

        {!isAddMode && (
          <>
            <DeleteWithConfirmButton
              className='w3-container w3-right'
              onConfirmYes={newsletterDelete}
            >
              {uiWordings['NewsletterEdit.DeleteNewsletter']}
            </DeleteWithConfirmButton>
            <div className='w3-container w3-right'>
              <NewsletterPreview newsletterId={newsletterId} />
            </div>
          </>
        )}
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
