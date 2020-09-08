import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import ArtistEditQnaSelect from 'components/artists/ArtistEditQnaSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import FileUpload from 'components/form/FileUpload';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Label from 'components/form/Label';
import Toggle from 'components/form/Toggle';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import DeleteWithConfirmButton from 'components/form/DeleteWithConfirmButton';
import PageMetaEditWithModal from 'components/pageMeta/PageMetaEditWithModal';
import Artist from 'models/artist';
import Medium from 'models/medium';
import PageMeta from 'models/pageMeta';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyArtist = new Artist();
const defaultState = emptyArtist;

const mediumTypes = Medium.mediumTypes;

const ArtistEdit = _ => {
  const { artistId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artist: fetchedArtist,
    artistsErrors,
    artistsLoading,
    getArtist,
    clearArtist,
    addArtist,
    updateArtist,
    clearArtistsErrors,
    deleteArtist
  } = useContext(ArtistsContext);

  const [artist, setArtist] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // qnas in artist
  const [qnasPicked, setQnasPicked] = useState([]);

  // featuredImage
  const [featuredImagePicked, setFeaturedImagePicked] = useState(null);

  // withoutMaskImage
  const [withoutMaskImagePicked, setWithoutMaskImagePicked] = useState(null);

  // gallery
  const [galleryPicked, setGalleryPicked] = useState([]);

  // sound
  const [soundPicked, setSoundPicked] = useState(null);

  // pageMeta
  const [pageMeta, setPageMeta] = useState(new PageMeta());

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // artistId
  useEffect(
    _ => {
      if (artistId) {
        getArtist(artistId);
      }

      return _ => {
        clearArtist();
      };
    },
    [artistId, getArtist, clearArtist]
  );

  // fetchedArtist
  useEffect(
    _ => {
      setArtist(
        fetchedArtist ? Artist.getArtistForDisplay(fetchedArtist) : defaultState
      );
      if (fetchedArtist) {
        setQnasPicked(getArraySafe(fetchedArtist.qnas));
        setFeaturedImagePicked(fetchedArtist.featuredImage);
        setWithoutMaskImagePicked(fetchedArtist.withoutMaskImage);
        setGalleryPicked(getArraySafe(fetchedArtist.gallery));
        setSoundPicked(fetchedArtist.sound);
        if (fetchedArtist.pageMeta) {
          setPageMeta(fetchedArtist.pageMeta);
        }
      }
      setIsAddMode(!fetchedArtist);
    },
    [fetchedArtist]
  );

  // artistsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(artistsErrors)) {
        setAlerts(
          artistsErrors.map(artistsError => {
            return new Alert(
              Artist.artistsResponseTypes[artistsError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearArtistsErrors();

        if (
          artistsErrors.includes(
            Artist.artistsResponseTypes.ARTIST_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [artistsErrors, setAlerts, clearArtistsErrors]
  );

  /* methods */

  const validInput = useCallback(artistInput => {
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
      setArtist(prevArtist => ({ ...prevArtist, [name]: value }));
    },
    [removeAlerts]
  );

  const onGetQnasPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setQnasPicked(newItemList);
  }, []);

  const onGetFeaturedImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFeaturedImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetWithoutMaskImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setWithoutMaskImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetGalleryPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setGalleryPicked(newItemList);
  }, []);

  const onGetSoundPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setSoundPicked(firstOrDefault(newItemList, null));
  }, []);

  const setPageMetaFunc = useCallback(setterFunc => {
    setIsSubmitEnabled(true);
    setPageMeta(setterFunc);
  }, []);

  const artistDelete = useCallback(
    async _ => {
      const isSuccess = await deleteArtist(artistId);
      if (isSuccess) {
        goToUrl(routes.artistList(true));
        setAlerts(
          new Alert(
            uiWordings['ArtistEdit.DeleteArtistSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        scrollToTop();
      }
    },
    [artistId, deleteArtist, setAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add qnas
      artist.qnas = getArraySafe(qnasPicked).map(
        ({
          question_tc,
          answer_tc,
          question_sc,
          answer_sc,
          question_en,
          answer_en
        }) => ({
          question_tc,
          answer_tc,
          question_sc,
          answer_sc,
          question_en,
          answer_en
        })
      );

      // add featuredImage
      artist.featuredImage = featuredImagePicked
        ? featuredImagePicked._id
        : null;

      // add withoutMaskImage
      artist.withoutMaskImage = withoutMaskImagePicked
        ? withoutMaskImagePicked._id
        : null;

      // add gallery
      artist.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });

      // add sound
      artist.sound = soundPicked ? soundPicked._id : null;

      // add pageMeta
      artist.pageMeta = PageMeta.cleanPageMetaBeforeSubmit(pageMeta);
      let isSuccess = validInput(artist);
      let returnedArtist = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addArtist : updateArtist;
        returnedArtist = await funcToCall(artist);
        isSuccess = Boolean(returnedArtist);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['ArtistEdit.AddArtistSuccessMessage']
              : uiWordings['ArtistEdit.UpdateArtistSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getArtist(returnedArtist._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateArtist,
      addArtist,
      getArtist,
      artist,
      setAlerts,
      removeAlerts,
      validInput,
      qnasPicked,
      featuredImagePicked,
      withoutMaskImagePicked,
      galleryPicked,
      soundPicked,
      pageMeta
    ]
  );

  /* end of event handlers */

  if (artistsLoading) {
    return <Loading />;
  }

  const backToArtistListButton = (
    <GroupContainer>
      <LinkButton to={routes.artistList(true)}>
        {uiWordings['ArtistEdit.BackToArtistList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToArtistListButton}</>;
  }

  return (
    <>
      {backToArtistListButton}

      <Form onSubmit={onSubmit}>
        <div className='w3-row'>
          <div className='w3-col m6'>
            <h4>
              {isAddMode
                ? uiWordings['ArtistEdit.AddArtistTitle']
                : uiWordings['ArtistEdit.EditArtistTitle']}
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
                message={uiWordings['Artist.IsEnabledLabel']}
              />
              <Toggle
                name='isEnabled'
                value={artist.isEnabled}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <LabelInputTextPair
          name='label'
          value={artist.label}
          labelMessage={uiWordings['Artist.LabelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_tc'
          value={artist.name_tc}
          labelMessage={uiWordings['Artist.NameTcLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name_sc'
          value={artist.name_sc}
          labelMessage={uiWordings['Artist.NameScLabel']}
          placeholder=''
          onChange={onChange}
          required={/*true*/ !isAddMode}
        />
        <LabelInputTextPair
          name='name_en'
          value={artist.name_en}
          labelMessage={uiWordings['Artist.NameEnLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />

        <LabelSelectPair
          name='type'
          value={artist.type}
          options={Artist.artistTypeOptions}
          labelMessage={uiWordings['Artist.TypeLabel']}
          onChange={onChange}
        />

        <div className={`${Artist.isArtDirector(artist) ? 'w3-hide' : ''}`}>
          <LabelSelectPair
            name='role'
            value={artist.role}
            options={Artist.artistRoleOptions}
            labelMessage={uiWordings['Artist.RoleLabel']}
            onChange={onChange}
          />
        </div>

        <div className={`${Artist.isArtDirector(artist) ? '' : 'w3-hide'}`}>
          <LabelInputTextPair
            name='directorRemarks_tc'
            value={artist.directorRemarks_tc}
            labelMessage={uiWordings['Artist.DirectorRemarksTcLabel']}
            placeholder=''
            onChange={onChange}
          />
          <LabelInputTextPair
            name='directorRemarks_sc'
            value={artist.directorRemarks_sc}
            labelMessage={uiWordings['Artist.DirectorRemarksScLabel']}
            placeholder=''
            onChange={onChange}
          />
          <LabelInputTextPair
            name='directorRemarks_en'
            value={artist.directorRemarks_en}
            labelMessage={uiWordings['Artist.DirectorRemarksEnLabel']}
            placeholder=''
            onChange={onChange}
          />
        </div>

        <AccordionRegion title={uiWordings['ArtistEdit.MediaRegionTitle']}>
          <FileUpload
            name='featuredImage'
            labelMessage={uiWordings['Artist.FeaturedImageLabel']}
            files={featuredImagePicked ? [featuredImagePicked] : null}
            onGetFiles={onGetFeaturedImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='withoutMaskImage'
            labelMessage={uiWordings['Artist.WithoutMaskImageLabel']}
            files={withoutMaskImagePicked ? [withoutMaskImagePicked] : null}
            onGetFiles={onGetWithoutMaskImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='gallery'
            labelMessage={uiWordings['Artist.GalleryLabel']}
            files={getArraySafe(galleryPicked)}
            onGetFiles={onGetGalleryPicked}
            isMultiple={true}
            mediumType={mediumTypes.IMAGE}
          />
          <FileUpload
            name='sound'
            labelMessage={uiWordings['Artist.SoundLabel']}
            files={soundPicked ? [soundPicked] : null}
            onGetFiles={onGetSoundPicked}
            isMultiple={false}
            mediumType={mediumTypes.AUDIO}
          />
        </AccordionRegion>

        <AccordionRegion
          title={uiWordings['ArtistEdit.DescriptionRegionTitle']}
        >
          <LabelRichTextbox
            name='desc_tc'
            value={artist.desc_tc}
            labelMessage={uiWordings['Artist.DescTcLabel']}
            // placeholder=''
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_sc'
            value={artist.desc_sc}
            labelMessage={uiWordings['Artist.DescScLabel']}
            onChange={onChange}
          />
          <LabelRichTextbox
            name='desc_en'
            value={artist.desc_en}
            labelMessage={uiWordings['Artist.DescEnLabel']}
            onChange={onChange}
          />
        </AccordionRegion>

        <AccordionRegion title={uiWordings['ArtistEdit.QnasRegionTitle']}>
          <ArtistEditQnaSelect
            qnas={qnasPicked}
            onGetQnas={onGetQnasPicked}
            isAddArtistMode={isAddMode}
          />
        </AccordionRegion>

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={artist.createDTDisplay}
              labelMessage={uiWordings['Artist.CreateDTLabel']}
            />
            <LabelLabelPair
              value={artist.lastModifyDTDisplay}
              labelMessage={uiWordings['Artist.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={artist.lastModifyUserDisplay}
              labelMessage={uiWordings['Artist.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['ArtistEdit.AddArtistSubmit']
              : uiWordings['ArtistEdit.UpdateArtistSubmit']
          }
        />
        {!isAddMode && (
          <div className='w3-right'>
            <DeleteWithConfirmButton onConfirmYes={artistDelete}>
              {uiWordings['ArtistEdit.DeleteArtist']}
            </DeleteWithConfirmButton>
          </div>
        )}
      </Form>
    </>
  );
};

const ArtistEditWithContainer = _ => (
  <ArtistsPageContainer>
    <ArtistEdit />
  </ArtistsPageContainer>
);

export default ArtistEditWithContainer;
