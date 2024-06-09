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
    navigate('/BusinessUserHomepage'); 
  };

  const handleEditClick = () => {
    navigate('/updateaccount');
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
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

  const fieldContainerStyle = {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center"
  };

  const labelStyle = {
    fontWeight: "bold",
    marginRight: "10px",
    minWidth: "150px" // Ensure labels have a minimum width to align values
  };

  const valueStyle = {
    backgroundColor: "#ccc5c5",
    padding: "10px",
    borderRadius: "5px",
    display: "inline-block",
    flexGrow: 1 // Ensure values take the remaining space
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "600px", // Set a max width to align buttons properly
    marginTop: "20px"
  };

  const buttonStyle = {
    backgroundColor: '#ccc5c5',
    color: '#333',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '5px',
    flex: 1, // Ensure buttons take equal space
    margin: '0 5px',
    transition: 'background-color 0.3s, color 0.3s', // Add transition for smooth color change
  };
  // Function to handle mouse enter event
  const handleMouseEnter = (event) => {
  event.target.style.backgroundColor = '#a39d9d'; // Change background color on hover
  event.target.style.color = '#fff'; // Change text color on hover
  };

// Function to handle mouse leave event
  const handleMouseLeave = (event) => {
  event.target.style.backgroundColor = '#ccc5c5'; // Restore background color on mouse leave
  event.target.style.color = '#333'; // Restore text color on mouse leave
  };

  const hrStyle = {
    width: "100%",
    borderTop: "2px solid #ccc5c5",
    margin: "20px 0"
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Topbar title="My Profile" onClick={handleGoBack} />
      <div className="flex flex-col items-center mt-10">
        <div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>First Name</span>
            <span style={valueStyle}>{accountDetails.first_name}</span>
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Last Name</span>
            <span style={valueStyle}>{accountDetails.last_name}</span>
          </div>
          <hr style={hrStyle} />
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Email</span>
            <span style={valueStyle}>{accountDetails.email}</span>
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Date of Birth</span>
            <span style={valueStyle}>{formatDate(accountDetails.dob)}</span>
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Job Industry</span>
            <span style={valueStyle}>{jobIndustryMapping[accountDetails.job_industry_id]}</span>
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Subscription</span>
            <span style={valueStyle}>{accountDetails.role}</span>
          </div>
          <hr style={hrStyle} />
        </div>
        <div style={buttonContainerStyle}>
          <button 
            onClick={handleEditClick}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            Edit Account
          </button>
          <button 
            onClick={handleEditClick}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            Change to Normal User
          </button>
          <button 
            onClick={handleChangePassword}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAccount;
