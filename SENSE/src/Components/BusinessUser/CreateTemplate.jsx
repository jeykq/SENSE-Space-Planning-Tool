import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeaders } from '../../../apiUtils';
import Topbar from '../BusinessUser/Topbar';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [isTemplateValid, setIsTemplateValid] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');

  const handleCreateTemplate = () => {
    if (templateName && roomType && roomLength && roomWidth && roomHeight) {
      navigate('/BU_Room3D', { 
        state: { 
          templateName, 
          roomType,
          roomLength: parseFloat(roomLength), 
          roomWidth: parseFloat(roomWidth), 
          roomHeight: parseFloat(roomHeight) 
        } 
      });
    } else {
      alert('Please fill in all fields.');
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

  const handleTemplateNameChange = async (e) => {
    const newTemplateName = e.target.value;
    setTemplateName(newTemplateName);

    const valid = await TemplateNameCheck(newTemplateName);
    setIsTemplateValid(valid);
  };

  const handleGoBack = () => {
    navigate('/BusinessUserHomepage'); 
  };

  return (
    <>
      <Topbar title="Create New Template" onClick={handleGoBack} />
      <div className="flex flex-col gap-4 items-center min-h-screen mt-10">
        <div className="col-span-1 text-2xl text-center self-center mb-1">
          <label htmlFor="template_name">Template name</label>
        </div>
        <div className="col-span-2 mb-2">
          <input 
            type="text" 
            className="border border-gray-400 py-2 px-2 w-72 text-center" 
            value={templateName}
            onChange={handleTemplateNameChange}
            required 
          />
          {isTemplateValid !== null && (
            <p style={{ 
              color: isTemplateValid ? 'red' : 'green', 
              textAlign: 'center' 
            }}>
              {isTemplateValid ? 'Matching template name found' : 'Template name is valid'}
            </p>
          )}
        </div>
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
            onClick={handleCreateTemplate}
          >
            Generate Room
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateTemplate;