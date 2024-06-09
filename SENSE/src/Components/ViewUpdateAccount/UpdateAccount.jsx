import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';
import AlertPopup from '../UI/AlertPopup'; // Adjust the import path according to your project structure

const UpdateAccount = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const headers = getHeaders();

    if (!headers) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/user/get', 
          {}, 
          { headers }
        );

        if (!response.data) {
          throw new Error('No data returned');
        }

        const accountDetails = response.data.body;
        setFirstName(accountDetails.first_name);
        setLastName(accountDetails.last_name);
        setEmail(accountDetails.email);
        setDateOfBirth(accountDetails.dob.split('T')[0]); // Format date to YYYY-MM-DD
        setIndustry(accountDetails.job_industry_id);
      } catch (error) {
        console.error('Error fetching account details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = getHeaders();
    const payload = {
      first_name: firstName,
      last_name: lastName,
      dob: dateOfBirth,
      job_industry_id: industry,
    };

    try {
      await axios.post(
        'https://api.sensespacesplanningtool.com/user/update',
        payload,
        { headers }
      );
      setIsAlertVisible(true);
    } catch (error) {
      console.error('Error updating account:', error);
      setError(error.message);
    }
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const handleAlertOk = () => {
    setIsAlertVisible(false);
    navigate('/viewaccount');
  };

  const jobIndustryOptions = [
    { value: '1', label: 'Educator' },
    { value: '2', label: 'Interior Designer' },
    { value: '3', label: 'WHS' },
    { value: '4', label: 'Support Worker' },
    { value: '5', label: 'Parents' },
    { value: '0', label: 'Others' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Topbar title="Update Account Details" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
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
            <div className="mb-4 flex">
              <div className="w-1/2 mr-2">
                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input type="date" id="dateOfBirth" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
              <div className="w-1/2 ml-2">
                <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">Job Industry</label>
                <select id="industry" name="industry" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
                  <option value="" disabled hidden>-</option>
                  {jobIndustryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button className="mt-4 text-gray-800 font-semibold py-2 px-4 rounded" style={{ backgroundColor: '#ccc5c5', color: '#333' }}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {isAlertVisible && (
        <AlertPopup
          title="Success"
          text="Account Updated Successfully"
          onClose={handleAlertClose}
          onOk={handleAlertOk}
        />
      )}
    </div>
  );
};

export default UpdateAccount;
