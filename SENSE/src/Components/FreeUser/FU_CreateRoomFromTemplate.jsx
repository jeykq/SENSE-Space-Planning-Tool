import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import Footer from '../Landing/Footer';
import './FU_CreateRoom.css';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const FU_CreateRoomFromTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTemplates = (location.state && location.state.templates) || [];
  const [roomName, setRoomName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState(initialTemplates);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerateRoom = () => {
    console.log('Generate Room clicked with template:', selectedTemplate);
    navigate('/FU_Room3D', {
      state: {
        template: selectedTemplate,
        roomName: roomName
      }
    });
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const headers = getHeaders();
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/template/list',
          {},
          { headers }
        );

        if (!response.data || !response.data.body) {
          throw new Error('No template names data returned');
        }

        const sortedTemplates = response.data.body.sort((a, b) => a.id - b.id);
        setTemplates(sortedTemplates);
      } catch (error) {
        console.error('Error fetching template names:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleGoBack = () => {
    navigate('/FreeUserHomepage'); 
  };

  return (
    <div className="create-room-page">
      <Topbar title="Create Room from Templates" onClick={handleGoBack} />
      <div className="select-template-container">
        <div className="select-template-form">
          <label>Room Name</label>
          <div className="room-name-input-container">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="select-template-input"
            />
          </div>
          <div className="template-list">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="template-thumbnail"></div>
                <div className="template-info">
                  <p className="template-name">{template.name}</p>
                  <p className="template-type">{template.room_type_name}</p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="selected-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleGenerateRoom} className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
            Generate room
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FU_CreateRoomFromTemplate;
