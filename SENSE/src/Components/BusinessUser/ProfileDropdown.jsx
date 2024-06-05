import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewAccount = () => navigate('/viewaccount');

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="100" height="50" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute right-0 w-48 text-black bg-white rounded-md shadow-lg">
          <div className="py-1">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center " onClick={handleViewAccount}>View Account</button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center border-solid border-0 border-t border-blue-900" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default ProfileDropdown;