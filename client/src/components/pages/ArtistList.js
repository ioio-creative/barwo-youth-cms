import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import AlertContext from 'contexts/alert/alertContext';
import ArtistsContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import LinkButton from 'components/form/LinkButton';
import Button from 'components/form/Button';
import InputText from 'components/form/InputText';
import Form from 'components/form/Form';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import Artist from 'models/artist';
import Alert from 'models/alert';

const defaultInitialSortBy = 'lastModifyDTDisplay';
const defaultInitialSortOrder = -1;

const emptyFilter = {
  text: ''
};

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
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

const ArtistList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artists,
    artistsPaginationMeta,
    artistsLoading,
    artistsErrors,
    clearArtistsErrors,
    getArtists
  } = useContext(ArtistsContext);
  const {
    // qsPage: { qsPage, setQsPage },
    // qsSortOrder: { qsSortOrder, setQsSortOrder },
    // qsSortBy: { qsSortBy, setQsSortBy },
    // currPage: { currPage, setCurrPage },
    currSortParams: { currSortParams /*, setCurrSortParams*/ },
    prepareGetOptions,
    onSetPage,
    onSetSortParams
  } = usePaginationAndSortForTable(
    defaultInitialSortBy,
    defaultInitialSortOrder,
    Artist.cleanSortByString
  );

  // query strings
  const [qsFilterText, setQsFilterText] = useQueryParam(
    'filterText',
    StringParam
  );

  // states
  const [isUseFilter, setIsUseFilter] = useState(true); // allow first time filter by query string value
  const [filter, setFilter] = useState({ text: qsFilterText });

  // componentDidMount
  useEffect(
    _ => {
      return _ => {
        removeAlerts();
      };
    },
    // eslint-disable-next-line
    []
  );

  // set query string and getArtists
  useEffect(
    _ => {
      getArtists(prepareGetOptions());
    },
    [prepareGetOptions, getArtists]
  );

  // filter and getArtists
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = prepareGetOptions();
        // allow empty string here
        if (![null, undefined].includes(filter.text)) {
          setQsFilterText(filter.text);
          getOptions.filterText = filter.text;
        }
        getArtists(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      setQsFilterText,
      isUseFilter,
      setIsUseFilter,
      prepareGetOptions,
      getArtists,
      filter.text
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
      }
    },
    [artistsErrors, setAlerts, clearArtistsErrors]
  );

  /* event handlers */

  const onEditArtist = useCallback(artist => {
    goToUrl(routes.artistEditByIdWithValue(true, artist._id));
  }, []);

  const onFilterChange = useCallback(
    e => {
      setFilter({
        ...filter,
        [e.target.name]: e.target.value
      });
    },
    [filter, setFilter]
  );

  const onFilter = useCallback(
    _ => {
      setIsUseFilter(true);
    },
    [setIsUseFilter]
  );

  const onClearFilter = useCallback(_ => {
    setFilter(emptyFilter);
    setIsUseFilter(true);
  }, []);

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

  const rows = addIdx(artists.map(Artist.getArtistForDisplay));

  return (
    <>
      <Form>
        <div className='w3-half'>
          <div className='w3-half'>
            <InputText
              name='text'
              className='w3-section'
              placeholder={uiWordings['ArtistList.FilterTextPlaceHolder']}
              onChange={onFilterChange}
              value={filter.text}
            />
          </div>
          <div className='w3-half w3-container'>
            <div className='w3-half'>
              <Button onClick={onFilter}>
                {uiWordings['ArtistList.FilterButton']}
              </Button>
            </div>
            <div className='w3-half'>
              <Button onClick={onClearFilter}>
                {uiWordings['ArtistList.ClearFilterButton']}
              </Button>
            </div>
          </div>
        </div>
        <div className='w3-right'>{addArtistButton}</div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={artistsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEditArtist}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const ArtistListWithContainer = _ => (
  <ArtistsPageContainer>
    <ArtistList />
  </ArtistsPageContainer>
);

export default ArtistListWithContainer;
