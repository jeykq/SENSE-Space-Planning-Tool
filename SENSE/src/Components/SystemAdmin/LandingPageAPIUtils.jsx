import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const LandingPageAPIUtils = ({ onUpdateSuccess, onError }) => {
  const [mainParagraph, setMainParagraph] = useState('');
  const [freePlan, setFreePlan] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainParagraph();
    fetchFreePlan();
  }, []);

  const fetchMainParagraph = async () => {
    try {
      const headers = getHeaders();
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/get',
        null,
        { headers }
      );

      // Check the response structure
      if (
        response.data &&
        response.data.body &&
        response.data.body.string &&
        response.data.body.string.main_page &&
        response.data.body.string.main_page.paragraph1
      ) {
        const fetchedParagraph = response.data.body.string.main_page.paragraph1;
        setMainParagraph(fetchedParagraph);
      } else {
        throw new Error('Main paragraph data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching main paragraph:', error);
      onError(error);
    }
  };

  const fetchFreePlan = async () => {
    try {
      const headers = getHeaders();
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/get',
        null,
        { headers }
      );

      // Check the response structure
      if (
        response.data &&
        response.data.body &&
        response.data.body.string &&
        response.data.body.string.plans &&
        response.data.body.string.plans.free_plan &&
        response.data.body.string.plans.free_plan.description
      ) {
        const fetchedFreePlan = response.data.body.string.plans.free_plan.description;
        setFreePlan(fetchedFreePlan);
      } else {
        throw new Error('Free User plan data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching free plan description:', error);
      onError(error);
    }
  };

  const updateLandingPage = async (updateData) => {
    try {
      const headers = getHeaders();
      setLoading(true);

      const updateResponse = await axios.post(
        'https://api.sensespacesplanningtool.com/landing_page/string/update',
        { landing_page: { main_page: { paragraph1: updateData } } },
        { headers }
      );

      setLoading(false);
      onUpdateSuccess();
      console.log('API Response:', updateResponse.data);

      // After updating, fetch the main paragraph again to ensure synchronization
      await fetchMainParagraph();
    } catch (error) {
      setLoading(false);
      onError(error);
      console.error('Error updating landing page:', error);
    }
  };

  return { mainParagraph, freePlan, loading, fetchMainParagraph, updateLandingPage };
};

export default LandingPageAPIUtils;