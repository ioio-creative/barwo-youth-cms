import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import AlertContext from 'contexts/alert/alertContext';
import ContactsContext from 'contexts/contacts/contactsContext';
import ContactsPageContainer from 'components/contacts/ContactsPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import usePaginationAndSortForTable from 'components/layout/Table/usePaginationAndSortForTable';
import useFilterForTable from 'components/layout/Table/useFilterForTable';
import Button from 'components/form/Button';
import LinkButton from 'components/form/LinkButton';
import FileUploadButton from 'components/form/FileUploadButton';
import InputText from 'components/form/InputText';
import Form from 'components/form/Form';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import download from 'utils/download';
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
  // {
  //   name: uiWordings['Contact.NameLabel'],
  //   value: 'name',
  //   isSortEnabled: true
  // },
  // {
  //   name: uiWordings['Contact.TypeLabel'],
  //   value: 'typeDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['Contact.GroupsLabel'],
    value: 'groupsDisplay',
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
    contactsExportLoading,
    contactsErrors,
    clearContactsErrors,
    getContacts,
    exportContacts,
    importContacts
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

  // filter and getContacts
  const lastFilterText = useRef(filterText);
  useEffect(
    _ => {
      let getOptions = {};

      if (isUseFilter || filterText) {
        getOptions = {
          ...getOptions,
          ...prepareGetOptionsForFilter()
        };
        setIsUseFilter(false);
      }

      // useEffect caused by pagination and sort
      if (lastFilterText.current === filterText) {
        getOptions = {
          ...getOptions,
          ...prepareGetOptionsForPaginationAndSort()
        };

        getContacts(getOptions);
      }

      lastFilterText.current = filterText;
    },
    [
      filterText,
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

  const onExport = useCallback(
    async _ => {
      const contactsExport = await exportContacts();
      if (contactsExport) {
        download(
          contactsExport.data,
          contactsExport.fileName,
          contactsExport.mimeType
        );
      }
    },
    [exportContacts]
  );

  const onImport = useCallback(
    async files => {
      if (!isNonEmptyArray(files)) {
        return;
      }
      const isSuccess = await importContacts(files[0]);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['ContactList.ImportSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getContacts();
      }
    },
    [importContacts, setAlerts, getContacts]
  );

  /* end of event handlers */

  const rows = useMemo(
    _ => {
      return addIdx(getArraySafe(contacts).map(Contact.getContactForDisplay));
    },
    [contacts]
  );

  if (contacts === null || contactsLoading || contactsExportLoading) {
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
        <div className='w3-right w3-margin-left'>
          <LinkButton to={routes.contactAdd(true)}>
            {uiWordings['ContactList.AddContact']}
          </LinkButton>
        </div>
        <div className='w3-right w3-margin-left'>
          <FileUploadButton
            label={uiWordings['ContactList.ImportButton']}
            onFilesChange={onImport}
          />
        </div>
        <div className='w3-right'>
          <Button className='' onClick={onExport}>
            {uiWordings['ContactList.ExportButton']}
          </Button>
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
