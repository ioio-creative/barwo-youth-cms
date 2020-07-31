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

const ArtistsOrder = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artistsErrors,
    clearArtistsErrors,
    eventArtists: fetchedArtists,
    eventArtistsLoading: fetchedArtistsLoading,
    getEventArtistsInOrder,
    clearEventArtists,
    orderEventArtists
  } = useContext(ArtistsContext);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // artists
  const [artistsPicked, setArtistsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getEventArtistsInOrder();
    return _ => {
      clearEventArtists();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedArtists
  useEffect(
    _ => {
      if (isNonEmptyArray(fetchedArtists)) {
        setArtistsPicked(fetchedArtists);
      }
    },
    [fetchedArtists]
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

  const onGetArtistsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setArtistsPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      const artistsToSubmit = getArraySafe(artistsPicked).map(artist => ({
        _id: artist._id
      }));

      const isSuccess = await orderEventArtists(artistsToSubmit);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['ArtistsOrder.OrderArtistsSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      }

      scrollToTop();
    },
    [setAlerts, removeAlerts, orderEventArtists, artistsPicked]
  );

  /* end of event handlers */

  if (fetchedArtistsLoading) {
    return <Loading />;
  }

  return (
    <>
      <GroupContainer>
        <LinkButton to={routes.artistList(true)}>
          {uiWordings['ArtistsOrder.BackToArtistList']}
        </LinkButton>
      </GroupContainer>

      <Form onSubmit={onSubmit}>
        <h4 className='w3-show-inline-block w3-margin-right'>
          {uiWordings['ArtistsOrder.Title']}
        </h4>

        <SubmitButton
          disabled={!isSubmitEnabled}
          label={uiWordings['ArtistsOrder.Submit']}
        />

        <Ordering
          items={artistsPicked}
          onGetItems={onGetArtistsPicked}
          listWidth={300}
        />
      </Form>
    </>
  );
};

const ArtistsOrderWithContainer = _ => (
  <ArtistsPageContainer>
    <ArtistsOrder />
  </ArtistsPageContainer>
);

export default ArtistsOrderWithContainer;
