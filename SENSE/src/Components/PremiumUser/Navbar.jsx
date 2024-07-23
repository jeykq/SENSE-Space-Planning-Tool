import React, { useEffect, useState } from 'react';
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/premiumLogo.png';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import ProfileDropdown from './ProfileDropdown';
import axios from 'axios'; 
import { getHeaders } from '../../../apiUtils';

const Navbar = () => {
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    });
  }, []);

  const handleLogOut = async (e) => {
    setShowPopup(true);

    const headers = getHeaders();
    const response = await axios.post(
      'https://api.sensespacesplanningtool.com/logout',
      {},
      { headers }
    );
    if (response.status === 200) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
  };

  const handleCreateRoomClick = () => {
    navigate('/PU_CreateRoom');
  };

  return (
    <nav className={`navbar bg-black text-white w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between z-10 ${sticky ? 'bg-black duration-75' : ''}`}>
      <div className="flex items-center">
        <img src={logo} alt="" className='logo mx-2' style={{ width: '100px' }}/>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div className={`h-screen w-52 lg:w-auto lg:max-h-20 bg-black bg-opacity-100 lg:bg-opacity-100 translate-y-[375px] lg:translate-y-0 ${sidebarOpen ? 'translate-x-4 sticky right-0 top-0' : 'translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'} duration-100 lg:translate-x-0 px-4`}>
        <ul className="flex flex-col lg:flex-row mb-4 mt-20 lg:mt-1">
          <li className="py-4 px-2 my-1.5 mx-2 lg:mx-5 text-base text-nowrap">
            <Link onClick={() => setSidebarOpen(false)} to='Recent Designs' smooth={true} offset={0} duration={500}>
              Recent Designs
            </Link>
          </li>
          <li className="py-4 px-2 my-1.5 mx-2 lg:mx-5 text-base text-nowrap">
            <Link onClick={() => setSidebarOpen(false)} to='Favourited' smooth={true} offset={0} duration={500}>
              Favourited
            </Link>
          </li>
          <li className="flex items-center px-2 ml-1 my-1.5 mx-1 lg:mx-1 text-base text-nowrap">
            <button
              className="bg-white hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              style={{ borderRadius: "6px", backgroundColor: 'rgb(124 58 237)' }}
              onClick={handleCreateRoomClick}
            >
              Create a room
            </button>
          </li>
          <li className="flex items-center ml-auto">
            <ProfileDropdown onLogout={handleLogOut} />
          </li>
        </ul>
      </div>
      {showPopup && <ConfirmDialogPopup title={"Confirm Logout"} text={"Are you sure you want to log out?"} onConfirm={() => navigate("/")} onClose={() => setShowPopup(false)} />}
    </nav>
  );
}

export default Navbar;
