import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import ArtistEditQnaSelect from 'components/artists/ArtistEditQnaSelect';
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
import Artist from 'models/artist';
import Medium from 'models/medium';
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
    clearArtistsErrors
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
      if (!artistsLoading) {
        setArtist(
          fetchedArtist
            ? Artist.getArtistForDisplay(fetchedArtist)
            : defaultState
        );
        if (fetchedArtist) {
          setQnasPicked(getArraySafe(fetchedArtist.qnas));
          setFeaturedImagePicked(fetchedArtist.featuredImage);
          setWithoutMaskImagePicked(fetchedArtist.withoutMaskImage);
          setGalleryPicked(getArraySafe(fetchedArtist.gallery));
          setSoundPicked(fetchedArtist.sound);
        }
        setIsAddMode(!fetchedArtist);
      }
    },
    [
      artistsLoading,
      fetchedArtist,
      setArtist,
      setIsAddMode,
      setQnasPicked,
      setFeaturedImagePicked,
      setWithoutMaskImagePicked,
      setGalleryPicked,
      setSoundPicked
    ]
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
    [artistsErrors, setAlerts, clearArtistsErrors, setIsAbandonEdit]
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
      setArtist({ ...artist, [e.target.name]: e.target.value });
    },
    [artist, setArtist, removeAlerts]
  );

  const onGetQnasPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setQnasPicked(newItemList);
    },
    [setQnasPicked, setIsSubmitEnabled]
  );

  const onGetFeaturedImagePicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setFeaturedImagePicked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setFeaturedImagePicked]
  );

  const onGetWithoutMaskImagePicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setWithoutMaskImagePicked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setWithoutMaskImagePicked]
  );

  const onGetGalleryPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setGalleryPicked(newItemList);
    },
    [setIsSubmitEnabled, setGalleryPicked]
  );

  const onGetSoundPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setSoundPicked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setSoundPicked]
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

        goToUrl(routes.artistEditByIdWithValue(true, returnedArtist._id));
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

  /* derived values */

  /* end of derived values */

  if (artistsLoading) {
    return <Loading />;
  }

  const backToArtistListButton = (
    <Form>
      <LinkButton to={routes.artistList(true)}>
        {uiWordings['ArtistEdit.BackToArtistList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToArtistListButton}</>;
  }

  return (
    <>
      {backToArtistListButton}

      <Form onSubmit={onSubmit}>
        <h4>
          {isAddMode
            ? uiWordings['ArtistEdit.AddArtistTitle']
            : uiWordings['ArtistEdit.EditArtistTitle']}
        </h4>
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
          required={true}
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
          name='role'
          value={artist.role}
          options={Artist.artistRoleOptions}
          labelMessage={uiWordings['Artist.RoleLabel']}
          onChange={onChange}
        />
        <LabelSelectPair
          name='type'
          value={artist.type}
          options={Artist.artistTypeOptions}
          labelMessage={uiWordings['Artist.TypeLabel']}
          onChange={onChange}
        />

        <div className='w3-card w3-container'>
          <h4>{uiWordings['ArtistEdit.Media.Title']}</h4>
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
        </div>

        <LabelRichTextbox
          name='desc_tc'
          value={artist.desc_tc}
          labelMessage={uiWordings['Artist.DescTcLabel']}
          // placeholder=''
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_sc'
          value={artist.desc_sc}
          labelMessage={uiWordings['Artist.DescScLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_en'
          value={artist.desc_en}
          labelMessage={uiWordings['Artist.DescEnLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={routes.fileManager}
        />

        <ArtistEditQnaSelect qnas={qnasPicked} onGetQnas={onGetQnasPicked} />

        <LabelTogglePair
          name='isEnabled'
          value={artist.isEnabled}
          labelMessage={uiWordings['Artist.IsEnabledLabel']}
          onChange={onChange}
        />

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
