import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function
import AlertPopup from '../UI/AlertPopup'; // Assuming this is correctly imported

const SA_ManageSignUpPage = () => {
  const navigate = useNavigate();
  const [jobIndustries, setJobIndustries] = useState([]);
  const [error, setError] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [editedIndustryName, setEditedIndustryName] = useState('');

  useEffect(() => {
    fetchJobIndustries();
  }, []);

  const fetchJobIndustries = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/job_industry/list',
        {},
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('No job industries data returned');
      }

      setJobIndustries(response.data.body);
    } catch (error) {
      console.error('Error fetching job industries:', error);
      setError(error.message);
    }
  };

  const handleEdit = (id) => {
    setEditingIndustryId(id); // Set editing mode for this industry
    const industryToEdit = jobIndustries.find(industry => industry.id === id);
    setEditedIndustryName(industryToEdit.name); // Initialize edited name with current name
  };

  const handleUpdate = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/job_industry/update',
        { id: editingIndustryId, name: editedIndustryName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to update job industry');
      }

      fetchJobIndustries(); // Refresh job industries after updating
      setEditingIndustryId(null); // Exit editing mode
      setEditedIndustryName(''); // Clear edited name
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error updating job industry:', error);
      setError('Failed to update job industry.');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndustryId(null); // Exit editing mode
    setEditedIndustryName(''); // Clear edited name
  };

  const handleDelete = async (id) => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      await axios.post(
        `https://api.sensespacesplanningtool.com/job_industry/delete/${id}`,
        {},
        { headers }
      );
      fetchJobIndustries(); // Refresh job industries after deletion
    } catch (error) {
      console.error('Error deleting job industry:', error);
      setError('Failed to delete job industry.');
    }
  };

  const handleChange = (e) => {
    setEditedIndustryName(e.target.value);
  };

  const handleAdd = () => {
    setShowAddInput(true); // Show the input field for adding a new job industry
  };

  const confirmAdd = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/job_industry/create',
        { name: newIndustryName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to add new job industry');
      }

      fetchJobIndustries(); // Refresh job industries after adding
      setShowAddInput(false); // Hide the input field after successful addition
      setNewIndustryName(''); // Clear the new industry name input field
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error adding job industry:', error);
      setError('Failed to add new job industry.');
    }
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    // Handle any actions needed on alert close
  };

  const handleAlertOk = () => {
    setIsAlertVisible(false);
    // Handle any actions needed on alert ok
  };

  const handleCancelAdd = () => {
    setShowAddInput(false); // Hide the input field without adding
    setNewIndustryName(''); // Clear the new industry name input field
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbar title="Manage Sign Up Page" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl text-center">Job Industry List</h2>
            {!showAddInput && (
              <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            )}
          </div>
          {isAlertVisible && (
            <AlertPopup
              title="Success"
              text="Job Industry Updated Successfully!"
              onClose={handleAlertClose}
              onOk={handleAlertOk}
            />
          )}
          <table className="min-w-full bg-white border-collapse border border-gray-200 shadow-md rounded-md overflow-hidden">
            <thead>
              
            </thead>
            <tbody>
              {jobIndustries.map(industry => (
                <tr key={industry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingIndustryId === industry.id ? (
                      <input
                        type="text"
                        value={editedIndustryName}
                        onChange={handleChange}
                        className="px-3 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      industry.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingIndustryId === industry.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(industry.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(industry.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {showAddInput && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={newIndustryName}
                      onChange={(e) => setNewIndustryName(e.target.value)}
                      placeholder="Enter new industry name"
                      className="px-3 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={confirmAdd}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SA_ManageSignUpPage
