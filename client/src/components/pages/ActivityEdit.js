import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import ActivitiesPageContainer from 'components/activities/ActivitiesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import FileUploadOrUrl from 'components/form/FileUploadOrUrl';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelDatePickerPair from 'components/form/LabelDatePickerPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Activity from 'models/activity';
import Medium from 'models/medium';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

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
    clearActivitiesErrors
  } = useContext(ActivitiesContext);

  const [activity, setActivity] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // gallery
  const [galleryPicked, setGalleryPicked] = useState([]);

  // download data
  const [downloadData, setDownloadData] = useState({});

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
      if (!activitiesLoading) {
        setActivity(
          fetchedActivity
            ? Activity.getActivityForDisplay(fetchedActivity)
            : defaultState
        );
        if (fetchedActivity) {
          setFeaturedImagePicked(fetchedActivity.featuredImage);
          setGalleryPicked(getArraySafe(fetchedActivity.gallery));
          setDownloadData({
            name_tc: fetchedActivity.downloadName_tc,
            name_sc: fetchedActivity.downloadName_sc,
            name_en: fetchedActivity.downloadName_en,
            type: fetchedActivity.downloadType,
            url_tc: fetchedActivity.downloadUrl_tc,
            url_sc: fetchedActivity.downloadUrl_sc,
            url_en: fetchedActivity.downloadUrl_en,
            medium: fetchedActivity.downloadMedium
          });
        }
        setIsAddMode(!fetchedActivity);
      }
    },
    [activitiesLoading, fetchedActivity]
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

  const onDownloadDataChange = useCallback(newData => {
    setDownloadData(newData);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add featuredImage
      activity.featuredImage = featuredImagePicked
        ? featuredImagePicked._id
        : null;

      // add gallery
      activity.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });

      // add download data
      const {
        name_tc,
        name_sc,
        name_en,
        type,
        url_tc,
        url_sc,
        url_en,
        medium
      } = downloadData;
      activity.downloadName_tc = name_tc;
      activity.downloadName_sc = name_sc;
      activity.downloadName_en = name_en;
      activity.downloadType = type;
      activity.downloadUrl_tc = url_tc;
      activity.downloadUrl_sc = url_sc;
      activity.downloadUrl_en = url_en;
      activity.downloadMedium = medium ? medium._id : null;

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

        goToUrl(routes.activityEditByIdWithValue(true, returnedActivity._id));
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
      downloadData
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
        <h4>
          {isAddMode
            ? uiWordings['ActivityEdit.AddActivityTitle']
            : uiWordings['ActivityEdit.EditActivityTitle']}
        </h4>
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
          required={true}
        />
        <LabelInputTextPair
          name='name_en'
          value={activity.name_en}
          labelMessage={uiWordings['Activity.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelSelectPair
          name='type'
          value={activity.type}
          options={Activity.activityTypeOptions}
          labelMessage={uiWordings['Activity.TypeLabel']}
          onChange={onChange}
        />

        <div className='w3-card w3-container'>
          <h4>{uiWordings['ActivityEdit.Media.Title']}</h4>
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
          <FileUploadOrUrl
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
          />
        </div>

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

        <LabelTogglePair
          name='isEnabled'
          value={activity.isEnabled}
          labelMessage={uiWordings['Activity.IsEnabledLabel']}
          onChange={onChange}
        />

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
