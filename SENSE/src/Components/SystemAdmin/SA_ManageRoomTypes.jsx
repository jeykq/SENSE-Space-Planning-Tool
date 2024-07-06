import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function
import AlertPopup from '../UI/AlertPopup'; // Assuming this is correctly imported

const SA_ManageRoomTypesPage = () => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newRoomTypeName, setNewRoomTypeName] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [editingRoomTypeId, setEditingRoomTypeId] = useState(null);
  const [editedRoomTypeName, setEditedRoomTypeName] = useState('');

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/room_type/list',
        {},
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('No room types data returned');
      }

      setRoomTypes(response.data.body);
    } catch (error) {
      console.error('Error fetching room types:', error);
      setError(error.message);
    }
  };

  const handleEdit = (id) => {
    setEditingRoomTypeId(id); // Set editing mode for this room type
    const roomTypeToEdit = roomTypes.find(roomType => roomType.id === id);
    setEditedRoomTypeName(roomTypeToEdit.name); // Initialize edited name with current name
  };

  const handleUpdate = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/room_type/update',
        { id: editingRoomTypeId, name: editedRoomTypeName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to update room type');
      }

      fetchRoomTypes(); // Refresh room types after updating
      setEditingRoomTypeId(null); // Exit editing mode
      setEditedRoomTypeName(''); // Clear edited name
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error updating room type:', error);
      setError('Failed to update room type.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomTypeId(null); // Exit editing mode
    setEditedRoomTypeName(''); // Clear edited name
  };

  const handleDelete = async (id) => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      await axios.post(
        `https://api.sensespacesplanningtool.com/room_type/delete/${id}`,
        {},
        { headers }
      );
      fetchRoomTypes(); // Refresh room types after deletion
    } catch (error) {
      console.error('Error deleting room type:', error);
      setError('Failed to delete room type.');
    }
  };

  const handleChange = (e) => {
    setEditedRoomTypeName(e.target.value);
  };

  const handleAdd = () => {
    setShowAddInput(true); // Show the input field for adding a new room type
  };

  const confirmAdd = async () => {
    try {
      const headers = getHeaders(); // Assuming getHeaders provides necessary headers
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/room_type/create',
        { name: newRoomTypeName },
        { headers }
      );

      if (!response.data || !response.data.body) {
        throw new Error('Failed to add new room type');
      }

      fetchRoomTypes(); // Refresh room types after adding
      setShowAddInput(false); // Hide the input field after successful addition
      setNewRoomTypeName(''); // Clear the new room type name input field
      setIsAlertVisible(true); // Show success alert

    } catch (error) {
      console.error('Error adding room type:', error);
      setError('Failed to add new room type.');
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
    setNewRoomTypeName(''); // Clear the new room type name input field
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbar title="Manage Room Types" onClick={handleGoBack} />
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl text-center">Room Type List</h2>
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
              {roomTypes.map(roomType => (
                <tr key={roomType.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRoomTypeId === roomType.id ? (
                      <input
                        type="text"
                        value={editedRoomTypeName}
                        onChange={handleChange}
                        className="px-3 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      roomType.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingRoomTypeId === roomType.id ? (
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
                          onClick={() => handleEdit(roomType.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(roomType.id)}
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
                      value={newRoomTypeName}
                      onChange={(e) => setNewRoomTypeName(e.target.value)}
                      placeholder="Enter new room type name"
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

export default SA_ManageRoomTypesPage;
