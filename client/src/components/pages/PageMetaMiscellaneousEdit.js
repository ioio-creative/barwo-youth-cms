import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import PageMetaMiscellaneousContext from 'contexts/pageMetaMiscellaneous/pageMetaMiscellaneousContext';
import PageMetaMiscellaneousContainer from 'components/pageMetaMiscellaneous/PageMetaMiscellaneousContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import Form from 'components/form/Form';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import PageMetaEdit from 'components/pageMeta/PageMetaEdit';
import PageMetaMiscellaneous from 'models/pageMetaMiscellaneous';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyPageMetaMiscellaneous = new PageMetaMiscellaneous();
const defaultState = emptyPageMetaMiscellaneous;

const PageMetaMiscellaneousEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    pageMetaMiscellaneous: fetchedPageMetaMiscellaneous,
    pageMetaMiscellaneousErrors,
    pageMetaMiscellaneousLoading,
    getPageMetaMiscellaneous,
    clearPageMetaMiscellaneous,
    clearPageMetaMiscellaneousErrors,
    updatePageMetaMiscellaneous
  } = useContext(PageMetaMiscellaneousContext);

  const [pageMetaMiscellaneous, setPageMetaMiscellaneous] = useState(
    defaultState
  );
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // landingPageMeta
  const [landingPageMeta, setLandingPageMeta] = useState(new PageMeta());

  // aboutMeta
  const [aboutMeta, setAboutMeta] = useState(new PageMeta());

  // artistListMeta
  const [artistListMeta, setArtistListMeta] = useState(new PageMeta());

  // eventListMeta
  const [eventListMeta, setEventListMeta] = useState(new PageMeta());

  // activityListMeta
  const [activityListMeta, setActivityListMeta] = useState(new PageMeta());

  // newsListMeta
  const [newsListMeta, setNewsListMeta] = useState(new PageMeta());

  // mediaListMeta
  const [mediaListMeta, setMediaListMeta] = useState(new PageMeta());

  // recruitmentMeta
  const [recruitmentMeta, setRecruitmentMeta] = useState(new PageMeta());

  // componentDidMount
  useEffect(_ => {
    getPageMetaMiscellaneous();
    return _ => {
      clearPageMetaMiscellaneous();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedPageMetaMiscellaneous
  useEffect(
    _ => {
      setPageMetaMiscellaneous(
        fetchedPageMetaMiscellaneous
          ? PageMetaMiscellaneous.getPageMetaMiscellaneousForDisplay(
              fetchedPageMetaMiscellaneous
            )
          : defaultState
      );
      if (fetchedPageMetaMiscellaneous) {
        if (fetchedPageMetaMiscellaneous.landingPageMeta) {
          setLandingPageMeta(fetchedPageMetaMiscellaneous.landingPageMeta);
        }
        if (fetchedPageMetaMiscellaneous.aboutMeta) {
          setAboutMeta(fetchedPageMetaMiscellaneous.aboutMeta);
        }
        if (fetchedPageMetaMiscellaneous.artistListMeta) {
          setArtistListMeta(fetchedPageMetaMiscellaneous.artistListMeta);
        }
        if (fetchedPageMetaMiscellaneous.eventListMeta) {
          setEventListMeta(fetchedPageMetaMiscellaneous.eventListMeta);
        }
        if (fetchedPageMetaMiscellaneous.activityListMeta) {
          setActivityListMeta(fetchedPageMetaMiscellaneous.activityListMeta);
        }
        if (fetchedPageMetaMiscellaneous.newsListMeta) {
          setNewsListMeta(fetchedPageMetaMiscellaneous.newsListMeta);
        }
        if (fetchedPageMetaMiscellaneous.mediaListMeta) {
          setMediaListMeta(fetchedPageMetaMiscellaneous.mediaListMeta);
        }
        if (fetchedPageMetaMiscellaneous.recruitmentMeta) {
          setRecruitmentMeta(fetchedPageMetaMiscellaneous.recruitmentMeta);
        }
      }
      setIsAddMode(!fetchedPageMetaMiscellaneous);
    },
    [fetchedPageMetaMiscellaneous]
  );

  // pageMetaMiscellaneousErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(pageMetaMiscellaneousErrors)) {
        setAlerts(
          pageMetaMiscellaneousErrors
            .filter(
              errorType =>
                errorType !==
                PageMetaMiscellaneous.pageMetaMiscellaneousResponseTypes
                  .PAGE_META_MISCELLANEOUS_NOT_EXISTS.type
            )
            .map(pageMetaMiscellaneousError => {
              return new Alert(
                PageMetaMiscellaneous.pageMetaMiscellaneousResponseTypes[
                  pageMetaMiscellaneousError
                ].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearPageMetaMiscellaneousErrors();
      }
    },
    [pageMetaMiscellaneousErrors, setAlerts, clearPageMetaMiscellaneousErrors]
  );

  /* methods */

  const validInput = useCallback(pageMetaMiscellaneousInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  // const onChange = useCallback(
  //   e => {
  //     setIsSubmitEnabled(true);
  //     removeAlerts();
  //     const name = e.target.name;
  //     const value = e.target.value;
  //     setPageMetaMiscellaneous(prevPageMetaMiscellaneous => ({ ...prevPageMetaMiscellaneous, [name]: value }));
  //   },
  //   [removeAlerts]
  // );

  const setLandingPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setLandingPageMeta(setterFunc);
  }, []);

  const setAboutMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setAboutMeta(setterFunc);
  }, []);

  const setArtistListMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setArtistListMeta(setterFunc);
  }, []);

  const setEventListMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setEventListMeta(setterFunc);
  }, []);

  const setActivityListMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setActivityListMeta(setterFunc);
  }, []);

  const setNewsListMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setNewsListMeta(setterFunc);
  }, []);
  
  const setMediaListMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setMediaListMeta(setterFunc);
  }, []);

  const setRecruitmentMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setRecruitmentMeta(setterFunc);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add landingPageMeta
      pageMetaMiscellaneous.landingPageMeta = PageMeta.cleanPageMetaBeforeSubmit(
        landingPageMeta
      );

      // add aboutMeta
      pageMetaMiscellaneous.aboutMeta = PageMeta.cleanPageMetaBeforeSubmit(
        aboutMeta
      );

      // add artistListMeta
      pageMetaMiscellaneous.artistListMeta = PageMeta.cleanPageMetaBeforeSubmit(
        artistListMeta
      );

      // add eventListMeta
      pageMetaMiscellaneous.eventListMeta = PageMeta.cleanPageMetaBeforeSubmit(
        eventListMeta
      );

      // add activityListMeta
      pageMetaMiscellaneous.activityListMeta = PageMeta.cleanPageMetaBeforeSubmit(
        activityListMeta
      );

      // add newsListMeta
      pageMetaMiscellaneous.newsListMeta = PageMeta.cleanPageMetaBeforeSubmit(
        newsListMeta
      );

      // add mediaListMeta
      pageMetaMiscellaneous.mediaListMeta = PageMeta.cleanPageMetaBeforeSubmit(
        mediaListMeta
      );

      // add recruitmentMeta
      pageMetaMiscellaneous.recruitmentMeta = PageMeta.cleanPageMetaBeforeSubmit(
        recruitmentMeta
      );

      let isSuccess = validInput(pageMetaMiscellaneous);
      let returnedPageMetaMiscellaneous = null;
      if (isSuccess) {
        returnedPageMetaMiscellaneous = await updatePageMetaMiscellaneous(
          pageMetaMiscellaneous
        );
        isSuccess = Boolean(returnedPageMetaMiscellaneous);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings[
              'PageMetaMiscellaneousEdit.UpdatePageMetaMiscellaneousSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );

        getPageMetaMiscellaneous();
      }

      scrollToTop();
    },
    [
      updatePageMetaMiscellaneous,
      getPageMetaMiscellaneous,
      pageMetaMiscellaneous,
      setAlerts,
      removeAlerts,
      validInput,
      landingPageMeta,
      aboutMeta,
      artistListMeta,
      eventListMeta,
      activityListMeta,
      newsListMeta,
      mediaListMeta,
      recruitmentMeta
    ]
  );

  /* end of event handlers */

  if (pageMetaMiscellaneousLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className='w3-row'>
        <div className='w3-col m11'>
          <h4>
            {
              uiWordings[
                'PageMetaMiscellaneousEdit.EditPageMetaMiscellaneousTitle'
              ]
            }
          </h4>
        </div>
        <div className='w3-rest w3-row'>
          <div className='w3-col m12'></div>
        </div>
      </div>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.LandingPageMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={landingPageMeta}
          setPageMetaFunc={setLandingPageMetaFunc}
          title=''
          isHideOptionalFields={false}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.AboutMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={aboutMeta}
          setPageMetaFunc={setAboutMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.ArtistListMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={artistListMeta}
          setPageMetaFunc={setArtistListMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.EventListMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={eventListMeta}
          setPageMetaFunc={setEventListMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.ActivityListMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={activityListMeta}
          setPageMetaFunc={setActivityListMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.NewsListMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={newsListMeta}
          setPageMetaFunc={setNewsListMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['PageMetaMiscellaneous.MediaListMetaLabel']}
      >
        <PageMetaEdit
          pageMeta={mediaListMeta}
          setPageMetaFunc={setMediaListMetaFunc}
          title=''
          isHideOptionalFields={true}
        />
      </AccordionRegion>

      {!isAddMode && (
        <>
          <LabelLabelPair
            value={pageMetaMiscellaneous.lastModifyDTDisplay}
            labelMessage={uiWordings['PageMetaMiscellaneous.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={pageMetaMiscellaneous.lastModifyUserDisplay}
            labelMessage={
              uiWordings['PageMetaMiscellaneous.LastModifyUserLabel']
            }
          />
        </>
      )}
      <SubmitButton
        disabled={!isSubmitEnabled}
        label={
          uiWordings[
            'PageMetaMiscellaneousEdit.UpdatePageMetaMiscellaneousSubmit'
          ]
        }
      />
    </Form>
  );
};

const PageMetaMiscellaneousEditWithContainer = _ => (
  <PageMetaMiscellaneousContainer>
    <PageMetaMiscellaneousEdit />
  </PageMetaMiscellaneousContainer>
);

export default PageMetaMiscellaneousEditWithContainer;
