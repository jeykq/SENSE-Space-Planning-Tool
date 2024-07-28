import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../FreeUser/Topbar';
import Footer from '../Landing/Footer';
import './FU_CreateRoom.css';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const FU_CreateRoom = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

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

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTemplateClick = () => {
    navigate('/FU_SelectTemplate', { state: { templates } });
  };

  const handleDrawClick = () => {
    navigate('/FU_DrawRoom');
  };



  const handleGoBack = () => {
    navigate('/FreeUserHomepage'); 
  };

  return (
    <div className="create-room-page">
      <Topbar title="Create Room" onClick={handleGoBack} />
      <div className="create-room-container">
        <label className="create-room-label">Who are you creating the room for?</label>
        <div className="col-span-2 mb-2 relative"></div>
        <select 
          value={selectedOption} 
          onChange={handleOptionChange} 
          className="border border-gray-400 py-2 px-2 w-72 text-center rounded"
        >
          <option value="">-</option>
          <option value="autistic_person">Autistic person</option>
          <option value="kids">Kids</option>
          <option value="mentally_challenged">Mentally challenged</option>
          <option value="peaceful_environment">Seeking peaceful environment</option>
          <option value="employees">Employees</option>
        </select>
        <div className="create-room-buttons">
          <button 
            onClick={handleTemplateClick} 
            title='Create room with SENSE templates'
            className="rounded w-max-min text-nowrap py-3 px-8 mt-5 mr-2 uppercase"
            style={{ backgroundColor: '#cfd2e3' }}
                  onMouseEnter={(e) => { 
                    e.target.style.backgroundColor = '#c5cbeb';
                    e.target.style.color = '#6c6d70';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.backgroundColor = '#cfd2e3';
                    e.target.style.color = '#333';
                  }}
            >
            Templates
          </button>
          <button 
            onClick={handleDrawClick}
            title="Create room with your own dimensions" 
            className="rounded w-max-min text-nowrap py-3 px-8 mt-5 ml-2 uppercase"
            style={{ backgroundColor: '#cfd2e3' }}
            onMouseEnter={(e) => { 
              e.target.style.backgroundColor = '#c5cbeb';
              e.target.style.color = '#6c6d70';
            }}
            onMouseLeave={(e) => { 
              e.target.style.backgroundColor = '#cfd2e3';
              e.target.style.color = '#333';
            }}
          >
            Draw
          </button>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FU_CreateRoom;
