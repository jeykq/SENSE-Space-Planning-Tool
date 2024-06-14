import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';
import Topbar from '../BusinessUser/Topbar';

const SA_ViewUserAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobIndustryMapping, setJobIndustryMapping] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const headers = getHeaders(); // Assuming you have a function to get headers
        if (!headers) {
          setError('Token not found');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/user/list',
          {},
          { headers }
        );

        if (!response.data || !Array.isArray(response.data.body)) {
          throw new Error('Invalid response format');
        }

        const user = response.data.body.find(user => user.id === parseInt(id, 10));

        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }

        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobIndustries = async () => {
      try {
        const storedJobIndustries = localStorage.getItem('jobIndustries');
        if (storedJobIndustries) {
          setJobIndustryMapping(JSON.parse(storedJobIndustries));
        } else {
          const headers = getHeaders();
          const response = await axios.post(
            'https://api.sensespacesplanningtool.com/job_industry/list', 
            {}, 
            { headers }
          );

          if (!response.data || !response.data.body) {
            throw new Error('No job industries data returned');
          }

          const jobIndustryMap = {};
          response.data.body.forEach(job => {
            jobIndustryMap[job.id] = job.name;
          });

          localStorage.setItem('jobIndustries', JSON.stringify(jobIndustryMap));
          setJobIndustryMapping(jobIndustryMap);
        }
      } catch (error) {
        console.error('Error fetching job industries:', error);
        setError(error.message);
      }
    };

    fetchUserDetails();
    fetchJobIndustries();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Topbar title="User Details" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="rounded-lg p-8 max-w-md w-full bg-gray-300 shadow">
          <h2 className="text-3xl text-center mb-4">User Information</h2>
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="mb-4 flex">
                <div className="w-1/2 mr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                  <span className="input-value bg-gray-100 rounded w-full py-2 px-3 border shadow text-gray-700 block">{userDetails.first_name}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                  <span className="input-value bg-gray-100 rounded w-full py-2 px-3 border shadow text-gray-700 block">{userDetails.last_name}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <span className="input-value bg-gray-100 rounded w-full py-2 px-3 border shadow text-gray-700 block">{userDetails.email}</span>
              </div>
              <div className="mb-4 flex">
                <div className="w-1/2 mr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                  <span className="input-value bg-gray-100 rounded w-full py-2 px-3 border shadow text-gray-700 block">{userDetails.dob.split('T')[0]}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Job Industry</label>
                  <span className="input-value bg-gray-100 rounded w-full py-2 px-3 border shadow text-gray-700 block">{jobIndustryMapping[userDetails.job_industry_id]}</span>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label className="block text-gray-700 text-base font-bold mb-2 mr-1.5">User Type</label>
                <span className="input-value bg-gray-100 rounded ml-2 w-auto py-2 px-3 border shadow text-gray-700 block">{userDetails.role}</span>
              </div>
              <div className="flex items-center justify-center">
              <button 
  className="mt-4 text-gray-800 font-semibold py-2 px-4 rounded bg-gray-200 transition-colors duration-300 hover:bg-gray-400 hover:text-white"
>
  Save
</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SA_ViewUserAccount;
