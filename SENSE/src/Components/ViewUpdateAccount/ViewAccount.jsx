import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';

const ViewAccount = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous page
  };

  const handleEditClick = () => {
    // Handle the click event for the Edit button
    // For example, navigate to the edit page
    navigate('/updateaccount');
  };

  // Example data, replace with actual data from props or state
  const accountDetails = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    dateOfBirth: '1990-01-01',
    jobIndustry: 'Interior Designer',
    subscription: 'Premium',
  };

  const bgColor = "#e4e0e0"; // Custom background color
  const borderColor = "#666"; // Light black color
  const headerBgColor = "#ccc5c5"; // Background color for table header

  return (
    <div>
      <Topbar title="My Profile" onClick={handleGoBack} />
      <div className="flex flex-col items-center mt-20">
        <div className="flex-grow flex items-center justify-center p-4">
          <table className="min-w-full rounded-lg overflow-auto" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <thead style={{ backgroundColor: headerBgColor }}>
              <tr>
                <th className="py-2 px-4 border" style={{ borderColor }}>First Name</th>
                <th className="py-2 px-4 border" style={{ borderColor }}>Last Name</th>
                <th className="py-2 px-4 border" style={{ borderColor }}>Email</th>
                <th className="py-2 px-4 border" style={{ borderColor }}>Date of Birth</th>
                <th className="py-2 px-4 border" style={{ borderColor }}>Job Industry</th>
                <th className="py-2 px-4 border" style={{ borderColor }}>Subscription</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.firstName}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.lastName}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.email}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.dateOfBirth}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.jobIndustry}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.subscription}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={handleEditClick} className="mt-4 text-gray-800 font-semibold py-2 px-4 rounded" style={{ backgroundColor: '#ccc5c5', color: '#333', ':hover': { backgroundColor: '#900', color: '#fff' } }}>
          Edit
        </button>




      </div>
    </div>
  );
};

export default ViewAccount;
