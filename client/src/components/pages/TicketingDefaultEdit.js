import React, { useContext, useState, useEffect, useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import TicketingDefault from 'models/ticketingDefault';
import TicketingDefaultContext from 'contexts/ticketingDefault/ticketingDefaultContext';
import TicketingDefaultContainer from 'components/ticketingDefault/TicketingDefaultContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from 'components/form/LabelRichTextbox';
import TicketingDefaultEditPriceSelect from 'components/events/EventEditPriceSelect';
import TicketingDefaultEditPhoneSelect from 'components/events/EventEditPhoneSelect';
import SubmitButton from 'components/form/SubmitButton';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';
import routes from 'globals/routes';

const originalTicketingDefault = new TicketingDefault();
const defaultState = originalTicketingDefault;
const TicketingDefaultEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    ticketingDefault: fetchedTicketingDefault,
    ticketingDefaultErrors,
    ticketingDefaultLoading,
    getTicketingDefault,
    clearTicketingDefault,
    clearTicketingDefaultErrors,
    updateTicketingDefault
  } = useContext(TicketingDefaultContext);

  const [ticketingDefault, setTicketingDefault] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // prices in ticketingDefault
  const [pricesPicked, setPricesPicked] = useState([
    { price_tc: '150元', price_sc: '150元', price_en: 'HK$150' },
    { price_tc: '100元', price_sc: '100元', price_en: 'HK$100' }
  ]);

  // phones in ticketingDefault
  const [phonesPicked, setPhonesPicked] = useState([
    {
      label_tc: '節目查詢',
      label_sc: '节目查询',
      label_en: 'Programme enquiries',
      phone: '(852) 2384 2939'
    },
    {
      label_tc: '票務查詢',
      label_sc: '票务查询',
      label_en: 'Ticketing enquiries',
      phone: '(852) 3761 6661'
    },
    {
      label_tc: '信用卡電話熱線',
      label_sc: '信用卡电话热线',
      label_en: 'Credit card telephone booking',
      phone: '(852) 2111 5999'
    }
  ]);

  // componentDidMount
  useEffect(_ => {
    getTicketingDefault();
    return _ => {
      clearTicketingDefault();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedTicketingDefault
  useEffect(
    _ => {
      if (!ticketingDefaultLoading) {
        setTicketingDefault(
          fetchedTicketingDefault
            ? TicketingDefault.getTicketingDefaultForDisplay(
                fetchedTicketingDefault
              )
            : defaultState
        );
        if (fetchedTicketingDefault) {
          setPricesPicked(getArraySafe(fetchedTicketingDefault.prices));
          setPhonesPicked(getArraySafe(fetchedTicketingDefault.phones));
        }
        setIsAddMode(!fetchedTicketingDefault);
      }
    },
    [
      ticketingDefaultLoading,
      fetchedTicketingDefault,
      setTicketingDefault,
      setIsAddMode,
      setPricesPicked,
      setPhonesPicked
    ]
  );

  // ticketingDefaultErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(ticketingDefaultErrors)) {
        setAlerts(
          ticketingDefaultErrors
            .filter(errorType => {
              return (
                errorType !==
                TicketingDefault.ticketingDefaultResponseTypes
                  .TICKETING_DEFAULT_NOT_EXISTS.type
              );
            })
            .map(ticketingDefaultError => {
              return new Alert(
                TicketingDefault.ticketingDefaultResponseTypes[
                  ticketingDefaultError
                ].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearTicketingDefaultErrors();
      }
    },
    [ticketingDefaultErrors, setAlerts, clearTicketingDefaultErrors]
  );

  /* ticketingDefault handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      setTicketingDefault({
        ...ticketingDefault,
        [e.target.name]: e.target.value
      });
    },
    [ticketingDefault, setTicketingDefault, removeAlerts]
  );

  const onGetPricesPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setPricesPicked(newItemList);
    },
    [setPricesPicked, setIsSubmitEnabled]
  );

  const onGetPhonesPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setPhonesPicked(newItemList);
    },
    [setPhonesPicked, setIsSubmitEnabled]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      ticketingDefault.prices = getArraySafe(pricesPicked).map(
        ({ price_tc, price_sc, price_en }) => {
          return {
            price_tc,
            price_sc,
            price_en
          };
        }
      );

      ticketingDefault.phones = getArraySafe(phonesPicked).map(
        ({ label_tc, label_sc, label_en, phone }) => {
          return {
            label_tc,
            label_sc,
            label_en,
            phone
          };
        }
      );

      let returnedTicketingDefault = null;
      returnedTicketingDefault = await updateTicketingDefault(ticketingDefault);
      let isSuccess = Boolean(returnedTicketingDefault);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings[
              'TicketingDefaultEdit.UpdateTicketingDefaultEditSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );

        getTicketingDefault();
      }

      scrollToTop();
    },
    [
      ticketingDefault,
      updateTicketingDefault,
      getTicketingDefault,
      ticketingDefault,
      setAlerts,
      removeAlerts,
      pricesPicked,
      phonesPicked
    ]
  );

  /* end of ticketingDefault handlers */

  if (ticketingDefaultLoading) {
    return <Loading />;
  }
  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['TicketingDefaultEdit.EditTicketingDefaultTitle']}</h4>
      <LabelInputTextPair
        name='venue_tc'
        value={ticketingDefault.venue_tc}
        labelMessage={uiWordings['TicketingDefault.VenueTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='venue_sc'
        value={ticketingDefault.venue_sc}
        labelMessage={uiWordings['TicketingDefault.VenueScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='venue_en'
        value={ticketingDefault.venue_en}
        labelMessage={uiWordings['TicketingDefault.VenueEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <TicketingDefaultEditPriceSelect
        prices={pricesPicked}
        onGetPrices={onGetPricesPicked}
      />

      <LabelRichTextbox
        name='priceRemarks_tc'
        value={ticketingDefault.priceRemarks_tc}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksTcLabel']}
        onChange={onChange}
        filebrowserBrowseUrl={generatePath(routes.fileManager, {
          fileType: 'images'
        })}
      />
      <LabelRichTextbox
        name='priceRemarks_sc'
        value={ticketingDefault.priceRemarks_sc}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksScLabel']}
        onChange={onChange}
        filebrowserBrowseUrl={generatePath(routes.fileManager, {
          fileType: 'images'
        })}
      />
      <LabelRichTextbox
        name='priceRemarks_en'
        value={ticketingDefault.priceRemarks_en}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksEnLabel']}
        onChange={onChange}
        filebrowserBrowseUrl={generatePath(routes.fileManager, {
          fileType: 'images'
        })}
      />

      <TicketingDefaultEditPhoneSelect
        phones={phonesPicked}
        onGetPhones={onGetPhonesPicked}
      />

      <LabelInputTextPair
        name='ticketUrl'
        value={ticketingDefault.ticketUrl}
        labelMessage={uiWordings['TicketingDefault.ticketUrlLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      {!isAddMode && (
        <>
          <LabelLabelPair
            value={ticketingDefault.lastModifyDTDisplay}
            labelMessage={uiWordings['TicketingDefault.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={ticketingDefault.lastModifyUserDisplay}
            labelMessage={uiWordings['TicketingDefault.LastModifyUserLabel']}
          />
        </>
      )}
      <SubmitButton
        disabled={!isSubmitEnabled}
        label={
          uiWordings['TicketingDefaultEdit.UpdateTicketingDefaultEditSubmit']
        }
      />
    </Form>
  );
};

const TicketingDefaultEditWithContainer = _ => (
  <TicketingDefaultContainer>
    <TicketingDefaultEdit />
  </TicketingDefaultContainer>
);

export default TicketingDefaultEditWithContainer;
