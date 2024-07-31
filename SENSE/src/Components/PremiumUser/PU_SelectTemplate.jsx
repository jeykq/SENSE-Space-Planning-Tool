import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import Footer from '../Landing/Footer';
import PU_SearchBar from "./PU_SearchBar";
import axios from "axios";
import { getHeaders } from '../../../apiUtils';
import './PU_SelectTemplate.css';

const PU_SelectTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const templates = location.state.templates || [];
  const [templateName, setTemplateNames] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');

  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const headers = getHeaders();
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/room_type/list',
          {},
          { headers }
        );

        if (!response.data || !response.data.body) {
          throw new Error('No room types data returned');
        }

        const sortedRoomTypes = response.data.body.sort((a, b) => a.id - b.id);
        setRoomTypes(sortedRoomTypes);
      } catch (error) {
        console.error('Error fetching room types:', error);
        setError(error.message);
      }
    };

    const fetchTemplateNames = async () => {
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
        setTemplateNames(sortedTemplates);
      } catch (error) {
        console.error('Error fetching template names:', error);
        setError(error.message);
      }
    };

    fetchRoomTypes();
    fetchTemplateNames();
  }, []);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    setSearchType(type);
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(room => room.id === roomTypeId);
    return roomType ? capitalizeFirstLetter(roomType.name) : 'Unknown Category';
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const filteredTemplates = templates.filter(template => {
    if (searchType === 'name') {
      return template.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'category') {
      const roomTypeName = getRoomTypeName(template.room_type_id).toLowerCase();
      return roomTypeName.includes(searchQuery.toLowerCase());
    }
    return false;
  });

  const handleMouseEnter = (template) => {
    setHoveredTemplate(template);
  };

  const handleMouseLeave = () => {
    setHoveredTemplate(null);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleGoBack = () => {
    navigate('/PU_CreateRoom');
  };

  const handleGenerateRoom = () => {
    console.log('Generate Room clicked with template:', selectedTemplate);

    navigate('/PU_Room3D', {
      state: {
        roomId: selectedTemplate.id,
        roomName: selectedTemplate.name,
        roomType: selectedTemplate.room_type_id,
        roomLength: selectedTemplate.dimension.length,
        roomWidth: selectedTemplate.dimension.width,
        roomHeight: selectedTemplate.dimension.height,
        roomLayoutUrl: selectedTemplate.room_layout.room_layout,
        isTemplate: true
      }
    });
  };

  return (
    <div className="select-template-page">
      <Topbar title="Create Room" onClick={handleGoBack} />

      <div className="select-template-container">
        <div className="select-template-form">
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', marginTop: '15px' }}>
            <PU_SearchBar handleSearch={handleSearch} />
          </div>
          <div className="template-list">
          {filteredTemplates.map((template) => {
            const screenshotURL = template.room_layout.room_layout.replace(/\.glb$/, '.png');
            return (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateClick(template)}
                onMouseEnter={() => handleMouseEnter(template)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{
                  backgroundImage: `url(${screenshotURL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div className="template-info" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '10px',
                }}>
                  <p className="template-name">{template.name}</p>
                  <p className="template-type">{getRoomTypeName(template.room_type_id)}</p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="selected-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
          </div>
          <button onClick={handleGenerateRoom} className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
            Generate room
          </button>
        </div>
        </div>
        {hoveredTemplate && (
          <div
            className="hover-popup"
            style={{
              position: 'fixed',
              top: mousePosition.y + 10,
              left: mousePosition.x + 10,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              zIndex: 1000,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
          >
            <h3 className="mb-2 text-lg font-bold text-center">{hoveredTemplate.name}</h3>
            <hr></hr>
            <p className="mt-2 text-lg font-medium text-center"> Room Dimensions </p>
            <p className="text-center">Width: {hoveredTemplate.dimension.width}m</p>
            <p className="text-center">Length: {hoveredTemplate.dimension.length}m</p>
            <p className="text-center">Height: {hoveredTemplate.dimension.height}m</p>
          </div>
        )}
        <Footer />
    </div>
  );
};

export default PU_SelectTemplate;
