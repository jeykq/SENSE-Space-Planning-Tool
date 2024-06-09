import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function

const ViewAccount = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous page
  };

  const handleEditClick = () => {
    navigate('/updateaccount');
  };

  useEffect(() => {
    const headers = getHeaders(); // Get headers using the function

    if (!headers) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    // Fetch user data from API using Axios
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/user/get', 
          {}, 
          { headers });

        if (!response.data) {
          throw new Error('No data returned');
        }

        setAccountDetails(response.data.body);
      } catch (error) {
        console.error('Error fetching account details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const jobIndustryMapping = {
    1: "Educator",
    2: "Interior Designer",
    3: "WHS",
    4: "Support Worker",
    5: "Parents",
    0: "Others"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const bgColor = "#e4e0e0"; // Custom background color
  const borderColor = "#666"; // Light black color
  const headerBgColor = "#ccc5c5"; // Background color for table header

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.first_name}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.last_name}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.email}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{formatDate(accountDetails.dob)}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{jobIndustryMapping[accountDetails.job_industry_id]}</td>
                <td className="py-2 px-4 border" style={{ borderColor }}>{accountDetails.role}</td>
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
