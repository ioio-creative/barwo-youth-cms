import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import ActivitiesPageContainer from 'components/activities/ActivitiesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelTextAreaPair from 'components/form/LabelTextAreaPair';
//import FileUploadOrUrl from 'components/form/FileUploadOrUrl';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelDatePickerPair from 'components/form/LabelDatePickerPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import TextList from 'components/form/TextList';
import Activity from 'models/activity';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';
import { formatDateString } from 'utils/datetime';

const emptyActivity = new Activity();
const defaultState = emptyActivity;

const mediumTypes = Medium.mediumTypes;

const ActivityEdit = _ => {
  const { activityId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    activity: fetchedActivity,
    activitiesErrors,
    activitiesLoading,
    getActivity,
    clearActivity,
    addActivity,
    updateActivity,
    clearActivitiesErrors,
    deleteActivity
  } = useContext(ActivitiesContext);

  const [activity, setActivity] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // gallery
  const [galleryPicked, setGalleryPicked] = useState([]);

  // videoLinks
  const [videoLinksPicked, setVideoLinksPicked] = useState([]);

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

  // activityId
  useEffect(
    _ => {
      if (activityId) {
        getActivity(activityId);
      }

      return _ => {
        clearActivity();
      };
    },
    [activityId, getActivity, clearActivity]
  );

  // fetchedActivity
  useEffect(
    _ => {
      setActivity(
        fetchedActivity
          ? Activity.getActivityForDisplay(fetchedActivity)
          : defaultState
      );
      if (fetchedActivity) {
        setFeaturedImagePicked(fetchedActivity.featuredImage);
        setGalleryPicked(getArraySafe(fetchedActivity.gallery));
        setVideoLinksPicked(
          getArraySafe(fetchedActivity.videoLinks).map(
            TextList.mapTextToTextItem
          )
        );
        // setDownloadData({
        //   name_tc: fetchedActivity.downloadName_tc,
        //   name_sc: fetchedActivity.downloadName_sc,
        //   name_en: fetchedActivity.downloadName_en,
        //   type: fetchedActivity.downloadType,
        //   url_tc: fetchedActivity.downloadUrl_tc,
        //   url_sc: fetchedActivity.downloadUrl_sc,
        //   url_en: fetchedActivity.downloadUrl_en,
        //   medium: fetchedActivity.downloadMedium
        // });
        if (fetchedActivity.pageMeta) {
          setPageMeta(fetchedActivity.pageMeta);
        }
      }
      setIsAddMode(!fetchedActivity);
    },
    [fetchedActivity]
  );

  // activitiesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(activitiesErrors)) {
        setAlerts(
          activitiesErrors.map(activitiesError => {
            return new Alert(
              Activity.activitiesResponseTypes[activitiesError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearActivitiesErrors();

        if (
          activitiesErrors.includes(
            Activity.activitiesResponseTypes.ACTIVITY_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [activitiesErrors, setAlerts, clearActivitiesErrors]
  );

  /* methods */

  const validInput = useCallback(activityInput => {
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
      setActivity(prevActivity => ({ ...prevActivity, [name]: value }));
    },
    [removeAlerts]
  );

  const onGetFeaturedImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetGalleryPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setGalleryPicked(newItemList);
  }, []);

  const onGetVideoLinksPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setVideoLinksPicked(newItemList);
  }, []);

  // const onDownloadDataChange = useCallback(newData => {
  //   setDownloadData(newData);
  // }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const activityDelete = useCallback(
    async _ => {
      const isSuccess = await deleteActivity(activityId);
      if (isSuccess) {
        goToUrl(routes.activityList(true));
        setAlerts(
          new Alert(
            uiWordings['ActivityEdit.DeleteActivitySuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [activityId, deleteActivity, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // format dates
      activity.fromDate = formatDateString(activity.fromDate);
      activity.toDate = formatDateString(activity.toDate);

      // add featuredImage
      activity.featuredImage = featuredImagePicked
        ? featuredImagePicked._id
        : null;

      // add videoLinks
      activity.videoLinks = getArraySafe(videoLinksPicked).map(
        TextList.getTextFromTextItem
      );

      // add gallery
      activity.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });

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
      // activity.downloadName_tc = name_tc;
      // activity.downloadName_sc = name_sc;
      // activity.downloadName_en = name_en;
      // activity.downloadType = type;
      // activity.downloadUrl_tc = url_tc;
      // activity.downloadUrl_sc = url_sc;
      // activity.downloadUrl_en = url_en;
      // activity.downloadMedium = medium ? medium._id : null;

      // add pageMeta
      activity.pageMeta = PageMeta.cleanPageMetaBeforeSubmit(pageMeta);
      let isSuccess = validInput(activity);
      let returnedActivity = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addActivity : updateActivity;
        returnedActivity = await funcToCall(activity);
        isSuccess = Boolean(returnedActivity);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['ActivityEdit.AddActivitySuccessMessage']
              : uiWordings['ActivityEdit.UpdateActivitySuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getActivity(returnedActivity._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateActivity,
      addActivity,
      getActivity,
      activity,
      setAlerts,
      removeAlerts,
      validInput,
      featuredImagePicked,
      galleryPicked,
      videoLinksPicked,
      //downloadData,
      pageMeta
    ]
  );

  /* end of event handlers */

  if (activitiesLoading) {
    return <Loading />;
  }

  const backToActivityListButton = (
    <GroupContainer>
      <LinkButton to={routes.activityList(true)}>
        {uiWordings['ActivityEdit.BackToActivityList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToActivityListButton}</>;
  }

  return (
    <>
      {backToActivityListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m6'>
            <h4>
              {isAddMode
                ? uiWordings['ActivityEdit.AddActivityTitle']
                : uiWordings['ActivityEdit.EditActivityTitle']}
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
                message={uiWordings['Activity.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={activity.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelInputTextPair
          name='label'
          value={activity.label}
          labelMessage={uiWordings['Activity.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_tc'
          value={activity.name_tc}
          labelMessage={uiWordings['Activity.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={activity.name_sc}
          labelMessage={uiWordings['Activity.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={/*true*/ !isAddMode}
        />
        <LabelInputTextPair
          name='name_en'
          value={activity.name_en}
          labelMessage={uiWordings['Activity.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelTextAreaPair
          name='nameForLongDisplay_tc'
          value={activity.nameForLongDisplay_tc}
          labelMessage={uiWordings['Activity.NameForLongDisplayTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />
        <LabelTextAreaPair
          name='nameForLongDisplay_sc'
          value={activity.nameForLongDisplay_sc}
          labelMessage={uiWordings['Activity.NameForLongDisplayScLabel']}
          placeholder=''
          onChange={onChange}
          required={/*true*/ !isAddMode}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />
        <LabelTextAreaPair
          name='nameForLongDisplay_en'
          value={activity.nameForLongDisplay_en}
          labelMessage={uiWordings['Activity.NameForLongDisplayEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          textAreaStyle={LabelTextAreaPair.threeRowStyle}
          isHalf={true}
        />

        <LabelSelectPair
          name='type'
          value={activity.type}
          options={Activity.activityTypeOptions}
          labelMessage={uiWordings['Activity.TypeLabel']}
          onChange={onChange}
        />

        <LabelDatePickerPair
          name='fromDate'
          value={activity.fromDate}
          labelMessage={uiWordings['Activity.FromDateLabel']}
          placeholder={uiWordings['ActivityEdit.SelectFromDatePlaceholder']}
          onChange={onChange}
        />
        <LabelDatePickerPair
          name='toDate'
          value={activity.toDate}
          labelMessage={uiWordings['Activity.ToDateLabel']}
          placeholder={uiWordings['ActivityEdit.SelectToDatePlaceholder']}
          onChange={onChange}
        />

        <AccordionRegion title={uiWordings['ActivityEdit.MediaRegionTitle']}>
          <FileUpload
            name='featuredImage'
            labelMessage={uiWordings['Activity.FeaturedImageLabel']}
            files={featuredImagePicked ? [featuredImagePicked] : null}
            onGetFiles={onGetFeaturedImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='gallery'
            labelMessage={uiWordings['Activity.GalleryLabel']}
            files={getArraySafe(galleryPicked)}
            onGetFiles={onGetGalleryPicked}
            isMultiple={true}
            mediumType={mediumTypes.IMAGE}
          />
          <TextList
            name='videoLinks'
            labelMessage={uiWordings['Activity.VideoLinksLabel']}
            textItems={videoLinksPicked}
            onGetTextItems={onGetVideoLinksPicked}
          />
          {/* <FileUploadOrUrl
            nameTcLabelMessage={uiWordings['Activity.DownloadNameTcLabel']}
            nameScLabelMessage={uiWordings['Activity.DownloadNameScLabel']}
            nameEnLabelMessage={uiWordings['Activity.DownloadNameEnLabel']}
            selectLabelMessage={uiWordings['Activity.DownloadTypeLabel']}
            mediumLabelMessage={uiWordings['Activity.DownloadMediumLabel']}
            urlTcLabelMessage={uiWordings['Activity.DownloadUrlTcLabel']}
            urlScLabelMessage={uiWordings['Activity.DownloadUrlScLabel']}
            urlEnLabelMessage={uiWordings['Activity.DownloadUrlEnLabel']}
            mediumType={Medium.mediumTypes.PDF}
            data={downloadData}
            onChange={onDownloadDataChange}
          /> */}
        </AccordionRegion>

        <AccordionRegion title={uiWordings['ActivityEdit.LocationRegionTitle']}>
          <LabelRichTextbox
            name='location_tc'
            value={activity.location_tc}
            labelMessage={uiWordings['Activity.LocationTcLabel']}
            // placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='location_sc'
            value={activity.location_sc}
            labelMessage={uiWordings['Activity.LocationScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='location_en'
            value={activity.location_en}
            labelMessage={uiWordings['Activity.LocationEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        <AccordionRegion
          title={uiWordings['ActivityEdit.DescriptionRegionTitle']}
        >
          <LabelRichTextbox
            name='desc_tc'
            value={activity.desc_tc}
            labelMessage={uiWordings['Activity.DescTcLabel']}
            // placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_sc'
            value={activity.desc_sc}
            labelMessage={uiWordings['Activity.DescScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_en'
            value={activity.desc_en}
            labelMessage={uiWordings['Activity.DescEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={activity.createDTDisplay}
              labelMessage={uiWordings['Activity.CreateDTLabel']}
            />
            <LabelLabelPair
              value={activity.lastModifyDTDisplay}
              labelMessage={uiWordings['Activity.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={activity.lastModifyUserDisplay}
              labelMessage={uiWordings['Activity.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['ActivityEdit.AddActivitySubmit']
              : uiWordings['ActivityEdit.UpdateActivitySubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={activityDelete}>
              {uiWordings['ActivityEdit.DeleteActivity']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const ActivityEditWithContainer = _ => (
  <ActivitiesPageContainer>
    <ActivityEdit />
  </ActivitiesPageContainer>
);

export default ActivityEditWithContainer;
