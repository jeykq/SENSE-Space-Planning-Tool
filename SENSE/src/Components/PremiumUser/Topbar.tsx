import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/premiumLogo.png';

interface TopbarProps {
  title: string;
  onClick: () => void;
}

const Topbar = ({ title, onClick }: TopbarProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/PremiumUserHomepage');
  };

  const toggleTheme = () => {
    const existingTheme = localStorage.getItem('theme');
    if (existingTheme) {
        if (existingTheme == 'dark') {
          document.documentElement.classList.add("dark");
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem('theme', 'dark');
        }
    }
  }

  return (
    <div className="w-full bg-black text-white h-20 py-1 px-4 top-0 left-0 flex items-center justify-between max-h-20 z-10">
      <div className="flex items-center">
        <img
            src={logo}
            alt="logo"
            className='logo mx-2 cursor-pointer'
            style={{ width: '100px' }}
            onClick={handleLogoClick}
          />
      </div>
      <div className="flex-grow text-center text-xl font-medium">
        {title}
      </div>
      {/* <button type="button" className="px-3 py-2 mr-8 border border-white rounded" onClick={toggleTheme}>
        dark/light mode
      </button> */}
      <div onClick={() => onClick()} className="flex items-center cursor-pointer text-xl px-6 py-4 mr-4 hover:scale-125 duration-100">
        x  
      </div>
    </div>
  );
}

export default Topbar;