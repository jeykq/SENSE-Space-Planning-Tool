import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils'; 

const OurMission = () => {
  const { missionParagraph, fetchLandingPageData } = LandingPageAPIUtils({
    onUpdateSuccess: () => {}, // Define success callback if needed
    onError: (error) => {
      console.error('Error fetching data for OurMission component:', error);
    }
  });

  useEffect(() => {
    // Fetch initial data for OurMission component
    fetchLandingPageData();
  }, []);

  return (
    <div name='ourMission' className='text-black text-center mx-auto max-w-screen-lg p-6'>
      <h1 className='text-4xl font-semibold mb-10 text-black'>Our Mission</h1>
      <p className='text-lg text-justify max-w-[800px] mt-10 md:mb-10 leading-relaxed mx-auto'>
        {missionParagraph}
      </p>
    </div>
  );
}

export default OurMission;
