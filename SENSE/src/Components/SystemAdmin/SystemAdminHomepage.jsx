import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import Footer from "../Landing/Footer";
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const SystemAdminHomepage = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(9); // Number of accounts per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const headers = getHeaders();
        if (!headers) {
          setError('Token not found');
          return;
        }

        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/user/list', 
          {}, 
          { headers }
        );

        if (!response.data) {
          throw new Error('No data returned');
        }

        const sortedAccounts = response.data.body.sort((a, b) => {
          // Sort alphabetically based on username
          return a.first_name.localeCompare(b.first_name);
        });

        setAccountDetails(sortedAccounts);
        setFilteredAccounts(sortedAccounts); // Initially, set filtered accounts same as all accounts
      } catch (error) {
        console.error('Error fetching user accounts details:', error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  const buttonStyle = {
    padding: "8px 16px",
    margin: "0 5px",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    outline: "none",
  };

  // Get current accounts
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = (user) => {
    // Define the action to perform when "View" button is clicked
    // For example, navigate to a page to view user details
    console.log("View button clicked for user:", user);
  };

  const handleSuspend = (user) => {
    // Define the action to perform when "Suspend" button is clicked
    // For example, suspend the user's account
    console.log("Suspend button clicked for user:", user);
  };

  const filterByRole = (role) => {
    if (role === 'All') {
      setFilteredAccounts(accountDetails); // Reset to show all accounts
    } else {
      const filtered = accountDetails.filter(user => user.role === role);
      setFilteredAccounts(filtered);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };
  


  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <Navbar />
      <div className="mt-20" style={{ paddingTop: "30px", paddingLeft: "20px" }}>
        {/* <p style={{ fontSize: "20px", fontWeight: "500" }}>Search Users</p> */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchBar />
        </div>
      </div>

      <div style={{ marginTop: "20px", paddingLeft: "20px" }}>
        {/* Filter buttons */}
        <div style={{ marginBottom: "10px" }}>
          <button style={buttonStyle} onClick={() => filterByRole('All')}>All</button>
          <button style={buttonStyle} onClick={() => filterByRole('FREE_USER')}>Free User</button>
          <button style={buttonStyle} onClick={() => filterByRole('PREMIUM_USER')}>Premium User</button>
          <button style={buttonStyle} onClick={() => filterByRole('BUSINESS_USER')}>Business User</button>
          <button style={buttonStyle} onClick={() => filterByRole('SYS_ADMIN')}>System Admin</button>
        </div>
        
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid black" }}>Username</th>
              <th style={{ borderBottom: "1px solid black" }}>Email</th>
              <th style={{ borderBottom: "1px solid black" }}>Role</th>
              <th style={{ borderBottom: "1px solid black" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((user, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {user.first_name} {user.last_name}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{user.email}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{user.role}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                <button style={{ 
                  marginRight: "5px",
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  outline: "none",
                  textDecoration: "none", // Remove underline on hover
                  transition: "background-color 0.3s", // Smooth transition on hover
                }} onClick={() => handleView(user)}>View</button>

                <button style={{ 
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  outline: "none",
                  textDecoration: "none", // Remove underline on hover
                  transition: "background-color 0.3s", // Smooth transition on hover
                }} onClick={() => handleSuspend(user)}>Suspend</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: Math.ceil(filteredAccounts.length / accountsPerPage) }, (_, index) => (
            <li key={index} style={{ margin: '0 5px', cursor: 'pointer' }}>
              <a onClick={() => paginate(index + 1)} style={{ textDecoration: 'none' }}>{index + 1}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default SystemAdminHomepage;
