import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';

const UpdateAccount = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [industry, setIndustry] = useState('');
  const [errors, setErrors] = useState({});

  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation and save logic
    // Example:
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
    } else {
      // Clear errors and proceed with form submission
      setErrors({});
      // Add logic to save/update account details
    }
  };

  return (
    <div>
      <Topbar title="Update Account Details" onClick={handleGoBack} />
      <div className=" flex flex-col items-center justify-center mt-5">
        <h2 className="text-3xl text-center mb-4">Account Information</h2>
        <div className="flex-grow flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4 flex">
              <div className="w-1/2 mr-2">
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                <input type="text" id="firstName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="w-1/2 ml-2">
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                <input type="text" id="lastName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="text" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" placeholder="Email" value={email} readOnly />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
              <input type="password" id="password" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`} placeholder="Old Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <input type="password" id="confirmPassword" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
            </div>
            <div className="mb-4 flex">
              <div className="w-1/2 mr-2">
                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input type="date" id="dateOfBirth" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
              <div className="w-1/2 ml-2">
                <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">Job Industry</label>
                <select id="industry" name="industry" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={industry} onChange={(e) => setIndustry(e.target.value)} required >
                  <option value="" disabled hidden>-</option>
                  <option value="designer">Interior Designer</option>
                  <option value="educator">Educator</option>
                  <option value="whs">WHS</option>
                  <option value="supportworker">Support Worker</option>
                  <option value="parents">Parents</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center">
            <button className="mt-4 text-gray-800 font-semibold py-2 px-4 rounded" style={{ backgroundColor: '#ccc5c5', color: '#333', ':hover': { backgroundColor: '#900', color: '#fff' } }}>
            Save
            </button>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;
