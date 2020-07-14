import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import ContactsContext from 'contexts/contacts/contactsContext';
import ContactsPageContainer from 'components/contacts/ContactsPageContainer';
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
import Contact from 'models/contact';
import Alert from 'models/alert';

const defaultInitialSortBy = 'name';
const defaultInitialSortOrder = 1;

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: false
  },
  {
    name: uiWordings['Contact.EmailAddressLabel'],
    value: 'emailAddress',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.NameLabel'],
    value: 'name',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.TypeLabel'],
    value: 'typeDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.LanguageLabel'],
    value: 'languageDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['Contact.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const ContactList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    contacts,
    contactsPaginationMeta,
    contactsLoading,
    contactsErrors,
    clearContactsErrors,
    getContacts
  } = useContext(ContactsContext);
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
    Contact.cleanSortByString
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

  // set query string and getContacts
  useEffect(
    _ => {
      getContacts(prepareGetOptionsForPaginationAndSort());
    },
    [prepareGetOptionsForPaginationAndSort, getContacts]
  );

  // filter and getContacts
  useEffect(
    _ => {
      if (isUseFilter) {
        const getOptions = {
          ...prepareGetOptionsForPaginationAndSort(),
          ...prepareGetOptionsForFilter()
        };
        getContacts(getOptions);
        setIsUseFilter(false);
      }
    },
    [
      isUseFilter,
      setIsUseFilter,
      prepareGetOptionsForPaginationAndSort,
      prepareGetOptionsForFilter,
      getContacts
    ]
  );

  // contactsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(contactsErrors)) {
        setAlerts(
          contactsErrors.map(contactsError => {
            return new Alert(
              Contact.contactResponseTypes[contactsError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearContactsErrors();
      }
    },
    [contactsErrors, setAlerts, clearContactsErrors]
  );

  /* event handlers */

  const onEdit = useCallback(contact => {
    goToUrl(routes.contactEditByIdWithValue(true, contact._id));
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
      return addIdx(getArraySafe(contacts).map(Contact.getContactForDisplay));
    },
    [contacts]
  );

  if (contacts === null || contactsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={turnOnFilter}>
        <div className='w3-quarter'>
          <InputText
            name='filterText'
            className='w3-section'
            placeholder={uiWordings['ContactList.FilterTextPlaceHolder']}
            onChange={onFilterChange}
            value={filterText}
          />
        </div>
        <div className='w3-show-inline-block'>
          <div className='w3-bar'>
            <Button className='w3-margin-left' onClick={turnOnFilter}>
              {uiWordings['ContactList.FilterButton']}
            </Button>
            <Button className='w3-margin-left' onClick={turnOffFilter}>
              {uiWordings['ContactList.ClearFilterButton']}
            </Button>
          </div>
        </div>
        <div className='w3-right'>
          <LinkButton to={routes.contactAdd(true)}>
            {uiWordings['ContactList.AddContact']}
          </LinkButton>
        </div>
      </Form>
      <Table
        headers={headers}
        rows={rows}
        paginationMeta={contactsPaginationMeta}
        sortBy={currSortParams.sortBy}
        sortOrder={currSortParams.sortOrder}
        onDetailClick={onEdit}
        onPageClick={onSetPage}
        setSortParamsFunc={onSetSortParams}
      />
    </>
  );
};

const ContactListWithContainer = _ => (
  <ContactsPageContainer>
    <ContactList />
  </ContactsPageContainer>
);

export default ContactListWithContainer;
