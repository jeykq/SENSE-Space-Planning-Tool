import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingSense from './LandingSense';
import LandingFreePlan from './LandingFreePlan';

const SA_UpdateLandingPage = () => {
  const [sticky, setSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <nav className={`navbar bg-black w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between z-20 ${sticky ? 'bg-black duration-75' : ''}`}>
        <div className="flex-1">
          {/* Left side content can go here */}
        </div>
        <div className="flex-1 flex justify-center">
          {/* Pass down the go back function */}
          <button className="bg-red-500 hover:bg-red-700 text-white rounded px-4 py-2 my-2">Update Landing Page</button>
        </div>
        <div className="flex-1 flex justify-end">
          <button onClick={handleGoBack} className="text-white text-xl px-4">
            x
          </button>
        </div>
      </nav>

      {/* Adding enough margin-top to ensure LandingNavbar is not overlapped */}
      <div className="mt-10">
        <LandingNavbar />
        <LandingSense />
        <LandingFreePlan />
      </div>
    </div>
  );
}

export default SA_UpdateLandingPage;
