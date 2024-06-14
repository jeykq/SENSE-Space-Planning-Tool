import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function
import AlertPopup from '../UI/AlertPopup'; // Assuming this is correctly imported

const SA_ManageTagsPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editedTagName, setEditedTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/tag/list',
        {},
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('No tags data returned');
      }

      setTags(response.data.body);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError(error.message);
    }
  };

  const handleEdit = (id) => {
    setEditingTagId(id); // Set editing mode for this tag
    const tagToEdit = tags.find(tag => tag.id === id);
    setEditedTagName(tagToEdit.name); // Initialize edited name with current name
  };

  const handleUpdate = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/tag/update',
        { id: editingTagId, name: editedTagName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to update tag');
      }

      fetchTags(); // Refresh tags after updating
      setEditingTagId(null); // Exit editing mode
      setEditedTagName(''); // Clear edited name
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null); // Exit editing mode
    setEditedTagName(''); // Clear edited name
  };

  const handleDelete = async (id) => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      await axios.post(
        `https://api.sensespacesplanningtool.com/tag/delete/${id}`,
        {},
        { headers }
      );
      fetchTags(); // Refresh tags after deletion
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag.');
    }
  };

  const handleChange = (e) => {
    setEditedTagName(e.target.value);
  };

  const handleAdd = () => {
    setShowAddInput(true); // Show the input field for adding a new tag
  };

  const confirmAdd = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/tag/create',
        { name: newTagName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to add new tag');
      }

      fetchTags(); // Refresh tags after adding
      setShowAddInput(false); // Hide the input field after successful addition
      setNewTagName(''); // Clear the new tag name input field
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error adding tag:', error);
      setError('Failed to add new tag.');
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
    setNewTagName(''); // Clear the new tag name input field
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbar title="Manage Tags" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl text-center">Tag List</h2>
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
              text="Operation Successful!"
              onClose={handleAlertClose}
              onOk={handleAlertOk}
            />
          )}
          <table className="min-w-full bg-white border-collapse border border-gray-200 shadow-md rounded-md overflow-hidden">
            <thead>
              
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTagId === tag.id ? (
                      <input
                        type="text"
                        value={editedTagName}
                        onChange={handleChange}
                        className="px-3 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingTagId === tag.id ? (
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
                          onClick={() => handleEdit(tag.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
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
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter new tag name"
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

export default SA_ManageTagsPage;
