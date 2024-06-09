import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password change logic here
    console.log('Form submitted');
  };

  return (
    <div>
      <Topbar title="Change Password" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="rounded-lg p-8 max-w-md w-full" style={{ backgroundColor: '#d1caca' }}>
          <h2 className="text-3xl text-center mb-4">Change Password</h2>

          <form onSubmit={handleSubmit} className="w-full">
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="text" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" placeholder="Email" readOnly />
            </div>
            <div className="mb-4 ">
                <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                <input type="password" id="oldPassword" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div className="mb-4 ">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                <input type="password" id="newPassword" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="mb-4 ">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input type="password" id="confirmPassword" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="flex items-center justify-center mt-4">
              <button 
                  className="mt-4 text-gray-800 font-semibold py-2 px-4 rounded bg-gray-300 transition-colors duration-300"
                  style={{ backgroundColor: '#b7b1b1' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#a39d9d'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#b7b1b1'; }}
              >
                  Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
