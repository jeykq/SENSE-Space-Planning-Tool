import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import Footer from '../Landing/Footer';
import './PU_SelectTemplate.css';

const PU_SelectTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const templates = location.state.templates || [];
  const [roomName, setRoomName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerateRoom = () => {
    console.log('Generate Room clicked with template:', selectedTemplate);
    navigate('/PU_Room3D', {
      state: {
        template: selectedTemplate,
        roomName: roomName
      }
    });
  };

  const handleGoBack = () => {
    navigate('/PU_CreateRoom');
  };

  return (
    <div className="select-template-page">
      <Topbar title="Premium Users: Create Room" onClick={handleGoBack} />
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

export default PU_SelectTemplate;
