import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHeaders } from '../../../apiUtils';
import Topbar from '../FreeUser/Topbar';

const FU_ChangeRoomDimensions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');
  const [wallColor, setWallColor] = useState(location.state?.wallColor || '');
  const [floorTexture, setFloorTexture] = useState(location.state?.floorTexture || '');
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    if (location.state) {
      setRoomLength(location.state.roomLength);
      setRoomWidth(location.state.roomWidth);
      setRoomHeight(location.state.roomHeight);
      setWallColor(location.state.wallColor);
      setFloorTexture(location.state.floorTexture);
    }
  }, [location.state]);

  const handleGenerateRoom = () => {
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const height = parseFloat(roomHeight);

    if (
      length >= 10 && length <= 50 &&
      width >= 10 && width <= 50 &&
      height >= 2 && height <= 10
    ) {
      navigate('/FU_Room3D', {
        state: {
          roomLength: length,
          roomWidth: width,
          roomHeight: height,
          wallColor,
          floorTexture,
        }
      });
    } else {
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000); // Hide popup after 3 seconds
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Topbar title="Change Room Dimensions" onClick={handleGoBack} />
      <div className="flex flex-col gap-4 items-center min-h-screen mt-10 relative">
        {popupVisible && (
          <div style={styles.popup}>
            <span style={styles.close} onClick={() => setPopupVisible(false)}>&times;</span>
            <p>There are invalid dimensions, please fill in correctly!</p>
          </div>
        )}
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
            onClick={handleGenerateRoom}
          >
            Re-Generate Room
          </button>
        </div>
      </div>
    </>
  );
};

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

export default FU_ChangeRoomDimensions;