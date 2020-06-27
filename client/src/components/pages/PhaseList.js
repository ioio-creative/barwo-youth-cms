import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import PhasesContext from 'contexts/phases/phasesContext';
import PhasesPageContainer from 'components/phases/PhasesPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import useFilterForTable from 'components/layout/Table/useFilterForTable';
import LinkButton from 'components/form/LinkButton';
import Button from 'components/form/Button';
import InputText from 'components/form/InputText';
import Form from 'components/form/Form';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import Phase from 'models/phase';
import Alert from 'models/alert';

const defaultInitialSortBy = 'derivedLabel';
const defaultInitialSortOrder = 1;

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
  },
  {
    name: uiWordings['Phase.DerivedLabelLabel'],
    value: 'derivedLabel',
    isSortEnabled: true
  },
  {
    name: uiWordings['Phase.YearLabel'],
    value: 'yearDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Phase.PhaseNumberLabel'],
    value: 'phaseNumber',
    isSortEnabled: true
  },
  {
    name: uiWordings['Phase.EventsLabel'],
    value: 'eventsDisplay',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['Phase.CreateDTLabel'],
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Phase.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Phase.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Phase.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const PhaseList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    phases,
    phasesPaginationMeta,
    phasesLoading,
    phasesErrors,
    clearPhasesErrors,
    getPhases
  } = useContext(PhasesContext);
  const {
    // qsPage: { qsPage, setQsPage },
    // qsSortOrder: { qsSortOrder, setQsSortOrder },
    // qsSortBy: { qsSortBy, setQsSortBy },
    // currPage: { currPage, setCurrPage },
    currSortParams: { currSortParams /*, setCurrSortParams*/ },
    prepareGetOptions: prepareGetOptionsForPaginationAndSort,
    onSetPage,
    onSetSortParams
  } = usePaginationAndSortForTable(
    defaultInitialSortBy,
    defaultInitialSortOrder,
    Phase.cleanSortByString
  );
  const {
    isUseFilter,
    setIsUseFilter,
    prepareGetOptions: prepareGetOptionsForFilter,
    filterText,
    setFilterText,
    turnOnFilter,
    turnOffFilter
  } = useFilterForTable();

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

  // set query string and getPhases
  useEffect(
    _ => {
      getPhases(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getPhases]
  );

  // filter and getPhases
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getPhases(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getPhases
    ]
  );

  // phasesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(phasesErrors)) {
        setAlerts(
          phasesErrors.map(phasesError => {
            return new Alert(
              Phase.phasesResponseTypes[phasesError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearPhasesErrors();
      }
    },
    [phasesErrors, setAlerts, clearPhasesErrors]
  );

  /* event handlers */

  const onEdit = useCallback(phase => {
    goToUrl(routes.phaseEditByIdWithValue(true, phase._id));
  }, []);

  const onFilterChange = useCallback(
    e => {
      setFilterText(e.target.value);
    },
    [setFilterText]
  );

  /* end of event handlers */

  const rows = useMemo(
    _ => {
      return addIdx(getArraySafe(phases).map(Phase.getPhaseForDisplay));
    },
    [phases]
  );

  if (phases === null || phasesLoading) {
    return <Loading />;
  }

  const addButton = (
    <LinkButton to={routes.phaseAdd(true)}>
      {uiWordings['PhaseList.AddPhase']}
    </LinkButton>
  );

  return (
    <>
      <Form>
        <div className='w3-half'>
          <div className='w3-half'>
            <InputText
              name='text'
              className='w3-section'
              placeholder={uiWordings['PhaseList.FilterTextPlaceHolder']}
              onChange={onFilterChange}
              value={filterText}
            />
          </div>
          <div className='w3-half w3-container'>
            <div className='w3-half'>
              <Button onClick={turnOnFilter}>
                {uiWordings['PhaseList.FilterButton']}
              </Button>
            </div>
            <div className='w3-half'>
              <Button onClick={turnOffFilter}>
                {uiWordings['PhaseList.ClearFilterButton']}
              </Button>
            </div>
          </div>
        </div>
        <div className='w3-right'>{addButton}</div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={phasesPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const PhaseListWithContainer = _ => (
  <PhasesPageContainer>
    <PhaseList />
  </PhasesPageContainer>
);

export default PhaseListWithContainer;