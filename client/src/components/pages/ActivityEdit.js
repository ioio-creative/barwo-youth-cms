import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import ActivitiesPageContainer from 'components/activities/ActivitiesPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
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

  const validInput = useCallback(artistInput => {
    return true;
  }, []);

  /* end of methods */

  return <div>ActivityEdit</div>;
};

const ActivityEditWithContainer = _ => (
  <ActivitiesPageContainer>
    <ActivityEdit />
  </ActivitiesPageContainer>
);

export default ActivityEditWithContainer;
