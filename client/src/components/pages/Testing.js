import React, { useContext, useEffect, useState, useCallback } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import RichTextbox from 'components/form/RichTextbox';
import routes from 'globals/routes';
import { generatePath } from 'react-router-dom';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import Contact from 'models/contact';
import LabelSelectPair from 'components/form/LabelSelectPair';
import axios from 'axios';
import SubmitButton from 'components/form/SubmitButton';
import Form from 'components/form/Form';

const emptyContact = new Contact();
const defaultState = emptyContact;

const Testing = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);
  const [btn1Value, setBtn1Value] = useState('');
  const [btn2Value, setBtn2Value] = useState('');
  const [btn3Value, setBtn3Value] = useState('');
  const [btn4Value, setBtn4Value] = useState('');
  const [contact, setContact] = useState(defaultState);
  // componentDidMount
  useEffect(_ => {
    setTitle('Testing');
    window.getMediaData = ({ additionalCallbackParam, medium }) => {
      console.log(additionalCallbackParam, medium.src);
      let setFuncToCall = null;
      switch (additionalCallbackParam) {
        case 'btn1':
          setFuncToCall = setBtn1Value;
          break;
        case 'btn2':
          setFuncToCall = setBtn2Value;
          break;
        case 'btn3':
          setFuncToCall = setBtn3Value;
          break;
        case 'btn4':
          setFuncToCall = setBtn4Value;
          break;
        default:
          break;
      }
      if (setFuncToCall) {
        setFuncToCall(medium.name + ' - ' + medium.src);
      }
    };

    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  /* methods */

  const validInput = useCallback(ContactInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setContact({ ...contact, [e.target.name]: e.target.value });
    },
    [contact, setContact]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();

      let isSuccess = validInput(contact);
      if (isSuccess) {
        let newContact = null;
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const { name, type, ...trimmedContact } = contact;
        try {
          const res = await axios.post(
            'api/frontend/contacts/contacts',
            trimmedContact,
            config
          );
          newContact = res.data;
          console.log('newContact:', newContact);
        } catch (err) {
          if (err && err.response && err.response.data) {
            console.error(err.response.data.errors);
          } else {
            console.error(err);
          }
        }
      }
    },
    [contact, validInput]
  );

  /* end of event handlers */

  return (
    <div className=''>
      <div className='w3-row'>
        <RichTextbox
          // debug={true}
          onChange={e => console.log(e)}
          filebrowserBrowseUrl={routes.fileManager}
          className={'w3-half'}
        />
      </div>
      <div className=''>
        <button
          onClick={() =>
            window.open(
              generatePath(routes.fileManager, {
                fileType: 'images',
                additionalCallbackParam: 'btn1'
              })
            )
          }
        >
          open image file manager
        </button>
        <button
          onClick={() =>
            window.open(
              generatePath(routes.fileManager, {
                fileType: 'videos',
                additionalCallbackParam: 'btn2'
              })
            )
          }
        >
          open video file manager
        </button>
        <button
          onClick={() =>
            window.open(
              generatePath(routes.fileManager, {
                fileType: 'audios',
                additionalCallbackParam: 'btn3'
              })
            )
          }
        >
          open audio file manager
        </button>
        <button
          onClick={() =>
            window.open(
              generatePath(routes.fileManager, {
                fileType: 'pdfs',
                additionalCallbackParam: 'btn4'
              })
            )
          }
        >
          open pdf file manager
        </button>
      </div>
      <LabelInputTextPair labelMessage='btn1' name='btn1' value={btn1Value} />
      <LabelInputTextPair labelMessage='btn2' name='btn2' value={btn2Value} />
      <LabelInputTextPair labelMessage='btn3' name='btn3' value={btn3Value} />
      <LabelInputTextPair labelMessage='btn4' name='btn4' value={btn4Value} />
      <br />
      <Form onSubmit={onSubmit}>
        <LabelInputTextPair
          inputType='email'
          name='emailAddress'
          value={contact.emailAddress}
          labelMessage={'Contact.EmailAddress'}
          placeholder=''
          onChange={onChange}
          // TODO:
          //required={true}
        />
        <LabelInputTextPair
          name='name'
          value={contact.name}
          labelMessage={'Contact.Name'}
          placeholder=''
          onChange={onChange}
          // TODO:
          //required={true}
        />
        <LabelSelectPair
          name='type'
          value={contact.type}
          options={Contact.contactTypeOptions}
          labelMessage={'Contact.Type'}
          onChange={onChange}
        />
        <LabelSelectPair
          name='language'
          value={contact.language}
          options={Contact.contactLanguageOptions}
          labelMessage={'Contact.Language'}
          onChange={onChange}
        />
        <SubmitButton label={'AddContactSubmit'} />
      </Form>
    </div>
  );
};

export default Testing;
