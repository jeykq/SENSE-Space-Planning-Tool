import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';
import AlertPopup from '../UI/AlertPopup';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const headers = getHeaders();
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/user/get', 
          {}, 
          { headers }
        );

        if (!response.data) {
          throw new Error('No data returned');
        }

        setEmail(response.data.body.email);
      } catch (error) {
        console.error('Error fetching email details:', error);
        setAlertMessage('Error fetching email details');
        setAlertType('error');
        setIsAlertVisible(true);
      }
    };

    fetchEmail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const headers = getHeaders();
      const response = await axios.post('https://api.sensespacesplanningtool.com/user/update_password', {
        old_password: oldPassword,
        new_password: newPassword,
      }, { headers });

      if (response.status === 200) {
        setAlertMessage('Password Updated Successfully!');
        setAlertType('success');
        setIsAlertVisible(true);
      } else {
        setAlertMessage('Failed to change password. Please try again.');
        setAlertType('error');
        setIsAlertVisible(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Incorrect old password. Please try again.';
      setAlertMessage(errorMsg);
      setAlertType('error');
      setIsAlertVisible(true);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match!";
    }
    if (newPassword === oldPassword) {
      errors.newPassword = "Old Password and New Password are the same!";
    }

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharacters.test(newPassword)) {
      errors.newPassword = "Password must contain special characters!";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    if (alertType === 'success') {
      navigate('/viewaccount'); // Redirect to view account after successful password change
    }
  };

  return (
    <div>
      <Topbar title="Change Password" onClick={() => navigate(-1)} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="rounded-lg p-8 max-w-md w-full" style={{ backgroundColor: '#d1caca' }}>
          <h2 className="text-3xl text-center mb-4">Change Password</h2>
          {isAlertVisible && (
            <AlertPopup
              title={alertType === 'success' ? 'Success' : 'Error'}
              text={alertMessage}
              onClose={handleAlertClose}
              onOk={handleAlertClose}
            />
          )}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="text" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" placeholder="Email" value={email} readOnly />
            </div>
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
              <input type="password" id="oldPassword" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.oldPassword ? 'border-red-500' : ''}`} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              {errors.oldPassword && <p className="text-red-500 text-xs italic">{errors.oldPassword}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <input type="password" id="newPassword" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.newPassword ? 'border-red-500' : ''}`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input type="password" id="confirmPassword" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
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
