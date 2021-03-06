import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import NewsesContext from 'contexts/newses/newsesContext';
import NewsesPageContainer from 'components/newses/NewsesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelSelectPair from 'components/form/LabelSelectPair';
//import FileUploadOrUrl from 'components/form/FileUploadOrUrl';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelDatePickerPair from 'components/form/LabelDatePickerPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import News from 'models/news';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyNews = new News();
const defaultState = emptyNews;

const mediumTypes = Medium.mediumTypes;

const NewsEdit = _ => {
  const { newsId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    news: fetchedNews,
    newsesErrors,
    newsesLoading,
    getNews,
    clearNews,
    addNews,
    updateNews,
    clearNewsesErrors,
    deleteNews
  } = useContext(NewsesContext);

  const [news, setNews] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // // download data
  // const [downloadData, setDownloadData] = useState({});

  // pageMeta
  const [pageMeta, setPageMeta] = useState(new PageMeta());

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // newsId
  useEffect(
    _ => {
      if (newsId) {
        getNews(newsId);
      }

      return _ => {
        clearNews();
      };
    },
    [newsId, getNews, clearNews]
  );

  // fetchedNews
  useEffect(
    _ => {
      setNews(fetchedNews ? News.getNewsForDisplay(fetchedNews) : defaultState);
      if (fetchedNews) {
        setFeaturedImagePicked(fetchedNews.featuredImage);
        // setDownloadData({
        //   name_tc: fetchedNews.downloadName_tc,
        //   name_sc: fetchedNews.downloadName_sc,
        //   name_en: fetchedNews.downloadName_en,
        //   type: fetchedNews.downloadType,
        //   url_tc: fetchedNews.downloadUrl_tc,
        //   url_sc: fetchedNews.downloadUrl_sc,
        //   url_en: fetchedNews.downloadUrl_en,
        //   medium: fetchedNews.downloadMedium
        // });
        if (fetchedNews.pageMeta) {
          setPageMeta(fetchedNews.pageMeta);
        }
      }
      setIsAddMode(!fetchedNews);
    },
    [fetchedNews]
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

        if (
          newsesErrors.includes(News.newsesResponseTypes.NEWS_NOT_EXISTS.type)
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [newsesErrors, setAlerts, clearNewsesErrors]
  );

  /* methods */

  const validInput = useCallback(newsInput => {
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
      setNews(prevNews => ({ ...prevNews, [name]: value }));
    },
    [removeAlerts]
  );

  const onGetFeaturedImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedImagePicked(firstOrDefault(newItemList, null));
  }, []);

  // const onDownloadDataChange = useCallback(newData => {
  //   setDownloadData(newData);
  // }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const newsDelete = useCallback(
    async _ => {
      const isSuccess = await deleteNews(newsId);
      if (isSuccess) {
        goToUrl(routes.newsList(true));
        setAlerts(
          new Alert(
            uiWordings['NewsEdit.DeleteNewsSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [newsId, deleteNews, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add featuredImage
      news.featuredImage = featuredImagePicked ? featuredImagePicked._id : null;

      // // add download data
      // const {
      //   name_tc,
      //   name_sc,
      //   name_en,
      //   type,
      //   url_tc,
      //   url_sc,
      //   url_en,
      //   medium
      // } = downloadData;
      // news.downloadName_tc = name_tc;
      // news.downloadName_sc = name_sc;
      // news.downloadName_en = name_en;
      // news.downloadType = type;
      // news.downloadUrl_tc = url_tc;
      // news.downloadUrl_sc = url_sc;
      // news.downloadUrl_en = url_en;
      // news.downloadMedium = medium ? medium._id : null;

      // add pageMeta
      news.pageMeta = PageMeta.cleanPageMetaBeforeSubmit(pageMeta);
      let isSuccess = validInput(news);
      let returnedNews = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addNews : updateNews;
        returnedNews = await funcToCall(news);
        isSuccess = Boolean(returnedNews);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['NewsEdit.AddNewsSuccessMessage']
              : uiWordings['NewsEdit.UpdateNewsSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getNews(returnedNews._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateNews,
      addNews,
      getNews,
      news,
      setAlerts,
      removeAlerts,
      validInput,
      featuredImagePicked,
      //downloadData
      pageMeta
    ]
  );

  /* end of event handlers */

  if (newsesLoading) {
    return <Loading />;
  }

  const backToNewsListButton = (
    <GroupContainer>
      <LinkButton to={routes.newsList(true)}>
        {uiWordings['NewsEdit.BackToNewsList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToNewsListButton}</>;
  }

  return (
    <>
      {backToNewsListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m8'>
            <h4>
              {isAddMode
                ? uiWordings['NewsEdit.AddNewsTitle']
                : uiWordings['NewsEdit.EditNewsTitle']}
            </h4>
          </div>
          <div className='w3-rest w3-row'>
            <div className='w3-col m6'>
              <PageMetaEditWithModal
                pageMeta={pageMeta}
                setPageMetaFunc={setPageMetaFunc}
                isHideOptionalFields={true}
              />
            </div>
            <div className='w3-col m6'>
              <Label
                htmlFor='isEnabled'
                message={uiWordings['News.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={news.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelInputTextPair
          name='label'
          value={news.label}
          labelMessage={uiWordings['News.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_tc'
          value={news.name_tc}
          labelMessage={uiWordings['News.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={news.name_sc}
          labelMessage={uiWordings['News.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={/*true*/ !isAddMode}
        />
        <LabelInputTextPair
          name='name_en'
          value={news.name_en}
          labelMessage={uiWordings['News.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelSelectPair
          name='type'
          value={news.type}
          options={News.newsTypeOptions}
          labelMessage={uiWordings['News.TypeLabel']}
          onChange={onChange}
        />

        <LabelDatePickerPair
          name='fromDate'
          value={news.fromDate}
          labelMessage={uiWordings['News.FromDateLabel']}
          placeholder={uiWordings['NewsEdit.SelectFromDatePlaceholder']}
          onChange={onChange}
        />

        <AccordionRegion title={uiWordings['NewsEdit.MediaRegionTitle']}>
          <FileUpload
            name='featuredImage'
            labelMessage={uiWordings['News.FeaturedImageLabel']}
            files={featuredImagePicked ? [featuredImagePicked] : null}
            onGetFiles={onGetFeaturedImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          {/* <FileUploadOrUrl
            nameTcLabelMessage={uiWordings['News.DownloadNameTcLabel']}
            nameScLabelMessage={uiWordings['News.DownloadNameScLabel']}
            nameEnLabelMessage={uiWordings['News.DownloadNameEnLabel']}
            selectLabelMessage={uiWordings['News.DownloadTypeLabel']}
            mediumLabelMessage={uiWordings['News.DownloadMediumLabel']}
            urlTcLabelMessage={uiWordings['News.DownloadUrlTcLabel']}
            urlScLabelMessage={uiWordings['News.DownloadUrlScLabel']}
            urlEnLabelMessage={uiWordings['News.DownloadUrlEnLabel']}
            mediumType={Medium.mediumTypes.PDF}
            data={downloadData}
            onChange={onDownloadDataChange}
          /> */}
        </AccordionRegion>

        <AccordionRegion title={uiWordings['NewsEdit.DescriptionRegionTitle']}>
          <LabelRichTextbox
            name='desc_tc'
            value={news.desc_tc}
            labelMessage={uiWordings['News.DescTcLabel']}
            // placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_sc'
            value={news.desc_sc}
            labelMessage={uiWordings['News.DescScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_en'
            value={news.desc_en}
            labelMessage={uiWordings['News.DescEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={news.createDTDisplay}
              labelMessage={uiWordings['News.CreateDTLabel']}
            />
            <LabelLabelPair
              value={news.lastModifyDTDisplay}
              labelMessage={uiWordings['News.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={news.lastModifyUserDisplay}
              labelMessage={uiWordings['News.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['NewsEdit.AddNewsSubmit']
              : uiWordings['NewsEdit.UpdateNewsSubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={newsDelete}>
              {uiWordings['NewsEdit.DeleteNews']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const NewsEditWithContainer = _ => (
  <NewsesPageContainer>
    <NewsEdit />
  </NewsesPageContainer>
);

export default NewsEditWithContainer;
