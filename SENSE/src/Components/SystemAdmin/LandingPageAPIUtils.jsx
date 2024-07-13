import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const LandingPageAPIUtils = ({ onUpdateSuccess, onError }) => {
  const [mainParagraph, setMainParagraph] = useState('');
  const [freePlanFeatures, setFreePlanFeatures] = useState([]);
  const [premiumPlanFeatures, setPremiumPlanFeatures] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [missionParagraph, setMissionParagraph] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('landingPageData');
    if (storedData) {
      const { mainParagraph, freePlanFeatures, premiumPlanFeatures, videoLink, missionParagraph } = JSON.parse(storedData);
      setMainParagraph(mainParagraph);
      setFreePlanFeatures(freePlanFeatures);
      setPremiumPlanFeatures(premiumPlanFeatures);
      setVideoLink(videoLink);
      setMissionParagraph(missionParagraph);
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
        response.data.body.string.our_mission.paragraph1
      ) {
        const fetchedParagraph = response.data.body.string.main_page.paragraph1;
        const plans = response.data.body.string.plans[0];
        const fetchedFreePlanFeatures = plans.free_plan.description;
        const fetchedPremiumPlanFeatures = plans.paid_plan.description;
        const fetchedVideoLink = response.data.body.string.video_link[0].demo;
        const fetchedMissionParagraph = response.data.body.string.our_mission.paragraph1;

        setMainParagraph(fetchedParagraph);
        setFreePlanFeatures(fetchedFreePlanFeatures);
        setPremiumPlanFeatures(fetchedPremiumPlanFeatures);
        setVideoLink(fetchedVideoLink);
        setMissionParagraph(fetchedMissionParagraph);

        // Save data to local storage
        localStorage.setItem('landingPageData', JSON.stringify({
          mainParagraph: fetchedParagraph,
          freePlanFeatures: fetchedFreePlanFeatures,
          premiumPlanFeatures: fetchedPremiumPlanFeatures,
          videoLink: fetchedVideoLink,
          missionParagraph: fetchedMissionParagraph
        }));
      } else {
        throw new Error('Required data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching landing page data:', error);
      onError(error);
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
          our_mission: { paragraph1: updatedMissionParagraph }
        }
      };

      const updateResponse = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/string/update',
        updatePayload,
        { headers }
      );

      setLoading(false);
      onUpdateSuccess();
      console.log('API Response:', updateResponse.data);

      // Update local storage with the new data
      localStorage.setItem('landingPageData', JSON.stringify({
        mainParagraph: updatedMainParagraph,
        freePlanFeatures: updatedFreePlanFeatures,
        premiumPlanFeatures: updatedPremiumPlanFeatures,
        videoLink: updatedVideoLink,
        missionParagraph: updatedMissionParagraph
      }));

      // After updating, update the state to ensure synchronization
      setMainParagraph(updatedMainParagraph);
      setFreePlanFeatures(updatedFreePlanFeatures);
      setPremiumPlanFeatures(updatedPremiumPlanFeatures);
      setVideoLink(updatedVideoLink);
      setMissionParagraph(updatedMissionParagraph);

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
    loading,
    fetchLandingPageData,
    updateLandingPage
  };
};

export default LandingPageAPIUtils;
