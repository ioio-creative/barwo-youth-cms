import React, { useContext, useState, useEffect, useCallback } from 'react';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import About from 'models/about';
import AboutContext from 'contexts/about/aboutContext';
import AboutContainer from 'components/about/AboutPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import FileUpload from 'components/form/FileUpload';
import SubmitButton from 'components/form/SubmitButton';
import uiWordings from 'globals/uiWordings';
import Medium from 'models/medium';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import scrollToTop from 'utils/ui/scrollToTop';

const originalAbout = new About();
const defaultState = originalAbout;
const mediumTypes = Medium.mediumTypes;

const AboutPageEdit = _ => {
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
  const [galleryPicked, setGalleryPicked] = useState([]);
  const [theaterImagePicked, setTheaterImagePicked] = useState(null);

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
      if (!aboutLoading) {
        setAbout(
          fetchedAbout ? About.getAboutForDisplay(fetchedAbout) : defaultState
        );
        setIsAddMode(!fetchedAbout);
      }
    },
    [aboutLoading, fetchedAbout, setAbout, setIsAddMode]
  );

  // aboutErrors
  useEffect(
    _ => {
      console.error();
      if (isNonEmptyArray(aboutErrors)) {
        setAlerts(
          aboutErrors
            .filter(errorType => {
              return (
                errorType !==
                About.aboutResponseTypes.ABOUT_PAGE_NOT_EXISTS.type
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

  const onGetGalleryPicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setGalleryPicked(newItemList);
    },
    [setIsSubmitEnabled, setGalleryPicked]
  );

  const onGetTheaterImagePicked = useCallback(
    newItemList => {
      setIsSubmitEnabled(true);
      setTheaterImagePicked(firstOrDefault(newItemList, null));
    },
    [setIsSubmitEnabled, setTheaterImagePicked]
  );

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      setAbout({
        ...about,
        [e.target.name]: e.target.value
      });
    },
    [about, setAbout, removeAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      // add gallery
      about.gallery = getArraySafe(galleryPicked).map(medium => {
        return medium._id;
      });
      about.theaterImage = theaterImagePicked ? theaterImagePicked._id : null;

      let returnedAbout = null;
      returnedAbout = await updateAbout(about);
      let isSuccess = Boolean(returnedAbout);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['AboutPageEdit.UpdateAboutSuccessMessage'],
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
      galleryPicked
    ]
  );

  /* end of event handlers */

  if (aboutLoading) {
    return <Loading />;
  }

  return (
    // originalAbout only use before finsihing the database
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['AboutPageEdit.EditAboutTitle']}</h4>
      <>
        <br />
        <div className='w3-card w3-container'>
          {uiWordings['About.BarwoRegionLabel']}
          <LabelRichTextbox
            name='barwo_tc'
            value={about.barwo_tc}
            labelMessage={uiWordings['About.BarwoTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='barwo_sc'
            value={about.barwo_sc}
            labelMessage={uiWordings['About.BarwoScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='barwo_en'
            value={about.barwo_en}
            labelMessage={uiWordings['About.BarwoEnLabel']}
            onChange={onChange}
            required={true}
          />
        </div>
        <br />
        <div className='w3-card w3-container'>
          {uiWordings['About.PlanRegionLabel']}
          <LabelRichTextbox
            name='plan_tc'
            value={about.plan_tc}
            labelMessage={uiWordings['About.PlanTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='plan_sc'
            value={about.plan_sc}
            labelMessage={uiWordings['About.PlanScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='plan_en'
            value={about.plan_en}
            labelMessage={uiWordings['About.PlanEnLabel']}
            onChange={onChange}
            required={true}
          />
          <FileUpload
            name='plan_gallery'
            labelMessage={uiWordings['About.PlanGalleryLabel']}
            files={getArraySafe(galleryPicked)}
            onGetFiles={onGetGalleryPicked}
            isMultiple={true}
            mediumType={mediumTypes.IMAGE}
          />
        </div>
        <br />
        <div className='w3-card w3-container'>
          {uiWordings['About.TheaterRegionLabel']}
          <LabelRichTextbox
            name='theaterLocation_tc'
            value={about.theaterLocation_tc}
            labelMessage={uiWordings['About.TheaterLocationTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterLocation_sc'
            value={about.theaterLocation_sc}
            labelMessage={uiWordings['About.TheaterLocationScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterLocation_en'
            value={about.theaterLocation_en}
            labelMessage={uiWordings['About.TheaterLocationEnLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc1_tc'
            value={about.theaterDesc1_tc}
            labelMessage={uiWordings['About.TheaterDesc1TcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc1_sc'
            value={about.theaterDesc1_sc}
            labelMessage={uiWordings['About.TheaterDesc1ScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc1_en'
            value={about.theaterDesc1_en}
            labelMessage={uiWordings['About.TheaterDesc1EnLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc2_tc'
            value={about.theaterDesc2_tc}
            labelMessage={uiWordings['About.TheaterDesc2TcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc2_sc'
            value={about.theaterDesc2_sc}
            labelMessage={uiWordings['About.TheaterDesc2ScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterDesc2_en'
            value={about.theaterDesc2_en}
            labelMessage={uiWordings['About.TheaterDesc2EnLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterTraffic_tc'
            value={about.theaterTraffic_tc}
            labelMessage={uiWordings['About.TheaterTrafficTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterTraffic_sc'
            value={about.theaterTraffic_sc}
            labelMessage={uiWordings['About.TheaterTrafficScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelRichTextbox
            name='theaterTraffic_en'
            value={about.theaterTraffic_en}
            labelMessage={uiWordings['About.TheaterTrafficEnLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='contactWebsite'
            value={about.contactWebsite}
            labelMessage={uiWordings['About.ContactWebsiteLabel']}
            placeholder=''
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='contactTel'
            value={about.contactTel}
            labelMessage={uiWordings['About.ContactTelLabel']}
            placeholder=''
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='contactFax'
            value={about.contactFax}
            labelMessage={uiWordings['About.ContactFaxLabel']}
            placeholder=''
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='contactEmail'
            value={about.contactEmail}
            labelMessage={uiWordings['About.ContactEmailLabel']}
            placeholder=''
            onChange={onChange}
            required={true}
          />
          <FileUpload
            name='theaterImage'
            labelMessage={uiWordings['About.TheaterImageLabel']}
            files={theaterImagePicked ? [theaterImagePicked] : null}
            onGetFiles={onGetTheaterImagePicked}
            isMultiple={false}
            mediumType={mediumTypes.IMAGE}
          />
        </div>
        <br />
        <div className='w3-card w3-container'>
          {uiWordings['About.AdminRegionLabel']}
          <LabelInputTextPair
            name='adminTitle_tc'
            value={about.adminTitle_tc}
            labelMessage={uiWordings['About.AdminTitleTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='adminName_tc'
            value={about.adminName_tc}
            labelMessage={uiWordings['About.AdminNameTcLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='adminTitle_sc'
            value={about.adminTitle_sc}
            labelMessage={uiWordings['About.AdminTitleScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='adminName_sc'
            value={about.adminName_sc}
            labelMessage={uiWordings['About.AdminNameScLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='adminTitle_en'
            value={about.adminTitle_en}
            labelMessage={uiWordings['About.AdminTitleEnLabel']}
            onChange={onChange}
            required={true}
          />
          <LabelInputTextPair
            name='adminName_en'
            value={about.adminName_en}
            labelMessage={uiWordings['About.AdminNameEnLabel']}
            onChange={onChange}
            required={true}
          />
        </div>
      </>
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
        label={uiWordings['AboutPageEdit.UpdateAboutSubmit']}
      />
    </Form>
  );
};

const AboutPageEditWithContainer = _ => (
  <AboutContainer>
    <AboutPageEdit />
  </AboutContainer>
);

export default AboutPageEditWithContainer;
