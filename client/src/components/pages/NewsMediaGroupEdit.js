import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import NewsMediaGroupsContext from 'contexts/newsMediaGroups/newsMediaGroupsContext';
import NewsMediaGroupsPageContainer from 'components/newsMediaGroups/NewsMediaGroupsPageContainer';
import NewsMediaGroupEditNewsMediaItemSelect from 'components/newsMediaGroups/NewsMediaGroupEditNewsMediaItemSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import NewsMediaGroup from 'models/newsMediaGroup';
import Medium from 'models/medium';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyNewsMediaGroup = new NewsMediaGroup();
const defaultState = emptyNewsMediaGroup;

const mediumTypes = Medium.mediumTypes;

const NewsMediaGroupEdit = _ => {
  const { newsMediaGroupId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    newsMediaGroup: fetchedNewsMediaGroup,
    newsMediaGroupsErrors,
    newsMediaGroupsLoading,
    getNewsMediaGroup,
    clearNewsMediaGroup,
    addNewsMediaGroup,
    updateNewsMediaGroup,
    clearNewsMediaGroupsErrors,
    deleteNewsMediaGroup
  } = useContext(NewsMediaGroupsContext);

  const [newsMediaGroup, setNewsMediaGroup] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // news media items in group
  const [newsMediaItemsPicked, setNewsMediaItemsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // newsMediaGroupId
  useEffect(
    _ => {
      if (newsMediaGroupId) {
        getNewsMediaGroup(newsMediaGroupId);
      }

      return _ => {
        clearNewsMediaGroup();
      };
    },
    [newsMediaGroupId, getNewsMediaGroup, clearNewsMediaGroup]
  );

  // fetchedNewsMediaGroup
  useEffect(
    _ => {
      setNewsMediaGroup(
        fetchedNewsMediaGroup
          ? NewsMediaGroup.getNewsMediaGroupForDisplay(fetchedNewsMediaGroup)
          : defaultState
      );
      if (fetchedNewsMediaGroup) {
        setNewsMediaItemsPicked(fetchedNewsMediaGroup.setNewsMediaItemsPicked);
      }
      setIsAddMode(!fetchedNewsMediaGroup);
    },
    [fetchedNewsMediaGroup]
  );

  // newsMediaGroupsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(newsMediaGroupsErrors)) {
        setAlerts(
          newsMediaGroupsErrors.map(newsMediaGroupsError => {
            return new Alert(
              NewsMediaGroup.newsMediaGroupsResponseTypes[
                newsMediaGroupsError
              ].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearNewsMediaGroupsErrors();

        if (
          newsMediaGroupsErrors.includes(
            NewsMediaGroup.newsMediaGroupsResponseTypes
              .NEWS_MEDIA_GROUP_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [newsMediaGroupsErrors, setAlerts, clearNewsMediaGroupsErrors]
  );

  /* methods */

  const validInput = useCallback(newsMediaGroupInput => {
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
      setNewsMediaGroup(prevNewsMediaGroup => ({
        ...prevNewsMediaGroup,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetNewsMediaItemsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setNewsMediaItemsPicked(newItemList);
  }, []);

  const newsMediaGroupDelete = useCallback(
    async _ => {
      const isSuccess = await deleteNewsMediaGroup(newsMediaGroupId);
      if (isSuccess) {
        goToUrl(routes.newsMediaGroupList(true));
        setAlerts(
          new Alert(
            uiWordings['NewsMediaGroupEdit.DeleteNewsMediaGroupSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [newsMediaGroupId, deleteNewsMediaGroup, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add newsMediaItems
      newsMediaGroup.newsMediaItems = getArraySafe(newsMediaItemsPicked).map(
        newsMediaItem => newsMediaItem._id
      );

      let isSuccess = validInput(newsMediaGroup);
      let returnedNewsMediaGroup = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addNewsMediaGroup : updateNewsMediaGroup;
        returnedNewsMediaGroup = await funcToCall(newsMediaGroup);
        isSuccess = Boolean(returnedNewsMediaGroup);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['NewsMediaGroupEdit.AddNewsMediaGroupSuccessMessage']
              : uiWordings[
                  'NewsMediaGroupEdit.UpdateNewsMediaGroupSuccessMessage'
                ],
            Alert.alertTypes.INFO
          )
        );

        getNewsMediaGroup(returnedNewsMediaGroup._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateNewsMediaGroup,
      addNewsMediaGroup,
      getNewsMediaGroup,
      newsMediaGroup,
      setAlerts,
      validInput,
      qnasPicked,
      featuredImagePicked,
      withoutMaskImagePicked,
      galleryPicked,
      soundPicked,
      removeAlerts
    ]
  );

  /* end of event handlers */

  if (newsMediaGroupsLoading) {
    return <Loading />;
  }

  const backToNewsMediaGroupListButton = (
    <GroupContainer>
      <LinkButton to={routes.newsMediaGroupList(true)}>
        {uiWordings['NewsMediaGroupEdit.BackToNewsMediaGroupList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToNewsMediaGroupListButton}</>;
  }

  return (
    <>
      {backToNewsMediaGroupListButton}
      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m10'>
            <h4>
              {isAddMode
                ? uiWordings['NewsMediaGroupEdit.AddNewsMediaGroupTitle']
                : uiWordings['NewsMediaGroupEdit.EditNewsMediaGroupTitle']}
            </h4>
          </div>
          <div className='w3-col m2 w3-row'>
            <div className='w3-col m12'>
              <Label
                htmlFor='isEnabled'
                message={uiWordings['NewsMediaGroup.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={newsMediaGroup.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelInputTextPair
          name='label'
          value={newsMediaGroup.label}
          labelMessage={uiWordings['NewsMediaGroup.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_tc'
          value={newsMediaGroup.name_tc}
          labelMessage={uiWordings['NewsMediaGroup.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={newsMediaGroup.name_sc}
          labelMessage={uiWordings['NewsMediaGroup.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_en'
          value={newsMediaGroup.name_en}
          labelMessage={uiWordings['NewsMediaGroup.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelSelectPair
          name='year'
          value={newsMediaGroup.year}
          options={NewsMediaGroup.yearOptions}
          labelMessage={uiWordings['NewsMediaGroup.YearLabel']}
          onChange={onChange}
        />

        <NewsMediaGroupEditNewsMediaItemSelect
          newsMediaItems={newsMediaItemsPicked}
          onGetNewsMediaItems={onGetNewsMediaItemsPicked}
        />

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={newsMediaGroup.createDTDisplay}
              labelMessage={uiWordings['NewsMediaGroup.CreateDTLabel']}
            />
            <LabelLabelPair
              value={newsMediaGroup.lastModifyDTDisplay}
              labelMessage={uiWordings['NewsMediaGroup.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={newsMediaGroup.lastModifyUserDisplay}
              labelMessage={uiWordings['NewsMediaGroup.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['NewsMediaGroupEdit.AddNewsMediaGroupSubmit']
              : uiWordings['NewsMediaGroupEdit.UpdateNewsMediaGroupSubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={newsMediaGroupDelete}>
              {uiWordings['NewsMediaGroupEdit.DeleteNewsMediaGroup']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const NewsMediaGroupEditWithContainer = _ => (
  <NewsMediaGroupsPageContainer>
    <NewsMediaGroupEdit />
  </NewsMediaGroupsPageContainer>
);

export default NewsMediaGroupEditWithContainer;
