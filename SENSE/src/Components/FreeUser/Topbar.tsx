import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface TopbarProps {
  title: string;
  onClick: () => void;
}

const Topbar = ({ title, onClick }: TopbarProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/FreeUserHomepage');
  };
  return (
    <div className="w-full bg-black text-white h-20 py-1 px-4 top-0 left-0 flex items-center justify-between max-h-20 z-10">
      <div className="flex items-center">
        <img
            src={logo}
            alt="logo"
            className='logo w-20 mx-2 cursor-pointer'
            onClick={handleLogoClick}
          />
      </div>
      <div className="flex-grow text-center text-xl font-medium">
        {title}
      </div>
      <div onClick={() => onClick()} className="flex items-center cursor-pointer mr-4">
        x  
      </div>
    </div>
  );
}

export default Topbar;