import React, { useEffect, useState } from 'react';
import { Link } from "react-scroll";
import logo from "../../assets/logo.png";

interface TopbarProps {
  title: string;
  onClick: () => void;
}

const Topbar = ({ title, onClick }: TopbarProps) => {
  return (
    <div className="w-full bg-black text-white h-20 py-1 px-4 top-0 left-0 flex items-center justify-between max-h-20 z-10">
      <div className="flex items-center">
        <img src={logo} alt="" className='logo w-20 mx-2' />
      </div>
      <div className="flex-grow flex justify-center">
        {title}
      </div>
      <div onClick={() => onClick()} className="flex items-center cursor-pointer">
        x
      </div>
    </div>
  );
}

export default Topbar;