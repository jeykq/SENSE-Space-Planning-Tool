import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHeaders } from '../../../apiUtils';
import Topbar from '../BusinessUser/Topbar';

const BU_ChangeRoomDimensions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');
  const [wallColor, setWallColor] = useState(location.state?.wallColor || '');
  const [floorTexture, setFloorTexture] = useState(location.state?.floorTexture || '');

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
    if (roomLength && roomWidth && roomHeight) {
      navigate('/BU_Room3D', {
        state: {
          roomLength: parseFloat(roomLength),
          roomWidth: parseFloat(roomWidth),
          roomHeight: parseFloat(roomHeight),
          wallColor,
          floorTexture,
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Topbar title="Change Room Dimensions" onClick={handleGoBack} />
      <div className="flex flex-col gap-4 items-center min-h-screen mt-10">
        <div className="text-2xl mb-3">
          <h1>Room dimensions (m)</h1>
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_length">Length</label>
        </div>
        <div className="col-span-2">
          <input
            type="text"
            className="border border-gray-400 py-1 w-72 text-center"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_width">Width</label>
        </div>
        <div className="col-span-2">
          <input
            type="text"
            className="border border-gray-400 py-1 w-72 text-center"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_height">Height</label>
        </div>
        <div className="col-span-2">
          <input
            type="text"
            className="border border-gray-400 py-1 w-72 text-center"
            value={roomHeight}
            onChange={(e) => setRoomHeight(e.target.value)}
            required
          />
        </div>
        <div className="col-span-4 flex items-center justify-center">
          <button
            className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase"
            onClick={handleGenerateRoom}
          >
            Re-Generate Room
          </button>
        </div>
      </div>
    </>
  );
};

export default BU_ChangeRoomDimensions;