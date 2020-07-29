import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AlertContext from 'contexts/alert/alertContext';
import ContactsContext from 'contexts/contacts/contactsContext';
import ContactsPageContainer from 'components/contacts/ContactsPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Button from 'components/form/Button';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import LabelSelectPair from 'components/form/LabelSelectPair';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Contact from 'models/contact';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyContact = new Contact();
const defaultState = emptyContact;

const ContactEdit = _ => {
  const { contactId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    contact: fetchedContact,
    contactsErrors,
    contactsLoading,
    getContact,
    clearContact,
    addContact,
    updateContact,
    clearContactsErrors,
    deleteContact
  } = useContext(ContactsContext);

  const [contact, setContact] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // ContactId
  useEffect(
    _ => {
      if (contactId) {
        getContact(contactId);
      }

      return _ => {
        clearContact();
      };
    },
    [contactId, getContact, clearContact]
  );

  // fetchedContact
  useEffect(
    _ => {
      setContact(
        fetchedContact
          ? Contact.getContactForDisplay(fetchedContact)
          : defaultState
      );
      setIsAddMode(!fetchedContact);
    },
    [fetchedContact]
  );

  // contactsErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(contactsErrors)) {
        setAlerts(
          contactsErrors.map(ContactsError => {
            return new Alert(
              Contact.contactResponseTypes[ContactsError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearContactsErrors();

        if (
          contactsErrors.includes(
            Contact.contactResponseTypes.CONTACT_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [contactsErrors, setAlerts, clearContactsErrors]
  );

  /* methods */

  const validInput = useCallback(contactInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setContact(prevContact => ({ ...prevContact, [name]: value }));
    },
    [removeAlerts]
  );

  const contactDelete = useCallback(
    async contact => {
      // console.log(contact);
      const isSuccess = await deleteContact(contact);
      if (isSuccess) {
        goToUrl(routes.contactList(true));
        setAlerts(
          new Alert(
            uiWordings['ContactEdit.DeleteContactSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
      } else {
        goToUrl(routes.contactEditByIdWithValue(true, contact._id));
        getContact(contact._id);
        scrollToTop();
      }
    },
    [deleteContact, setAlerts, getContact]
  );

  const onDeleteButtonClick = useCallback(
    _ => {
      console.log(contact);
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to delete?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => contactDelete(contact)
          },
          {
            label: 'No',
            onClick: () => removeAlerts()
          }
        ]
      });
    },
    [contact, contactDelete, removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = validInput(contact);
      let returnedContact = null;
      if (isSuccess) {
        const funcToCall = isAddMode ? addContact : updateContact;
        // console.log('debug');
        returnedContact = await funcToCall(contact);
        // console.log(returnedContact);
        isSuccess = Boolean(returnedContact);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['ContactEdit.AddContactSuccessMessage']
              : uiWordings['ContactEdit.UpdateContactSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        goToUrl(routes.contactEditByIdWithValue(true, returnedContact._id));
        getContact(returnedContact._id);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateContact,
      addContact,
      getContact,
      contact,
      setAlerts,
      removeAlerts,
      validInput
    ]
  );

  /* end of event handlers */

  if (contactsLoading) {
    return <Loading />;
  }

  const backToContactListButton = (
    <GroupContainer>
      <LinkButton to={routes.contactList(true)}>
        {uiWordings['ContactEdit.BackToContactList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToContactListButton}</>;
  }

  return (
    <>
      {backToContactListButton}

      <Form onSubmit={onSubmit}>
        <h4>
          {isAddMode
            ? uiWordings['ContactEdit.AddContactTitle']
            : uiWordings['ContactEdit.EditContactTitle']}
        </h4>
        <LabelInputTextPair
          inputType='email'
          name='emailAddress'
          value={contact.emailAddress}
          labelMessage={uiWordings['Contact.EmailAddressLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name'
          value={contact.name}
          labelMessage={uiWordings['Contact.NameLabel']}
          placeholder=''
          onChange={onChange}
          // required={true}
        />
        {/* <LabelSelectPair
          name='type'
          value={contact.type}
          options={Contact.contactTypeOptions}
          labelMessage={uiWordings['Contact.TypeLabel']}
          onChange={onChange}
        /> */}
        <LabelSelectPair
          name='language'
          value={contact.language}
          options={Contact.contactLanguageOptions}
          labelMessage={uiWordings['Contact.LanguageLabel']}
          onChange={onChange}
        />
        <LabelTogglePair
          name='isEnabled'
          value={contact.isEnabled}
          labelMessage={uiWordings['Contact.IsEnabledLabel']}
          onChange={onChange}
        />

        {!isAddMode && (
          <>
            <LabelLabelPair
              value={contact.lastModifyDTDisplay}
              labelMessage={uiWordings['Contact.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={contact.lastModifyUserDisplay}
              labelMessage={uiWordings['Contact.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddMode
              ? uiWordings['ContactEdit.AddContactSubmit']
              : uiWordings['ContactEdit.UpdateContactSubmit']
          }
        />
        {!isAddMode && (
          <Button
            onClick={onDeleteButtonClick}
            color='red'
            className='w3-right'
          >
            {uiWordings['ContactEdit.DeleteContact']}
          </Button>
        )}
      </Form>
    </>
  );
};

const ContactEditWithContainer = _ => (
  <ContactsPageContainer>
    <ContactEdit />
  </ContactsPageContainer>
);

export default ContactEditWithContainer;
