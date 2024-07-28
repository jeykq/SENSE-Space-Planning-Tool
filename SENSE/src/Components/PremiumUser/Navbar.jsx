import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/premiumLogo.png';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import ProfileDropdown from './ProfileDropdown';
import axios from 'axios'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogOut = async () => {
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

  const handleCreateRoomClick = () => {
    navigate('/PU_CreateRoom');
  };

  return (
    <nav className={`navbar bg-black text-white w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between h-20 z-10 ${sticky ? 'bg-black duration-75' : ''}`}>
      <img src={logo} alt="" className='logo mx-2' style={{ width: '100px' }} />
      <div className="flex items-center justify-end w-full">
        <button
          className="bg-white hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mx-2"
          style={{ borderRadius: "6px", backgroundColor: 'rgb(124 58 237)' }}
          onClick={handleCreateRoomClick}
        >
          Create a room
        </button>
        <ProfileDropdown onLogout={handleLogOut} />
      </div>
      {showPopup && <ConfirmDialogPopup
        title={"Confirm Logout"}
        text={"Are you sure you want to log out?"}
        onConfirm={() => {
          setShowPopup(false);
          confirmLogout();
        }}
        onClose={() => setShowPopup(false)}
      />}
    </nav>
  );
};

export default Navbar;
