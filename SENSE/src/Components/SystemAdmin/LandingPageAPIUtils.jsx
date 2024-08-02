import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const LandingPageAPIUtils = ({ onUpdateSuccess, onError }) => {
  const [mainParagraph, setMainParagraph] = useState('');
  const [freePlanFeatures, setFreePlanFeatures] = useState([]);
  const [premiumPlanFeatures, setPremiumPlanFeatures] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [missionParagraph, setMissionParagraph] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('landingPageData');
    if (storedData) {
      const {
        mainParagraph, freePlanFeatures, premiumPlanFeatures, videoLink, missionParagraph,
        contactEmail, contactPhone, contactAddress, images
      } = JSON.parse(storedData);
      setMainParagraph(mainParagraph);
      setFreePlanFeatures(freePlanFeatures);
      setPremiumPlanFeatures(premiumPlanFeatures);
      setVideoLink(videoLink);
      setMissionParagraph(missionParagraph);
      setContactEmail(contactEmail);
      setContactPhone(contactPhone);
      setContactAddress(contactAddress);
      setImages(images);
     
    } else {
      fetchLandingPageData();
    }
  }, []);

  const fetchLandingPageData = async () => {
    try {
      const headers = getHeaders();
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/get',
        null,
        { headers }
      );

      if (
        response.data &&
        response.data.body &&
        response.data.body.string &&
        response.data.body.string.main_page &&
        response.data.body.string.main_page.paragraph1 &&
        response.data.body.string.plans &&
        response.data.body.string.video_link &&
        response.data.body.string.our_mission &&
        response.data.body.string.our_mission.paragraph1 &&
        response.data.body.string.contact &&
        response.data.body.file
      ) {
        const fetchedParagraph = response.data.body.string.main_page.paragraph1;
        const plans = response.data.body.string.plans[0];
        const fetchedFreePlanFeatures = plans.free_plan.description;
        const fetchedPremiumPlanFeatures = plans.paid_plan.description;
        const fetchedVideoLink = response.data.body.string.video_link[0].demo;
        const fetchedMissionParagraph = response.data.body.string.our_mission.paragraph1;
        const fetchedContactEmail = response.data.body.string.contact.email;
        const fetchedContactPhone = response.data.body.string.contact.phone;
        const fetchedContactAddress = response.data.body.string.contact.address;
        const fileData = response.data.body.file;
        // console.log(fileData)

        setMainParagraph(fetchedParagraph);
        setFreePlanFeatures(fetchedFreePlanFeatures);
        setPremiumPlanFeatures(fetchedPremiumPlanFeatures);
        setVideoLink(fetchedVideoLink);
        setMissionParagraph(fetchedMissionParagraph);
        setContactEmail(fetchedContactEmail);
        setContactPhone(fetchedContactPhone);
        setContactAddress(fetchedContactAddress);
        setImages(fileData);

        // Save data to local storage
        localStorage.setItem('landingPageData', JSON.stringify({
          mainParagraph: fetchedParagraph,
          freePlanFeatures: fetchedFreePlanFeatures,
          premiumPlanFeatures: fetchedPremiumPlanFeatures,
          videoLink: fetchedVideoLink,
          missionParagraph: fetchedMissionParagraph,
          contactEmail: fetchedContactEmail,
          contactPhone: fetchedContactPhone,
          contactAddress: fetchedContactAddress,
          images: fileData
        }));
      } else {
        throw new Error('Required data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching landing page data:', error);
      onError(error);
    }
  };

  const updateLandingPageImage = async (imageKey, imgFile, newImgKey) => {
    try {
      const headers = getHeaders();
      setLoading(true);

      // Delete the old image
      await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/file/delete',
        { filename: imageKey },
        { headers }
      );

      // Get the upload URL for the new image
      const createResponse = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/file/create',
        {filename: newImgKey},
        { headers }
      );

      const imgUpdateUrl = createResponse.data.body;

      // Upload the new image to S3
      await axios.put(
        imgUpdateUrl,
        imgFile,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Disposition': 'attachment',
            ...headers
          },
        }
      );

      // Refresh the landing page data
      await fetchLandingPageData();

      setLoading(false);
      onUpdateSuccess();
    } catch (error) {
      setLoading(false);
      onError(error);
      console.error('Error updating landing page image:', error);
    }
  };

  const updateLandingPage = async (updateData) => {
    try {
      const headers = getHeaders();
      setLoading(true);

      const storedData = JSON.parse(localStorage.getItem('landingPageData')) || {};

      // Create the update payload with both the stored data and the updateData
      const updatedMainParagraph = updateData.mainParagraph || storedData.mainParagraph;
      const updatedFreePlanFeatures = updateData.freePlanFeatures || storedData.freePlanFeatures;
      const updatedPremiumPlanFeatures = updateData.premiumPlanFeatures || storedData.premiumPlanFeatures;
      const updatedVideoLink = updateData.videoLink || storedData.videoLink;
      const updatedMissionParagraph = updateData.missionParagraph || storedData.missionParagraph;
      const updatedContactEmail = updateData.contactEmail || storedData.contactEmail;
      const updatedContactPhone = updateData.contactPhone || storedData.contactPhone;
      const updatedContactAddress = updateData.contactAddress || storedData.contactAddress;

      const updatePayload = {
        landing_page: {
          main_page: { paragraph1: updatedMainParagraph },
          plans: [
            {
              free_plan: { description: updatedFreePlanFeatures },
              paid_plan: { description: updatedPremiumPlanFeatures },
            }
          ],
          video_link: [{ demo: updatedVideoLink }],
          our_mission: { paragraph1: updatedMissionParagraph },
          contact: {
            email: updatedContactEmail,
            phone: updatedContactPhone,
            address: updatedContactAddress
          }
        }
      };

      const updateResponse = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/string/update',
        updatePayload,
        { headers }
      );

      setLoading(false);
      onUpdateSuccess();
      // console.log('API Response:', updateResponse.data);

      // Update local storage with the new data
      localStorage.setItem('landingPageData', JSON.stringify({
        mainParagraph: updatedMainParagraph,
        freePlanFeatures: updatedFreePlanFeatures,
        premiumPlanFeatures: updatedPremiumPlanFeatures,
        videoLink: updatedVideoLink,
        missionParagraph: updatedMissionParagraph,
        contactEmail: updatedContactEmail,
        contactPhone: updatedContactPhone,
        contactAddress: updatedContactAddress
      }));

      // After updating, update the state to ensure synchronization
      setMainParagraph(updatedMainParagraph);
      setFreePlanFeatures(updatedFreePlanFeatures);
      setPremiumPlanFeatures(updatedPremiumPlanFeatures);
      setVideoLink(updatedVideoLink);
      setMissionParagraph(updatedMissionParagraph);
      setContactEmail(updatedContactEmail);
      setContactPhone(updatedContactPhone);
      setContactAddress(updatedContactAddress);

    } catch (error) {
      setLoading(false);
      onError(error);
      console.error('Error updating landing page:', error);
    }
  };

  return {
    mainParagraph,
    freePlanFeatures,
    premiumPlanFeatures,
    videoLink,
    missionParagraph,
    contactEmail,
    contactPhone,
    contactAddress,
    images,
    loading,
    fetchLandingPageData,
    updateLandingPage,
    updateLandingPageImage
  };
};

export default LandingPageAPIUtils;
