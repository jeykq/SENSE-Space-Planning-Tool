import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import Footer from '../Landing/Footer';
import './PU_CreateRoom.css';

const PU_CreateRoom = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTemplateClick = () => {
    console.log('Template clicked');
  };

  const handleDrawClick = () => {
    navigate('/PU_DrawRoom');
  };

  const handleImportClick = () => {
    console.log('Import clicked');
  };

  const handleGoBack = () => {
    navigate('/PremiumUserHomepage'); 
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
          className="border border-gray-400 py-2 px-2 w-72 text-center"
        >
          <option value="">-</option>
          <option value="autistic_person">Autistic person</option>
          <option value="kids">Kids</option>
          <option value="mentally_challenged">Mentally challenged</option>
          <option value="peaceful_environment">Seeking peaceful environment</option>
          <option value="employees">Employees</option>
        </select>
        <div className="create-room-buttons">
          <button onClick={handleTemplateClick} className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
            Templates
          </button>
          <button onClick={handleDrawClick} className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
            Draw
          </button>
          <button onClick={handleImportClick} className="rounded w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
            Import
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PU_CreateRoom;
