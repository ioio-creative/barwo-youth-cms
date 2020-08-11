import React, { useContext, useState, useEffect, useCallback } from 'react';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import MiscellaneousInfo from 'models/miscellaneousInfo';
import MiscellaneousInfoContext from 'contexts/miscellaneousInfo/miscellaneousInfoContext';
import MiscellaneousInfoContainer from 'components/miscellaneousInfo/MiscellaneousInfoContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import AccordionRegion from 'components/layout/AccordionRegion';
import Form from 'components/form/Form';
import LabelRichTextbox from 'components/form/LabelRichTextbox';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import FileUpload from 'components/form/FileUpload';
import SubmitButton from 'components/form/SubmitButton';
import uiWordings from 'globals/uiWordings';
import Medium from 'models/medium';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyMiscellaneousInfo = new MiscellaneousInfo();
const defaultState = emptyMiscellaneousInfo;
const mediumTypes = Medium.mediumTypes;

const MiscellaneousInfoEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    miscellaneousInfo: fetchedMiscellaneousInfo,
    miscellaneousInfoErrors,
    miscellaneousInfoLoading,
    getMiscellaneousInfo,
    clearMiscellaneousInfo,
    clearMiscellaneousInfoErrors,
    updateMiscellaneousInfo
  } = useContext(MiscellaneousInfoContext);

  const [miscellaneousInfo, setMiscellaneousInfo] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // footerOrganizerLogos
  const [footerOrganizerLogosPicked, setFooterOrganizerLogosPicked] = useState(
    []
  );

  // footerSponsorLogos
  const [footerSponsorLogosPicked, setFooterSponsorLogosPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getMiscellaneousInfo();
    return _ => {
      clearMiscellaneousInfo();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedMiscellaneousInfo
  useEffect(
    _ => {
      setMiscellaneousInfo(
        fetchedMiscellaneousInfo
          ? MiscellaneousInfo.getMiscellaneousInfoForDisplay(
              fetchedMiscellaneousInfo
            )
          : defaultState
      );
      if (fetchedMiscellaneousInfo) {
        setFooterOrganizerLogosPicked(
          getArraySafe(fetchedMiscellaneousInfo.footerOrganizerLogos)
        );
        setFooterSponsorLogosPicked(
          getArraySafe(fetchedMiscellaneousInfo.footerSponsorLogos)
        );
      }
      setIsAddMode(!fetchedMiscellaneousInfo);
    },
    [fetchedMiscellaneousInfo]
  );

  // miscellaneousInfoErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(miscellaneousInfoErrors)) {
        setAlerts(
          miscellaneousInfoErrors
            .filter(errorType => {
              return (
                errorType !==
                MiscellaneousInfo.miscellaneousInfoResponseTypes
                  .MISCELLANEOUS_INFO_NOT_EXISTS.type
              );
            })
            .map(miscellaneousInfoError => {
              return new Alert(
                MiscellaneousInfo.miscellaneousInfoResponseTypes[
                  miscellaneousInfoError
                ].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearMiscellaneousInfoErrors();
      }
    },
    [miscellaneousInfoErrors, setAlerts, clearMiscellaneousInfoErrors]
  );

  /* methods */

  const validInput = useCallback(
    miscellaneousInfoInput => {
      const fieldsToCheckNull = [
        {
          name: 'termsAndConditionsDesc_tc',
          errorTypeName: 'TERMS_AND_CONDITIONS_DESC_TC_REQUIRED'
        },
        {
          name: 'termsAndConditionsDesc_sc',
          errorTypeName: 'TERMS_AND_CONDITIONS_DESC_SC_REQUIRED'
        },
        {
          name: 'termsAndConditionsDesc_en',
          errorTypeName: 'TERMS_AND_CONDITIONS_DESC_EN_REQUIRED'
        },
        {
          name: 'privacyPolicyDesc_tc',
          errorTypeName: 'PRIVACY_POLICY_DESC_TC_REQUIRED'
        },
        {
          name: 'privacyPolicyDesc_sc',
          errorTypeName: 'PRIVACY_POLICY_DESC_SC_REQUIRED'
        },
        {
          name: 'privacyPolicyDesc_en',
          errorTypeName: 'PRIVACY_POLICY_DESC_EN_REQUIRED'
        }
      ];
      for (const fieldToCheck of fieldsToCheckNull) {
        if (!miscellaneousInfoInput[fieldToCheck.name]) {
          setAlerts(
            new Alert(
              MiscellaneousInfo.miscellaneousInfoResponseTypes[
                fieldToCheck.errorTypeName
              ].msg,
              Alert.alertTypes.WARNING
            )
          );
          return false;
        }
      }
      return true;
    },
    [setAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setMiscellaneousInfo(prevMiscellaneousInfo => ({
        ...prevMiscellaneousInfo,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetFooterOrganizerLogosPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFooterOrganizerLogosPicked(newItemList);
  }, []);

  const onGetFooterSponsorLogosPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setFooterSponsorLogosPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add footerOrganizerLogos
      miscellaneousInfo.footerOrganizerLogos = getArraySafe(
        footerOrganizerLogosPicked
      ).map(medium => {
        return medium._id;
      });

      // add footerSponsorLogos
      miscellaneousInfo.footerSponsorLogos = getArraySafe(
        footerSponsorLogosPicked
      ).map(medium => {
        return medium._id;
      });

      let isSuccess = validInput(miscellaneousInfo);
      let returnedMiscellaneousInfo = null;

      if (isSuccess) {
        returnedMiscellaneousInfo = await updateMiscellaneousInfo(
          miscellaneousInfo
        );
        isSuccess = Boolean(returnedMiscellaneousInfo);
      }

      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings[
              'MiscellaneousInfoEdit.UpdateMiscellaneousInfoSuccessMessage'
            ],
            Alert.alertTypes.INFO
          )
        );
        getMiscellaneousInfo();
      }

      scrollToTop();
    },
    [
      updateMiscellaneousInfo,
      getMiscellaneousInfo,
      miscellaneousInfo,
      setAlerts,
      removeAlerts,
      footerOrganizerLogosPicked,
      footerSponsorLogosPicked,
      validInput
    ]
  );

  /* end of event handlers */

  if (miscellaneousInfoLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['MiscellaneousInfoEdit.EditMiscellaneousInfoTitle']}</h4>

      <AccordionRegion
        title={uiWordings['MiscellaneousInfo.ContactRegionLabel']}
      >
        <LabelInputTextPair
          name='contactAddress_tc'
          value={miscellaneousInfo.contactAddress_tc}
          labelMessage={uiWordings['MiscellaneousInfo.ContactAddressTcLabel']}
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='contactAddress_sc'
          value={miscellaneousInfo.contactAddress_sc}
          labelMessage={uiWordings['MiscellaneousInfo.ContactAddressScLabel']}
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='contactAddress_en'
          value={miscellaneousInfo.contactAddress_en}
          labelMessage={uiWordings['MiscellaneousInfo.ContactAddressEnLabel']}
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='contactTel'
          value={miscellaneousInfo.contactTel}
          labelMessage={uiWordings['MiscellaneousInfo.ContactTelLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='contactFax'
          value={miscellaneousInfo.contactFax}
          labelMessage={uiWordings['MiscellaneousInfo.ContactFaxLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='contactEmail'
          value={miscellaneousInfo.contactEmail}
          labelMessage={uiWordings['MiscellaneousInfo.ContactEmailLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['MiscellaneousInfo.FooterRegionLabel']}
      >
        <FileUpload
          name='footerOrganizerLogos'
          labelMessage={
            uiWordings['MiscellaneousInfo.FooterOrganizerLogosLabel']
          }
          files={getArraySafe(footerOrganizerLogosPicked)}
          onGetFiles={onGetFooterOrganizerLogosPicked}
          isMultiple={true}
          mediumType={mediumTypes.IMAGE}
        />
        <FileUpload
          name='footerSponsorLogos'
          labelMessage={uiWordings['MiscellaneousInfo.FooterSponsorLogosLabel']}
          files={getArraySafe(footerSponsorLogosPicked)}
          onGetFiles={onGetFooterSponsorLogosPicked}
          isMultiple={true}
          mediumType={mediumTypes.IMAGE}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['MiscellaneousInfo.TermsAndConditionsRegionLabel']}
      >
        <LabelInputTextPair
          name='termsAndConditionsTitle_tc'
          value={miscellaneousInfo.termsAndConditionsTitle_tc}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsTitleTcLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='termsAndConditionsTitle_sc'
          value={miscellaneousInfo.termsAndConditionsTitle_sc}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsTitleScLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='termsAndConditionsTitle_en'
          value={miscellaneousInfo.termsAndConditionsTitle_en}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsTitleEnLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelRichTextbox
          name='termsAndConditionsDesc_tc'
          value={miscellaneousInfo.termsAndConditionsDesc_tc}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsDescTcLabel']
          }
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='termsAndConditionsDesc_sc'
          value={miscellaneousInfo.termsAndConditionsDesc_sc}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsDescScLabel']
          }
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='termsAndConditionsDesc_en'
          value={miscellaneousInfo.termsAndConditionsDesc_en}
          labelMessage={
            uiWordings['MiscellaneousInfo.TermsAndConditionsDescEnLabel']
          }
          onChange={onChange}
          required={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['MiscellaneousInfo.PrivacyPolicyRegionLabel']}
      >
        <LabelInputTextPair
          name='privacyPolicyTitle_tc'
          value={miscellaneousInfo.privacyPolicyTitle_tc}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyTitleTcLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='privacyPolicyTitle_sc'
          value={miscellaneousInfo.privacyPolicyTitle_sc}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyTitleScLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelInputTextPair
          name='privacyPolicyTitle_en'
          value={miscellaneousInfo.privacyPolicyTitle_en}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyTitleEnLabel']
          }
          onChange={onChange}
          placeholder=''
          required={true}
        />
        <LabelRichTextbox
          name='privacyPolicyDesc_tc'
          value={miscellaneousInfo.privacyPolicyDesc_tc}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyDescTcLabel']
          }
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='privacyPolicyDesc_sc'
          value={miscellaneousInfo.privacyPolicyDesc_sc}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyDescScLabel']
          }
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='privacyPolicyDesc_en'
          value={miscellaneousInfo.privacyPolicyDesc_en}
          labelMessage={
            uiWordings['MiscellaneousInfo.PrivacyPolicyDescEnLabel']
          }
          onChange={onChange}
          required={true}
        />
      </AccordionRegion>

      {!isAddMode && (
        <>
          <LabelLabelPair
            value={miscellaneousInfo.lastModifyDTDisplay}
            labelMessage={uiWordings['MiscellaneousInfo.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={miscellaneousInfo.lastModifyUserDisplay}
            labelMessage={uiWordings['MiscellaneousInfo.LastModifyUserLabel']}
          />
        </>
      )}

      <SubmitButton
        disabled={!isSubmitEnabled}
        label={
          uiWordings['MiscellaneousInfoEdit.UpdateMiscellaneousInfoSubmit']
        }
      />
    </Form>
  );
};

const MiscellaneousInfoEditWithContainer = _ => (
  <MiscellaneousInfoContainer>
    <MiscellaneousInfoEdit />
  </MiscellaneousInfoContainer>
);

export default MiscellaneousInfoEditWithContainer;
