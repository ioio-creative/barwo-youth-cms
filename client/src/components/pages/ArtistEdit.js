import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import ArtistEditQnaSelect from 'components/artists/ArtistEditQnaSelect';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Artist from 'models/artist';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyArtist = new Artist();
const defaultState = emptyArtist;

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
          if (isNonEmptyArray(fetchedArtist.qnas)) {
            setQnasPicked(fetchedArtist.qnas);
          }
        }
        setIsAddMode(!fetchedArtist);
      }
    },
    [artistsLoading, fetchedArtist, setArtist, setIsAddMode, setQnasPicked]
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
        getArtist(artistId);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateArtist,
      addArtist,
      getArtist,
      artistId,
      artist,
      setAlerts,
      validInput,
      qnasPicked,
      removeAlerts
    ]
  );

  /* end of event handlers */

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
        <LabelInputTextPair
          name='featuredImage'
          value={artist.featuredImage}
          labelMessage={uiWordings['Artist.FeaturedImageLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        />
        <LabelInputTextPair
          name='withoutMaskImage'
          value={artist.withoutMaskImage}
          labelMessage={uiWordings['Artist.WithoutMaskImageLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        />
        <LabelInputTextPair
          name='gallery'
          value={artist.gallery}
          labelMessage={uiWordings['Artist.GalleryLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        />
        <LabelInputTextPair
          name='sound'
          value={artist.sound}
          labelMessage={uiWordings['Artist.SoundLabel']}
          placeholder=''
          onChange={onChange}
          required={false}
        />
        <LabelRichTextbox
          name='desc_tc'
          value={artist.desc_tc}
          labelMessage={uiWordings['Artist.DescTcLabel']}
          // placeholder=''
          onChange={onChange}
          filebrowserBrowseUrl={generatePath(routes.fileManager, {
            fileType: 'images'
          })}
        />
        <LabelRichTextbox
          name='desc_sc'
          value={artist.desc_sc}
          labelMessage={uiWordings['Artist.DescScLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={generatePath(routes.fileManager, {
            fileType: 'images'
          })}
        />
        <LabelRichTextbox
          name='desc_en'
          value={artist.desc_en}
          labelMessage={uiWordings['Artist.DescEnLabel']}
          onChange={onChange}
          filebrowserBrowseUrl={generatePath(routes.fileManager, {
            fileType: 'images'
          })}
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
