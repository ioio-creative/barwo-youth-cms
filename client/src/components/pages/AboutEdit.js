import React, { useContext, useState, useEffect, useCallback } from 'react';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import About from 'models/about';
import AboutContext from 'contexts/about/aboutContext';
import AboutContainer from 'components/about/AboutContainer';
import AboutEditStaffPersonSelect from 'components/about/AboutEditStaffPersonSelect';
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
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const emptyAbout = new About();
const defaultState = emptyAbout;
const mediumTypes = Medium.mediumTypes;

const AboutEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    about: fetchedAbout,
    aboutErrors,
    aboutLoading,
    getAbout,
    clearAbout,
    clearAboutErrors,
    updateAbout
  } = useContext(AboutContext);

  const [about, setAbout] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // plan gallery
  const [planGalleryPicked, setPlanGalleryPicked] = useState([]);

  // theater image
  const [theaterImagePicked, setTheaterImagePicked] = useState(null);

  // admins
  const [adminsPicked, setAdminsPicked] = useState([]);

  // production persons
  const [productionPersonsPicked, setProductionPersonsPicked] = useState([]);

  // componentDidMount
  useEffect(_ => {
    getAbout();
    return _ => {
      clearAbout();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedAbout
  useEffect(
    _ => {
      setAbout(
        fetchedAbout ? About.getAboutForDisplay(fetchedAbout) : defaultState
      );
      if (fetchedAbout) {
        setPlanGalleryPicked(getArraySafe(fetchedAbout.planGallery));
        setTheaterImagePicked(fetchedAbout.theaterImage);
        setAdminsPicked(getArraySafe(fetchedAbout.admins));
        setProductionPersonsPicked(
          getArraySafe(fetchedAbout.productionPersons)
        );
      }
      setIsAddMode(!fetchedAbout);
    },
    [fetchedAbout]
  );

  // aboutErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(aboutErrors)) {
        setAlerts(
          aboutErrors
            .filter(errorType => {
              return (
                errorType !== About.aboutResponseTypes.ABOUT_NOT_EXISTS.type
              );
            })
            .map(aboutError => {
              return new Alert(
                About.aboutResponseTypes[aboutError].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearAboutErrors();
      }
    },
    [aboutErrors, setAlerts, clearAboutErrors]
  );

  /* methods */

  const validInput = useCallback(
    aboutInput => {
      const fieldsToCheckNull = [
        { name: 'barwoDesc_tc', errorTypeName: 'BARWO_DESC_TC_REQUIRED' },
        { name: 'barwoDesc_sc', errorTypeName: 'BARWO_DESC_SC_REQUIRED' },
        { name: 'barwoDesc_en', errorTypeName: 'BARWO_DESC_EN_REQUIRED' },
        { name: 'planDesc_tc', errorTypeName: 'PLAN_DESC_TC_REQUIRED' },
        { name: 'planDesc_tc', errorTypeName: 'PLAN_DESC_TC_REQUIRED' },
        { name: 'planDesc_tc', errorTypeName: 'PLAN_DESC_TC_REQUIRED' },
        {
          name: 'theaterLocationName_tc',
          errorTypeName: 'THEATER_LOCATION_NAME_TC_REQUIRED'
        },
        {
          name: 'theaterLocationName_tc',
          errorTypeName: 'THEATER_LOCATION_NAME_TC_REQUIRED'
        },
        {
          name: 'theaterLocationName_tc',
          errorTypeName: 'THEATER_LOCATION_NAME_TC_REQUIRED'
        }
      ];
      for (const fieldToCheck of fieldsToCheckNull) {
        if (!aboutInput[fieldToCheck.name]) {
          setAlerts(
            new Alert(
              About.aboutResponseTypes[fieldToCheck.errorTypeName].msg,
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
      setAbout(prevAbout => ({
        ...prevAbout,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onGetPlanGalleryPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setPlanGalleryPicked(newItemList);
  }, []);

  const onGetTheaterImagePicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setTheaterImagePicked(firstOrDefault(newItemList, null));
  }, []);

  const onGetAdminsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setAdminsPicked(newItemList);
  }, []);

  const onGetProductionPersonsPicked = useCallback(newItemList => {
    setIsSubmitEnabled(true);
    setProductionPersonsPicked(newItemList);
  }, []);

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add plan gallery
      about.planGallery = getArraySafe(planGalleryPicked).map(medium => {
        return medium._id;
      });

      // add theater image
      about.theaterImage = theaterImagePicked ? theaterImagePicked._id : null;

      const mapStaffPersonFunc = ({
        title_tc,
        name_tc,
        title_sc,
        name_sc,
        title_en,
        name_en
      }) => ({
        title_tc,
        name_tc,
        title_sc,
        name_sc,
        title_en,
        name_en
      });

      // add admins
      about.admins = getArraySafe(adminsPicked).map(mapStaffPersonFunc);

      // add production persons
      about.productionPersons = getArraySafe(productionPersonsPicked).map(
        mapStaffPersonFunc
      );

      let isSuccess = validInput(about);
      let returnedAbout = null;

      if (isSuccess) {
        returnedAbout = await updateAbout(about);
        isSuccess = Boolean(returnedAbout);
      }

      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['AboutEdit.UpdateAboutSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
        getAbout();
      }

      scrollToTop();
    },
    [
      updateAbout,
      getAbout,
      about,
      setAlerts,
      removeAlerts,
      theaterImagePicked,
      planGalleryPicked,
      adminsPicked,
      productionPersonsPicked,
      validInput
    ]
  );

  /* end of event handlers */

  if (aboutLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['AboutEdit.EditAboutTitle']}</h4>

      <AccordionRegion title={uiWordings['About.BarwoRegionLabel']}>
        <LabelRichTextbox
          name='barwoDesc_tc'
          value={about.barwoDesc_tc}
          labelMessage={uiWordings['About.BarwoDescTcLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='barwoDesc_sc'
          value={about.barwoDesc_sc}
          labelMessage={uiWordings['About.BarwoDescScLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='barwoDesc_en'
          value={about.barwoDesc_en}
          labelMessage={uiWordings['About.BarwoDescEnLabel']}
          onChange={onChange}
          required={true}
        />
      </AccordionRegion>

      <AccordionRegion title={uiWordings['About.PlanRegionLabel']}>
        <FileUpload
          name='planGallery'
          labelMessage={uiWordings['About.PlanGalleryLabel']}
          files={getArraySafe(planGalleryPicked)}
          onGetFiles={onGetPlanGalleryPicked}
          isMultiple={true}
          mediumType={mediumTypes.IMAGE}
        />
        <LabelRichTextbox
          name='planDesc_tc'
          value={about.planDesc_tc}
          labelMessage={uiWordings['About.PlanDescTcLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='planDesc_sc'
          value={about.planDesc_sc}
          labelMessage={uiWordings['About.PlanDescScLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='planDesc_en'
          value={about.planDesc_en}
          labelMessage={uiWordings['About.PlanDescEnLabel']}
          onChange={onChange}
          required={true}
        />
      </AccordionRegion>

      <AccordionRegion title={uiWordings['About.TheaterBasicInfoRegionLabel']}>
        <FileUpload
          name='theaterImage'
          labelMessage={uiWordings['About.TheaterImageLabel']}
          files={theaterImagePicked ? [theaterImagePicked] : null}
          onGetFiles={onGetTheaterImagePicked}
          isMultiple={false}
          mediumType={mediumTypes.IMAGE}
        />
        <LabelRichTextbox
          name='theaterLocationName_tc'
          value={about.theaterLocationName_tc}
          labelMessage={uiWordings['About.TheaterLocationNameTcLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='theaterLocationName_sc'
          value={about.theaterLocationName_sc}
          labelMessage={uiWordings['About.TheaterLocationNameScLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelRichTextbox
          name='theaterLocationName_en'
          value={about.theaterLocationName_en}
          labelMessage={uiWordings['About.TheaterLocationNameEnLabel']}
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='theaterLocationHref_tc'
          value={about.theaterLocationHref_tc}
          labelMessage={uiWordings['About.TheaterLocationHrefTcLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='theaterLocationHref_sc'
          value={about.theaterLocationHref_sc}
          labelMessage={uiWordings['About.TheaterLocationHrefScLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='theaterLocationHref_en'
          value={about.theaterLocationHref_en}
          labelMessage={uiWordings['About.TheaterLocationHrefEnLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc1_tc'
          value={about.theaterLocationDesc1_tc}
          labelMessage={uiWordings['About.TheaterLocationDesc1TcLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc1_sc'
          value={about.theaterLocationDesc1_sc}
          labelMessage={uiWordings['About.TheaterLocationDesc1ScLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc1_en'
          value={about.theaterLocationDesc1_en}
          labelMessage={uiWordings['About.TheaterLocationDesc1EnLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc2_tc'
          value={about.theaterLocationDesc2_tc}
          labelMessage={uiWordings['About.TheaterLocationDesc2TcLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc2_sc'
          value={about.theaterLocationDesc2_sc}
          labelMessage={uiWordings['About.TheaterLocationDesc2ScLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterLocationDesc2_en'
          value={about.theaterLocationDesc2_en}
          labelMessage={uiWordings['About.TheaterLocationDesc2EnLabel']}
          onChange={onChange}
        />
      </AccordionRegion>

      {/* <AccordionRegion
        title={uiWordings['About.TheaterTrafficAndContactRegionLabel']}
      >
        <LabelRichTextbox
          name='theaterTraffic_tc'
          value={about.theaterTraffic_tc}
          labelMessage={uiWordings['About.TheaterTrafficTcLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterTraffic_sc'
          value={about.theaterTraffic_sc}
          labelMessage={uiWordings['About.TheaterTrafficScLabel']}
          onChange={onChange}
        />
        <LabelRichTextbox
          name='theaterTraffic_en'
          value={about.theaterTraffic_en}
          labelMessage={uiWordings['About.TheaterTrafficEnLabel']}
          onChange={onChange}
        />
        <LabelInputTextPair
          name='contactWebsite'
          value={about.contactWebsite}
          labelMessage={uiWordings['About.ContactWebsiteLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='contactTel'
          value={about.contactTel}
          labelMessage={uiWordings['About.ContactTelLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='contactFax'
          value={about.contactFax}
          labelMessage={uiWordings['About.ContactFaxLabel']}
          placeholder=''
          onChange={onChange}
        />
        <LabelInputTextPair
          name='contactEmail'
          value={about.contactEmail}
          labelMessage={uiWordings['About.ContactEmailLabel']}
          placeholder=''
          onChange={onChange}
        />
      </AccordionRegion> */}

      <AccordionRegion title={uiWordings['About.AdminsRegionLabel']}>
        <AboutEditStaffPersonSelect
          staffPersons={adminsPicked}
          onGetStaffPersons={onGetAdminsPicked}
          labelMessage={uiWordings['About.AdminsLabel']}
          isUseTextAreaForName={true}
        />
      </AccordionRegion>

      <AccordionRegion
        title={uiWordings['About.ProductionPersonsRegionLabel']}
        isMarginBottom={false}
      >
        <AboutEditStaffPersonSelect
          staffPersons={productionPersonsPicked}
          onGetStaffPersons={onGetProductionPersonsPicked}
          labelMessage={uiWordings['About.ProductionPersonsLabel']}
          isUseTextAreaForName={true}
        />
      </AccordionRegion>

      {!isAddMode && (
        <>
          <LabelLabelPair
            value={about.lastModifyDTDisplay}
            labelMessage={uiWordings['About.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={about.lastModifyUserDisplay}
            labelMessage={uiWordings['About.LastModifyUserLabel']}
          />
        </>
      )}

      <SubmitButton
        disabled={!isSubmitEnabled}
        label={uiWordings['AboutEdit.UpdateAboutSubmit']}
      />
    </Form>
  );
};

const AboutEditWithContainer = _ => (
  <AboutContainer>
    <AboutEdit />
  </AboutContainer>
);

export default AboutEditWithContainer;
