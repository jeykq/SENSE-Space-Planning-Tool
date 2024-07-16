import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils';

const ContactUs = () => {
  const {
    contactEmail,
    contactPhone,
    contactAddress,
    fetchLandingPageData,
  } = LandingPageAPIUtils({
    onUpdateSuccess: () => {},
    onError: (error) => {
      console.error('Error fetching contact data:', error);
    },
  });

  useEffect(() => {
    // Fetch initial data for ContactUs component
    fetchLandingPageData();
  }, []);

  return (
    <div name='contactUs' className='text-black text-center mx-auto max-w-screen-lg p-6'>
      <div className='bg-white shadow-lg rounded-lg p-10'>
        <h1 className='text-4xl font-semibold mb-10 text-blue-700'>Contact Us</h1>
        <p className='text-lg my-10 leading-relaxed'>
          For inquiries, feedback, or assistance, please feel free to contact us using the following methods:
        </p>
        <ul className='text-lg space-y-4'>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📧</span>
            <a href={`mailto:${contactEmail}`} className='text-blue-600 hover:underline'>{contactEmail}</a>
          </li>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📞</span>
            <a href={`tel:${contactPhone}`} className='text-blue-600 hover:underline'>{contactPhone}</a>
          </li>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📍</span>
            {contactAddress}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContactUs;
