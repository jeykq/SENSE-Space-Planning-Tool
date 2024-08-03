import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/BULogo.png';

interface TopbarProps {
  title: string;
  onClick: () => void;
}

const Topbar = ({ title, onClick }: TopbarProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/BusinessUserHomepage');
  };
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
      <div onClick={() => onClick()} className="flex items-center cursor-pointer text-xl px-6 py-4 mr-4 hover:scale-125 duration-100">
        x  
      </div>
    </div>
  );
}

export default Topbar;