import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function
import AlertPopup from '../UI/AlertPopup'; // Assuming this is correctly imported

const SA_ManageObjCategoriesPage = () => {
  const navigate = useNavigate();
  const [ObjCategories, setObjCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  useEffect(() => {
    fetchObjCategories();
  }, []);

  const fetchObjCategories = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/category/list',
        {},
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('No Obj Categories data returned');
      }

      setObjCategories(response.data.body);
    } catch (error) {
      console.error('Error fetching Obj Categories:', error);
      setError(error.message);
    }
  };

  const handleEdit = (id) => {
    setEditingCategoryId(id); // Set editing mode for this Category
    const categoryToEdit = ObjCategories.find(category => category.id === id);
    setEditedCategoryName(categoryToEdit.name); // Initialize edited name with current name
  };

  const handleUpdate = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/category/update',
        { id: editingCategoryId, name: editedCategoryName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to update Obj Category');
      }

      fetchObjCategories(); // Refresh Obj Categories after updating
      setEditingCategoryId(null); // Exit editing mode
      setEditedCategoryName(''); // Clear edited name
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error updating Obj Category:', error);
      setError('Failed to update Obj Category.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null); // Exit editing mode
    setEditedCategoryName(''); // Clear edited name
  };

  const handleDelete = async (id) => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      await axios.post(
        `https://api.sensespacesplanningtool.com/category/delete/${id}`,
        {},
        { headers }
      );
      fetchObjCategories(); // Refresh Obj Categories after deletion
    } catch (error) {
      console.error('Error deleting Obj Category:', error);
      setError('Failed to delete Obj Category.');
    }
  };

  const handleChange = (e) => {
    setEditedCategoryName(e.target.value);
  };

  const handleAdd = () => {
    setShowAddInput(true); // Show the input field for adding a new Obj Category
  };

  const confirmAdd = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/category/create',
        { name: newCategoryName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to add new Obj Category');
      }

      fetchObjCategories(); // Refresh Obj Categories after adding
      setShowAddInput(false); // Hide the input field after successful addition
      setNewCategoryName(''); // Clear the new Category name input field
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error adding Obj Category:', error);
      setError('Failed to add new Obj Category.');
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
    setNewCategoryName(''); // Clear the new Category name input field
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbar title="Manage Object Categories" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl text-center">Obj Category List</h2>
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
              text="Obj Category Updated Successfully!"
              onClose={handleAlertClose}
              onOk={handleAlertOk}
            />
          )}
          <table className="min-w-full bg-white border-collapse border border-gray-200 shadow-md rounded-md overflow-hidden">
            <thead>
              
            </thead>
            <tbody>
              {ObjCategories.map(category => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        value={editedCategoryName}
                        onChange={handleChange}
                        className="px-3 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                        category.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingCategoryId === category.id ? (
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
                          onClick={() => handleEdit(category.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter new category name"
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

export default SA_ManageObjCategoriesPage
