import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import AlertContext from 'contexts/alert/alertContext';
import ArtistContext from 'contexts/artists/artistsContext';
import ArtistsPageContainer from 'components/artists/ArtistsPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table';
import LinkButton from 'components/form/LinkButton';
import Button from 'components/form/Button';
import Form from 'components/form/Form';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import Artist from 'models/artist';
import Alert from 'models/alert';
import InputText from '@buffetjs/styles/dist/components/InputText';

const initialSortBy = 'lastModifyDTDisplay';
const initialSortOrder = -1;

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

const ArtistTable = ({
  artists,
  paginationMeta,
  onEditClick,
  onPageClick,
  onSortParamsChanged
}) => {
  const rows = addIdx(artists.map(Artist.getArtistForDisplay));

  const [sortParams, setSortParams] = useState({
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });

  useEffect(
    _ => {
      onSortParamsChanged(sortParams);
    },
    [onSortParamsChanged, sortParams]
  );

  return (
    <Table
      headers={headers}
      rows={rows}
      paginationMeta={paginationMeta}
      sortBy={sortParams.sortBy}
      sortOrder={sortParams.sortOrder}
      onDetailClick={onEditClick}
      onPageClick={onPageClick}
      setSortParamsFunc={setSortParams}
    />
  );
};

ArtistTable.defaultProps = {
  onSortParamsChanged: sortParams => {
    console.log(sortParams);
  }
};

const ArtistList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    artists,
    artistsPaginationMeta,
    artistsLoading,
    artistsErrors,
    clearArtistsErrors,
    getArtists
  } = useContext(ArtistContext);

  // query strings
  const [qsPage, setQsPage] = useQueryParam('page', NumberParam);
  const [qsSortOrder, setQsSortOrder] = useQueryParam('sortOrder', NumberParam);
  const [qsSortBy, setQsSortBy] = useQueryParam('sortBy', StringParam);
  const [qsFilterText, setQsFilterText] = useQueryParam(
    'filterText',
    StringParam
  );

  // states
  const [currPage, setCurrPage] = useState(qsPage);
  const [currSortParams, setCurrSortParams] = useState({
    qsSortOrder,
    qsSortBy
  });
  const [isUseFilter, setIsUseFilter] = useState(false);
  const [filter, setFilter] = useState({ text: qsFilterText });

  /* methods */

  const prepareGetArtistsOptions = useCallback(
    _ => {
      const getArtistsOptions = {
        page: currPage || 1
      };

      setQsPage(currPage);

      if (currSortParams) {
        const currSortOrder = currSortParams.sortOrder || 1;
        const currSortBy = Artist.cleanSortByString(
          currSortParams.sortBy || initialSortBy
        );
        setQsSortOrder(currSortOrder);
        setQsSortBy(currSortBy);
        getArtistsOptions.sortOrder = currSortOrder;
        getArtistsOptions.sortBy = currSortBy;
      }

      return getArtistsOptions;
    },
    [
      getArtists,
      currPage,
      currSortParams,
      setQsPage,
      setQsSortOrder,
      setQsSortBy
    ]
  );

  /* end of methods */

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
      const getArtistsOptions = prepareGetArtistsOptions();
      getArtists(getArtistsOptions);
    },
    [prepareGetArtistsOptions, getArtists]
  );

  // filter and getArtists
  useEffect(
    _ => {
      if (isUseFilter) {
        const getArtistsOptions = prepareGetArtistsOptions();
        // allow empty string here
        if (![null, undefined].includes(filter.text)) {
          setQsFilterText(filter.text);
          getArtistsOptions.filterText = filter.text;
        }
        getArtists(getArtistsOptions);
        setIsUseFilter(false);
      }
    },
    [setQsFilterText, isUseFilter, setIsUseFilter, prepareGetArtistsOptions]
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

  const onPageClick = useCallback(
    pageNum => {
      setCurrPage(pageNum);
    },
    [setCurrPage]
  );

  const onSortParamsChanged = useCallback(
    sortParams => {
      setCurrSortParams(sortParams);

      // sort from page 1
      setCurrPage(1);
    },
    [setCurrSortParams]
  );

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

  return (
    <>
      <Form>
        <div className='w3-half'>
          <div className='w3-half'>
            <InputText
              name='text'
              className='w3-section w3-white'
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
      <ArtistTable
        artists={artists}
        paginationMeta={artistsPaginationMeta}
        onEditClick={onEditArtist}
        onPageClick={onPageClick}
        onSortParamsChanged={onSortParamsChanged}
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
