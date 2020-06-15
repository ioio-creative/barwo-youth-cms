import React, { useContext, useEffect, useCallback, useState, useMemo } from 'react';
import ArtistContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table';
import LinkButton from 'components/form/LinkButton';
import Form from 'components/form/Form';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import orderBy from 'utils/array/orderBy';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import Artist from 'models/artist';

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: true
  },
  {
    name: uiWordings['Artist.NameTcLabel'],
    value: 'name_tc',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Artist.NameScLabel'],
  //   value: 'name_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Artist.NameEnLabel'],
  //   value: 'name_en',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Artist.DescTcLabel'],
  //   value: 'desc_tc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Artist.DescScLabel'],
  //   value: 'desc_sc',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Artist.DescEnLabel'],
  //   value: 'desc_en',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Artist.TypeLabel'],
    value: 'typeDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Artist.RoleLabel'],
    value: 'roleDisplay',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Artist.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Artist.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Artist.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Artist.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const ArtistTable = ({artists, paginationMeta, onEditClick, onPageClick}) => {
  const rows = addIdx(artists.map(Artist.getArtistForDisplay));

  const [sortParams, setSortParams] = useState({
    sortBy: 'idx',
    sortOrder: 'asc'
  });

  /* methods */

  const changeSort = useMemo(_ => Table.helperGenerators.changeSort(setSortParams), [setSortParams]);

  /* end of methods */

  /* event handlers */

  const onChangeSort = useMemo(_ => Table.helperGenerators.onChangeSort(changeSort), [changeSort]);

  const onDetailClick = useMemo(_ => Table.helperGenerators.onDetailClick(onEditClick), [onEditClick]);
  
  /* end of event handler */

  const sortedRows = orderBy(rows, [sortParams.sortBy], [sortParams.sortOrder]);

  return (
    <Table
      headers={headers}
      rows={sortedRows}
      paginationMeta={paginationMeta}
      sortBy={sortParams.sortBy}
      sortOrder={sortParams.sortOrder}
      onDetailClick={onDetailClick}
      onChangeSort={onChangeSort}
      onPageClick={onPageClick}
    />
  );
};

const ArtistList = _ => {
  const { artists, artistsPaginationMeta, artistsLoading, getArtists } = useContext(
    ArtistContext
  );

  // componentDidMount
  useEffect(
    _ => {
      getArtists();
    },
    // eslint-disable-next-line
    []
  );

  /* event handlers */

  const onEditArtist = useCallback(artist => {
    goToUrl(routes.artistEditByIdWithValue(true, artist._id));
  }, []);

  const onPageClick = useCallback(pageNum => {
    getArtists({
      page: pageNum
    });
  });

  /* end of event handlers */

  if (artists === null || artistsLoading) {
    return (
      <div className='loading-container'>
        <Loading />
      </div>
    );
  }

  const addArtistButton = (
    <LinkButton to={routes.artistAdd(true)}>
      {uiWordings['ArtistList.AddArtist']}
    </LinkButton>
  );

  if (!isNonEmptyArray(artists)) {
    return (
      <>
        <h4>{uiWordings['ArtistList.AddArtistPrompt']}</h4>
        {addArtistButton}
      </>
    );
  }

  return (
    <>
      <Form className='w3-half w3-padding'>
        {addArtistButton}
      </Form>
      <ArtistTable artists={artists} paginationMeta={artistsPaginationMeta} onEditClick={onEditArtist} onPageClick={onPageClick} />
    </>
  );
};

const ArtistListWithContainer = _ => (
  <ArtistsPageContainer>
    <ArtistList />
  </ArtistsPageContainer>
);

export default ArtistListWithContainer;
