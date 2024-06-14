import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import ProfileDropdown from './ProfileDropdown';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const Navbar = () => {
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
    }
    const handleScroll = () => {
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
  const confirmLogout = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { 
      'Content-Type': 'application/json',
      'sense-token': token
    };
    
    try {
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/logout',
        {},
        { headers: headers }
      );

      if (response.status === 200) {
        localStorage.removeItem('authToken');
        navigate('/');
      }
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar bg-black w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between z-10 ${sticky ? 'bg-black duration-75' : ''}`}>
      <img src={logo} alt="logo" className='logo w-20 mx-2' />
      <div className="flex items-center space-x-4 ml-auto">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer rounded px-4 py-2"
            style={{ backgroundColor: '#cfe5fd' }}
                onMouseEnter={(e) => { 
                  e.target.style.backgroundColor = '#bcd7ff';
                  e.target.style.color = '#0034c3';
                 }}
                onMouseLeave={(e) => { 
                  e.target.style.backgroundColor = '#cfe5fd';
                  e.target.style.color = '#333';
                }}
          >
            Manage
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 w-48 text-black bg-white rounded-md shadow-lg z-20 right-0">
              <div className="py-1">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center" onClick={() => handleNavigate('/landing-page')}>Landing Page</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-t border-gray-300" onClick={() => handleNavigate('/manageSingUpPage')}>Signup Page</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-t border-gray-300" onClick={() => handleNavigate('/manageObjectCategories')}>Object Categories</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-t border-gray-300" onClick={() => handleNavigate('/manageTags')}>Tags</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-t border-gray-300" onClick={() => handleNavigate('/manageRoomTypes')}>Room Types</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-t border-gray-300" onClick={() => handleNavigate('/business-applications')}>Business Applications</button>
              </div>
            </div>
          )}
        </div>
        <ProfileDropdown onLogout={handleLogout} />
      </div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      
      {showPopup && <ConfirmDialogPopup 
      title={"Confirm Logout"} 
      text={"Are you sure you want to log out?"} 
      onConfirm={ () => {
        setShowPopup(false);
        confirmLogout();
      }} 
      onClose={()=>setShowPopup(false)}/>}    
      </nav>
  );
}

export default Navbar;
