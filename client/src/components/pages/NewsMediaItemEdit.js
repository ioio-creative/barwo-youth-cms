import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import NewsMediaItemsContext from 'contexts/newsMediaItems/newsMediaItemsContext';
import NewsMediaItemsPageContainer from 'components/newsMediaItems/NewsMediaItemsPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelDatePickerPair from 'components/form/LabelDatePickerPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import TextList from 'components/form/TextList';
import NewsMediaItem from 'models/newsMediaItem';
import Medium from 'models/medium';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';
import { formatDateString } from 'utils/datetime';

const emptyNewsMediaItem = new NewsMediaItem();
const defaultState = emptyNewsMediaItem;

const mediumTypes = Medium.mediumTypes;

const NewsMediaItemEdit = _ => {
  const { newsMediaItemId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsMediaItem: fetchedNewsMediaItem,
    newsMediaItemsErrors,
    newsMediaItemsLoading,
    getNewsMediaItem,
    clearNewsMediaItem,
    addNewsMediaItem,
    updateNewsMediaItem,
    clearNewsMediaItemsErrors,
    deleteNewsMediaItem
  } = useContext(NewsMediaItemsContext);

  const [newsMediaItem, setNewsMediaItem] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // thumbnail
  const [thumbnailPicked, setThumbnailPicked] = useState(null);

  // gallery
  const [galleryPicked, setGalleryPicked] = useState([]);

  // videoLinks
  const [videoLinksPicked, setVideoLinksPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // newsMediaItemId
  useEffect(
    _ => {
      if (newsMediaItemId) {
        getNewsMediaItem(newsMediaItemId);
      }

      return _ => {
        clearNewsMediaItem();
      };
    },
    [newsMediaItemId, getNewsMediaItem, clearNewsMediaItem]
  );

  // fetchedNewsMediaItem
  useEffect(
    _ => {
      setNewsMediaItem(
        fetchedNewsMediaItem
          ? NewsMediaItem.getNewsMediaItemForDisplay(fetchedNewsMediaItem)
          : defaultState
      );
      if (fetchedNewsMediaItem) {
        setThumbnailPicked(fetchedNewsMediaItem.thumbnail);
        setGalleryPicked(getArraySafe(fetchedNewsMediaItem.gallery));
        setVideoLinksPicked(
          getArraySafe(fetchedNewsMediaItem.videoLinks).map(
            TextList.mapTextToTextItem
          )
        );
      }
      setIsAddMode(!fetchedNewsMediaItem);
    },
    [fetchedNewsMediaItem]
  );

  // newsMediaItemsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newsMediaItemsErrors)) {
        setAlerts(
          newsMediaItemsErrors.map(newsMediaItemsError => {
            return new Alert(
              NewsMediaItem.newsMediaItemsResponseTypes[
                newsMediaItemsError
              ].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewsMediaItemsErrors();

        if (
          newsMediaItemsErrors.includes(
            NewsMediaItem.newsMediaItemsResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS
              .type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [newsMediaItemsErrors, setAlerts, clearNewsMediaItemsErrors]
  );

  /* methods */

  const validInput = useCallback(newsMediaItemInput => {
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
      setNewsMediaItem(prevNewsMediaItem => ({
        ...prevNewsMediaItem,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetThumbnailPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setThumbnailPicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetGalleryPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setGalleryPicked(newItemList);
  }, []);

  const onGetVideoLinksPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setVideoLinksPicked(newItemList);
  }, []);

  const newsMediaItemDelete = useCallback(
    async _ => {
      const isSuccess = await deleteNewsMediaItem(newsMediaItemId);
      if (isSuccess) {
        goToUrl(routes.newsMediaItemList(true));
        setAlerts(
          new Alert(
            uiWordings['NewsMediaItemEdit.DeleteNewsMediaItemSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [newsMediaItemId, deleteNewsMediaItem, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // format dates
      newsMediaItem.fromDate = formatDateString(newsMediaItem.fromDate);

      // add thumbnail
      newsMediaItem.thumbnail = thumbnailPicked ? thumbnailPicked._id : null;

      // add gallery
      newsMediaItem.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });

      // add videoLinks
      newsMediaItem.videoLinks = getArraySafe(videoLinksPicked).map(
        TextList.getTextFromTextItem
      );

      let isSuccess = validInput(newsMediaItem);
      let returnedNewsMediaItem = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addNewsMediaItem : updateNewsMediaItem;
        returnedNewsMediaItem = await funcToCall(newsMediaItem);
        isSuccess = Boolean(returnedNewsMediaItem);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['NewsMediaItemEdit.AddNewsMediaItemSuccessMessage']
              : uiWordings[
                  'NewsMediaItemEdit.UpdateNewsMediaItemSuccessMessage'
                ],
            Alert.alertTypes.INFO
          )
        );

        getNewsMediaItem(returnedNewsMediaItem._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateNewsMediaItem,
      addNewsMediaItem,
      getNewsMediaItem,
      newsMediaItem,
      setAlerts,
      removeAlerts,
      validInput,
      thumbnailPicked,
      galleryPicked,
      videoLinksPicked
    ]
  );

  /* end of event handlers */

  if (newsMediaItemsLoading) {
    return <Loading />;
  }

  const backToNewsMediaItemListButton = (
    <GroupContainer>
      <LinkButton to={routes.newsMediaItemList(true)}>
        {uiWordings['NewsMediaItemEdit.BackToNewsMediaItemList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToNewsMediaItemListButton}</>;
  }

  return (
    <>
      {backToNewsMediaItemListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m10'>
            <h4>
              {isAddMode
                ? uiWordings['NewsMediaItemEdit.AddNewsMediaItemTitle']
                : uiWordings['NewsMediaItemEdit.EditNewsMediaItemTitle']}
            </h4>
          </div>
          <div className='w3-col m2 w3-row'>
            <div className='w3-col m12'>
              <Label
                htmlFor='isEnabled'
                message={uiWordings['NewsMediaItem.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={newsMediaItem.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelInputTextPair
          name='label'
          value={newsMediaItem.label}
          labelMessage={uiWordings['NewsMediaItem.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_tc'
          value={newsMediaItem.name_tc}
          labelMessage={uiWordings['NewsMediaItem.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={newsMediaItem.name_sc}
          labelMessage={uiWordings['NewsMediaItem.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_en'
          value={newsMediaItem.name_en}
          labelMessage={uiWordings['NewsMediaItem.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelDatePickerPair
          name='fromDate'
          value={newsMediaItem.fromDate}
          labelMessage={uiWordings['NewsMediaItem.FromDateLabel']}
          placeholder={
            uiWordings['NewsMediaItemEdit.SelectFromDatePlaceholder']
          }
          onChange={onChange}
        />

        <AccordionRegion
          title={uiWordings['NewsMediaItemEdit.MediaRegionTitle']}
        >
          <FileUpload
            name='thumbnail'
            labelMessage={uiWordings['NewsMediaItem.ThumbnailLabel']}
            files={thumbnailPicked ? [thumbnailPicked] : null}
            onGetFiles={onGetThumbnailPicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='gallery'
            labelMessage={uiWordings['NewsMediaItem.GalleryLabel']}
            files={getArraySafe(galleryPicked)}
            onGetFiles={onGetGalleryPicked}
            isMultiple={true}
            mediumType={mediumTypes.IMAGE}
            orderDirection='horizontal'
          />
          <TextList
            name='videoLinks'
            labelMessage={uiWordings['NewsMediaItem.VideoLinksLabel']}
            textItems={videoLinksPicked}
            onGetTextItems={onGetVideoLinksPicked}
          />
        </AccordionRegion>

        <AccordionRegion
          title={uiWordings['NewsMediaItemEdit.DescriptionRegionTitle']}
        >
          <LabelRichTextbox
            name='desc_tc'
            value={newsMediaItem.desc_tc}
            labelMessage={uiWordings['NewsMediaItem.DescTcLabel']}
            // placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_sc'
            value={newsMediaItem.desc_sc}
            labelMessage={uiWordings['NewsMediaItem.DescScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_en'
            value={newsMediaItem.desc_en}
            labelMessage={uiWordings['NewsMediaItem.DescEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={newsMediaItem.createDTDisplay}
              labelMessage={uiWordings['NewsMediaItem.CreateDTLabel']}
            />
            <LabelLabelPair
              value={newsMediaItem.lastModifyDTDisplay}
              labelMessage={uiWordings['NewsMediaItem.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={newsMediaItem.lastModifyUserDisplay}
              labelMessage={uiWordings['NewsMediaItem.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['NewsMediaItemEdit.AddNewsMediaItemSubmit']
              : uiWordings['NewsMediaItemEdit.UpdateNewsMediaItemSubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={newsMediaItemDelete}>
              {uiWordings['NewsMediaItemEdit.DeleteNewsMediaItem']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const NewsMediaItemEditWithContainer = _ => (
  <NewsMediaItemsPageContainer>
    <NewsMediaItemEdit />
  </NewsMediaItemsPageContainer>
);

export default NewsMediaItemEditWithContainer;
