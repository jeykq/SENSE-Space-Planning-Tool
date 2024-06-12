import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    });

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    setShowPopup(true);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar bg-black text-white w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between z-10 ${sticky ? 'bg-black duration-75' : ''}`}>
      <img src={logo} alt="logo" className='logo w-20 mx-2' />
      <div className="flex items-center space-x-4 ml-auto">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="cursor-pointer bg-white text-black rounded px-4 py-2"
        >
          Manage
        </button>
        {dropdownOpen && (
          <div className="absolute mt-2 w-48 text-black bg-white rounded-md shadow-lg z-20 right-0">
            <div className="py-1">
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center" onClick={() => handleNavigate('/landing-page')}>Landing Page</button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-solid border-0 border-t border-gray-300" onClick={() => handleNavigate('/signup-page')}>Signup Page</button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-solid border-0 border-t border-gray-300" onClick={() => handleNavigate('/object-categories')}>Object Categories</button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-solid border-0 border-t border-gray-300" onClick={() => handleNavigate('/tags')}>Tags</button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-solid border-0 border-t border-gray-300" onClick={() => handleNavigate('/business-applications')}>Business Applications</button>
            </div>
          </div>
        )}
        </div>
        <ProfileDropdown onLogout={handleLogout} />
      </div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed lg:hidden ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div className={`h-screen w-52 lg:w-auto lg:max-h-20 bg-black bg-opacity-100 lg:bg-opacity-100 translate-y-[375px] lg:translate-y-0 ${sidebarOpen ? 'translate-x-4 sticky right-0 top-0' : 'translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'} duration-100 lg:translate-x-0 px-4`}>
        <ul className="flex flex-col lg:flex-row mb-4 mt-20 lg:mt-1" style={{ paddingTop: "10px" }}>
          <li className="flex items-center ml-auto">
            {/* Removed the redundant ProfileDropdown here */}
          </li>
        </ul>
      </div>
      {showPopup && <ConfirmDialogPopup title={"Confirm Logout"} text={"Are you sure you want to log out?"} onConfirm={() => navigate("/")} onClose={() => setShowPopup(false)} />}
    </nav>
  );
}

export default Navbar;
