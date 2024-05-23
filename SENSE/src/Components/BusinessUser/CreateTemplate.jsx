import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from './Topbar';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');

  const handleCreateTemplate = () => {
    if (templateName && roomLength && roomWidth && roomHeight) {
      navigate('/Room3D', { 
        state: { 
          templateName, 
          roomLength: parseFloat(roomLength), 
          roomWidth: parseFloat(roomWidth), 
          roomHeight: parseFloat(roomHeight) 
        } 
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <>
      <Topbar title={"Create New Template"} onClick={() => navigate("/Room3D")}/>
      <div className="flex flex-col gap-4 items-center min-h-screen mt-20">
        <div className="col-span-1 text-2xl text-center self-center mb-1">
          <label htmlFor="template_name">Template name</label>
        </div>
        <div className="col-span-2 mb-2">
          <input 
            type="text" 
            className="border border-gray-400 py-2 px-2" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)} 
            required 
          />
        </div>
        <div className="text-2xl mb-3">
          <h1>Room Dimensions</h1>
        </div>
        <div className="col-span-1 text-center self-center">
          <label htmlFor="room_length">Length</label>
        </div>
        <div className="col-span-2">
          <input 
            type="text" 
            className="border border-gray-400 py-1" 
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
            className="border border-gray-400 py-1" 
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
            className="border border-gray-400 py-1" 
            value={roomHeight}
            onChange={(e) => setRoomHeight(e.target.value)} 
            required 
          />
        </div>
        <div className="col-span-4 flex items-center justify-center">
          <button 
            className="w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase"
            onClick={handleCreateTemplate}
          >
            Create Template
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateTemplate;