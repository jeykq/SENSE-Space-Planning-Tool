import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeaders } from '../../../apiUtils';
import Topbar from '../BusinessUser/Topbar';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const handleCreateTemplate = () => {
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const height = parseFloat(roomHeight);

    if (!roomType) {
      alert('Please select a Room Type.');
    } else if (
      length >= 10 && length <= 50 &&
      width >= 10 && width <= 50 &&
      height >= 2 && height <= 10
    ) {
      navigate('/BU_Room3D', { 
        state: {
          roomType,
          roomLength: length, 
          roomWidth: width, 
          roomHeight: height 
        } 
      });
    } else {
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000); // Hide popup after 3 seconds
    }
  };

  const TemplateNameCheck = async (template) => {
    try {
      const headers = getHeaders();
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/template/list',
        {},
        { headers }
      );

      let isTemplateExists = false;

      response.data.body.forEach(item => {
        const templateName = item.name;
        console.log(templateName);

        if (templateName == template) {
          isTemplateExists = true;
          console.log("Match found");
        } else {
          console.log("No matches found");
        }
      });

      return isTemplateExists;

    } catch (error) {
      console.error('Error fetching template names:', error);
      return false;
    }
  };

  const handleGoBack = () => {
    navigate('/BusinessUserHomepage'); 
  };

  return (
    <>
      <Topbar title="Create New Template" onClick={handleGoBack} />

      <div className="flex flex-col gap-4 items-center min-h-screen mt-10 relative">
        {popupVisible && (
          <div style={styles.popup}>
            <span style={styles.close} onClick={() => setPopupVisible(false)}>&times;</span>
            <p>There are invalid dimensions, please fill in correctly!</p>
          </div>
        )}
        <div className="col-span-1 text-2xl text-center self-center mb-1">
          <label htmlFor="room_type">Room type</label>
        </div>
        <div className="col-span-2 mb-2 relative">
          <select
            className="border border-gray-400 py-2 px-2 w-72 text-center"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <option value="" disabled>Select Room Type</option>
            <option value="1">Living Room</option>
            <option value="2">Bedroom</option>
            <option value="4">Study Room</option>
            <option value="5">Kitchen</option>
            <option value="6">Kid's Room</option>
          </select>
        </div>
        <div className="text-2xl mb-3">
          <h1>Room dimensions (m)</h1>
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_length">Length</label>
        </div>
        <div className="col-span-2 flex flex-col items-center mb-4">
          <input 
            type="number" 
            className="border border-gray-400 py-1 w-72 text-center" 
            placeholder="Enter Length (10-50 m)"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)} 
            required 
            step="1"
            min="10"
            max="50"
          />
          <small className="text-gray-500 mt-2">Length should be between 10 and 50 meters.</small>
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_width">Width</label>
        </div>
        <div className="col-span-2 flex flex-col items-center mb-4">
          <input 
            type="number" 
            className="border border-gray-400 py-1 w-72 text-center" 
            placeholder="Enter Width (10-50 m)"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            required 
            step="1"
            min="10"
            max="50"
          />
          <small className="text-gray-500 mt-2">Width should be between 10 and 50 meters.</small>
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_height">Height</label>
        </div>
        <div className="col-span-2 flex flex-col items-center mb-4">
          <input 
            type="number" 
            className="border border-gray-400 py-1 w-72 text-center" 
            placeholder="Enter Height (2-10 m)"
            value={roomHeight}
            onChange={(e) => setRoomHeight(e.target.value)} 
            required 
            step="1"
            min="2"
            max="10"
          />
          <small className="text-gray-500 mt-2">Height should be between 2 and 10 meters.</small>
        </div>
        <div className="col-span-4 flex items-center justify-center">
          <button 
            className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase hover:bg-blue-600 transition duration-100"
            onClick={handleCreateTemplate}
          >
            Generate Room
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
    popup: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '10px',
        zIndex: 1000,
        textAlign: 'center',
        width: '300px'
    },
    close: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '20px',
        cursor: 'pointer'
    }
};

export default CreateTemplate;