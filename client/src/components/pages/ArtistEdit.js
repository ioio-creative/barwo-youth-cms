import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Artist from 'models/artist';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
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
  const [isAddArtistMode, setIsAddArtistMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

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
        setIsAddArtistMode(!fetchedArtist);
      }
    },
    [artistsLoading, fetchedArtist, setArtist]
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
      setArtist({ ...artist, [e.target.name]: e.target.value });
    },
    [artist, setArtist, removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      e.preventDefault();
      let isSuccess = validInput();
      let returnedArtist = null;
      if (isSuccess) {
        const funcToCall = isAddArtistMode ? addArtist : updateArtist;
        returnedArtist = await funcToCall(artist);
        isSuccess = Boolean(returnedArtist);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddArtistMode
              ? uiWordings['ArtistEdit.AddArtistSuccessMessage']
              : uiWordings['ArtistEdit.UpdateArtistSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
        goToUrl(routes.artistEditByIdWithValue(true, returnedArtist._id));
      }

      scrollToTop();
    },
    [isAddArtistMode, updateArtist, addArtist, artist, setAlerts, validInput]
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
          {isAddArtistMode
            ? uiWordings['ArtistEdit.AddArtistTitle']
            : uiWordings['ArtistEdit.EditArtistTitle']}
        </h4>

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
        <LabelRichTextbox
          name='desc_tc'
          value={artist.desc_tc}
          labelMessage={uiWordings['Artist.DescTcLabel']}
          // placeholder=''
          onChange={onChange}
          className={'w3-half'}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_sc'
          value={artist.desc_sc}
          labelMessage={uiWordings['Artist.DescScLabel']}
          // placeholder=''
          onChange={onChange}
          className={'w3-half'}
          filebrowserBrowseUrl={routes.fileManager}
        />
        <LabelRichTextbox
          name='desc_en'
          value={artist.desc_en}
          labelMessage={uiWordings['Artist.DescEnLabel']}
          // placeholder=''
          onChange={onChange}
          className={'w3-half'}
          filebrowserBrowseUrl={routes.fileManager}
        />

        <LabelSelectPair
          name='type'
          value={artist.type}
          options={Artist.artistTypeOptions}
          labelMessage={uiWordings['Artist.TypeLabel']}
          onChange={onChange}
        />
        <LabelSelectPair
          name='role'
          value={artist.role}
          options={Artist.artistRoleOptions}
          labelMessage={uiWordings['Artist.RoleLabel']}
          onChange={onChange}
        />

        <LabelTogglePair
          name='isEnabled'
          value={artist.isEnabled}
          labelMessage={uiWordings['Artist.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddArtistMode && (
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
            isAddArtistMode
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
