import React, { useContext, useState, useEffect, useCallback } from 'react';
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
  const [pricesPicked, setPricesPicked] = useState([]);

  // phones in ticketingDefault
  const [phonesPicked, setPhonesPicked] = useState([]);

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
    },
    [fetchedTicketingDefault]
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

  /* methods */

  const validInput = useCallback(ticketingInput => {
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
      setTicketingDefault(prevTicketing => ({
        ...prevTicketing,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetPricesPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setPricesPicked(newItemList);
  }, []);

  const onGetPhonesPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setPhonesPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add prices
      ticketingDefault.prices = getArraySafe(pricesPicked).map(
        ({ price_tc, price_sc, price_en }) => {
          return {
            price_tc,
            price_sc,
            price_en
          };
        }
      );

      // add phones
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

      let isSuccess = validInput(ticketingDefault);
      let returnedTicketingDefault = null;
      returnedTicketingDefault = await updateTicketingDefault(ticketingDefault);
      isSuccess = Boolean(returnedTicketingDefault);
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
      setAlerts,
      removeAlerts,
      pricesPicked,
      phonesPicked,
      validInput
    ]
  );

  /* end of event handlers */

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

      <LabelRichTextbox
        name='priceRemarks_tc'
        value={ticketingDefault.priceRemarks_tc}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksTcLabel']}
        onChange={onChange}
      />
      <LabelRichTextbox
        name='priceRemarks_sc'
        value={ticketingDefault.priceRemarks_sc}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksScLabel']}
        onChange={onChange}
      />
      <LabelRichTextbox
        name='priceRemarks_en'
        value={ticketingDefault.priceRemarks_en}
        labelMessage={uiWordings['TicketingDefault.PriceRemarksEnLabel']}
        onChange={onChange}
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
