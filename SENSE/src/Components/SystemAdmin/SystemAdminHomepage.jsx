import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import Footer from "../Landing/Footer";
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';
import ConfirmDialogPopup from '../UI/ConfirmDialog';

const SystemAdminHomepage = () => {
  const [accountDetails, setAccountDetails] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(7); // Number of accounts per page
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Track the current user being suspended/unsuspended
  const [showSuspendedAccounts, setShowSuspendedAccounts] = useState(false); // Manage suspended accounts view

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

  // Handle search input change
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm.toLowerCase());
    
    const results = accountDetails.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
    setCurrentPage(1); // Reset to first page after searching
  };

  // Get current accounts based on search term and pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = searchTerm.length > 0 ? searchResults.slice(indexOfFirstAccount, indexOfLastAccount) : filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view action (optional)
  const handleView = (userId) => {
    console.log("View button clicked for user:", userId);
  };

  const handleSuspend = (userId) => {
    setCurrentUser(userId);
    setShowConfirmDialog(true);
  };

  const confirmSuspend = async () => {
    if (!currentUser) return;

    try {
      const headers = getHeaders();
      if (!headers) {
        setError('Token not found');
        return;
      }

      const user = accountDetails.find(user => user.id === currentUser);
      const updatedStatus = !user.is_active;

      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/user/update/is_active',
        { id: currentUser, is_active: updatedStatus },
        { headers }
      );

      if (response.data) {
        const updatedAccounts = accountDetails.map(user =>
          user.id === currentUser ? { ...user, is_active: updatedStatus } : user
        );

        setAccountDetails(updatedAccounts);
        setFilteredAccounts(updatedAccounts);
      }

      setShowConfirmDialog(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error suspending user:', error);
      setError(error.message);
    }
  };

  // Filter by role function
  const filterByRole = (role) => {
    if (role === 'All') {
      setFilteredAccounts(accountDetails); // Reset to show all accounts
    } else {
      const filtered = accountDetails.filter(user => user.role === role);
      setFilteredAccounts(filtered);
    }
    setShowSuspendedAccounts(false); // Reset the suspended accounts view
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Filter suspended accounts function
  const filterSuspendedAccounts = () => {
    const suspendedAccounts = accountDetails.filter(user => !user.is_active);
    setFilteredAccounts(suspendedAccounts);
    setShowSuspendedAccounts(true);
    setCurrentPage(1); // Reset to first page after filtering
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-10 mx-5 flex items-center pt-8 pl-5">
        <p className="text-lg font-medium">Search Users</p>
        <div className="ml-4">
          <SearchBar handleSearch={handleSearch} />
        </div>
      </div>

      <div className="mt-5 ml-5 pl-5 flex-grow">
        {/* Filter buttons */}
        <div className="mb-2">
          <button className="px-4 py-2 mr-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none" onClick={() => filterByRole('All')}>All</button>
          <button className="px-4 py-2 mr-2 text-sm font-bold text-white bg-purple-500 rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none" onClick={() => filterByRole('FREE_USER')}>Free User</button>
          <button className="px-4 py-2 mr-2 text-sm font-bold text-white bg-orange-500 rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none" onClick={() => filterByRole('PREMIUM_USER')}>Premium User</button>
          <button className="px-4 py-2 mr-2 text-sm font-bold text-white bg-indigo-500 rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none" onClick={() => filterByRole('BUSINESS_USER')}>Business User</button>
          <button className="px-4 py-2 mr-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none" onClick={() => filterByRole('SYS_ADMIN')}>System Admin</button>
          <button className="ml-10 px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 focus:bg-gray-600 focus:outline-none" onClick={filterSuspendedAccounts}>Suspended Accounts</button>
        </div>

        {searchResults.length === 0 && searchTerm.length > 0 ? (
          <div className="mt-5 text-center text-gray-500">
            <p>No user account matches the search criteria!</p>
          </div>
        ) : (
          <table className="w-full mt-3 border-collapse">
            <thead>
              <tr>
                <th className="text-left border-b border-t border-gray-300 p-2">Username</th>
                <th className="text-left border-b border-t border-gray-300 p-2">Email</th>
                <th className="text-left border-b border-t border-gray-300 p-2">Role</th>
                <th className="text-left border-b border-t border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((user, index) => (
                <tr key={index} className="text-left border-t border-gray-300">
                  <td className="p-2">{user.first_name} {user.last_name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <Link 
                      to={`/viewuser/${user.id}`} 
                      className="px-4 py-2 mr-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => handleView(user.id)} // Optional: Additional action
                    >
                      View
                    </Link>
                    <button
                      className={`px-4 py-2 text-sm font-bold text-white rounded ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-red-600 focus:bg-orange-600 focus:outline-none'}`}
                      onClick={() => handleSuspend(user.id)}
                    >
                      {user.is_active ? 'Suspend' : 'Unsuspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <ul className="flex justify-center mt-5 list-none">
          {Array.from({ length: Math.ceil((searchTerm.length > 0 ? searchResults.length : filteredAccounts.length) / accountsPerPage) }, (_, index) => (
            <li key={index} className="mx-1 cursor-pointer">
              <button onClick={() => paginate(index + 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:bg-gray-300">{index + 1}</button>
            </li>
          ))}
        </ul>
      </div>

      {showConfirmDialog && (
        <ConfirmDialogPopup
          title={`Confirm ${currentUser && accountDetails.find(user => user.id === currentUser).is_active ? 'Suspend' : 'Unsuspend'} Account`}
          text={`Are you sure you want to ${currentUser && accountDetails.find(user => user.id === currentUser).is_active ? 'suspend' : 'unsuspend'} this user account?`}
          onConfirm={confirmSuspend}
          onClose={() => setShowConfirmDialog(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SystemAdminHomepage;
