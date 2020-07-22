import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import Ordering from 'components/form/Ordering';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Artist from 'models/artist';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const ArtDirectorsOrder = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artistsErrors,
    clearArtistsErrors,
    artDirectors: fetchedArtDirectors,
    artDirectorsLoading: fetchedArtDirectorsLoading,
    getArtDirectors,
    clearArtDirectors,
    orderArtDirectors
  } = useContext(ArtistsContext);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // art directors
  const [artDirectorsPicked, setArtDirectorsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getArtDirectors();
    return _ => {
      clearArtDirectors();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedArtDirectors
  useEffect(
    _ => {
      if (isNonEmptyArray(fetchedArtDirectors)) {
        setArtDirectorsPicked(fetchedArtDirectors);
      }
    },
    [fetchedArtDirectors]
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
      }
    },
    [artistsErrors, setAlerts, clearArtistsErrors]
  );

  /* event handlers */

  const onGetArtDirectorsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setArtDirectorsPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      const artDirectorsToSubmit = getArraySafe(artDirectorsPicked).map(
        artDirector => ({
          _id: artDirector._id
        })
      );

      const isSuccess = await orderArtDirectors(artDirectorsToSubmit);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['ArtDirectorsOrder.OrderArtDirectorsSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      }

      scrollToTop();
    },
    [setAlerts, removeAlerts, orderArtDirectors, artDirectorsPicked]
  );

  /* end of event handlers */

  if (fetchedArtDirectorsLoading) {
    return <Loading />;
  }

  return (
    <>
      <GroupContainer>
        <LinkButton to={routes.artistList(true)}>
          {uiWordings['ArtDirectorsOrder.BackToArtistList']}
        </LinkButton>
      </GroupContainer>

      <Form onSubmit={onSubmit}>
        <h4 className='w3-show-inline-block w3-margin-right'>
          {uiWordings['ArtDirectorsOrder.Title']}
        </h4>

        <SubmitButton
          disabled={!isSubmitEnabled}
          label={uiWordings['ArtDirectorsOrder.Submit']}
        />

        <Ordering
          items={artDirectorsPicked}
          onGetItems={onGetArtDirectorsPicked}
        />
      </Form>
    </>
  );
};

const ArtDirectorsOrderWithContainer = _ => (
  <ArtistsPageContainer>
    <ArtDirectorsOrder />
  </ArtistsPageContainer>
);

export default ArtDirectorsOrderWithContainer;
