import React, { useState, useEffect } from 'react';
import backgroundImage from '../../assets/p2.png';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils'; // Adjust import path as necessary

const Sense = () => {
  const { mainParagraph, fetchLandingPageData } = LandingPageAPIUtils({
    onUpdateSuccess: () => {}, // Define success callback if needed
    onError: (error) => {
      console.error('Error fetching data for Sense component:', error);
      // Handle error as needed (e.g., display error message)
    }
  });

  useEffect(() => {
    // Fetch initial data for Sense component
    fetchLandingPageData();
  }, []);

  return (
    <div
      name='sense'
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 0, 58, 0.7), rgba(8, 0, 58, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className='text-center mx-auto max-w-screen-lg'>
        <h1 className='text-6xl font-semibold'>SENSE SPACES Planning Tool</h1>
        <p className='text-justify text-lg max-w-[800px] my-10 md:my-20 leading-relaxed'>
          {mainParagraph}
        </p>
      </div>
    </div>
  );
}

export default Sense;
