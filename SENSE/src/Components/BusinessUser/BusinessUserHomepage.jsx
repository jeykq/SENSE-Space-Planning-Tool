import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import axios from 'axios'; 
import AlertPopup from '../UI/AlertPopup';
import { getHeaders } from '../../../apiUtils';
import "./BusinessUserHomepage.css";

const BusinessUserHomepage = () => {
  const navigate = useNavigate();
  const handleClickCreateTemplate = () => navigate('/CreateTemplate');
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [deleteTemplateURL, setDeleteTemplateURL] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);
  const [error, setError] = useState(null);
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refreshTemplates, setRefreshTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchType, setSearchType] = useState("name"); // State for search type

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
  }, [refreshTemplates]);

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    setSearchType(type);
  };

  const toggleDropdown = (event, templateId, url) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    setDeleteTemplateId(templateId);
    setDeleteTemplateURL(url);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  // Delete Template functions
  const handleDelete = (templateId, deleteURL) => {
    setDeleteTemplateId(templateId);
    setDeleteTemplateURL(deleteURL);
    setShowDeleteConfirmation(true);
    setShowDropdown(false);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);

    try {
      const headers = getHeaders();

      await axios.post('https://api.sensespacesplanningtool.com/template/delete',
        { id: deleteTemplateId },
        { headers }
      );

      setConfirmDeletePopup(true);
      setRefreshTemplates(prev => !prev);
      console.log("Room Layout URL: ", deleteTemplateURL);
      console.log("Template ID: ", deleteTemplateId);
    } catch (error) {
      setError('Failed to delete template ID', deleteTemplateId);
      console.error("Error:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCategoryClick = (category) => {
    if (category === 'view') {
      navigate('/BU_ViewObjects');
    } else if (category === 'import') {
      navigate('/BU_ImportObjects');
    }
  };

  const viewTemplate = (template) => {
    const { 
      name: templateName, 
      room_type_id: roomType, 
      dimension: { 
        length: roomLength, 
        width: roomWidth, 
        height: roomHeight 
      }, 
      room_layout: { 
        room_layout: roomLayoutUrl 
      } } = template;
  
    navigate('/Room3D', {
      state: {
        templateName,
        roomType,
        roomLength: parseFloat(roomLength),
        roomWidth: parseFloat(roomWidth),
        roomHeight: parseFloat(roomHeight),
        roomLayoutUrl
      }
    });
  };

  const renderDropdown = () => (
    <div ref={dropdownRef} style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
      <button className="block px-4 py-2 text-sm text-gray-700 custom-hover w-full text-left">Update</button>
      <button className="block px-4 py-2 text-sm text-gray-700 custom-hover w-full text-left" onClick={() => handleDelete(deleteTemplateId, deleteTemplateURL)}>Delete</button>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <div className="bg-white rounded-lg p-8">
        <p className="mb-4">Are you sure you want to delete this template?</p>
        <div className="flex justify-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmDelete}>Delete</button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancelDelete}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderConfirmDeletePopup = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <div className="bg-white rounded-lg p-8">
        <p className="mb-4">{`Template deleted successfully!`}</p>
        <div className="flex justify-center">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirmDeletePopup(false)}>Close</button>
        </div>
      </div>
    </div>
  );

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(room => room.id === roomTypeId);
    return roomType ? capitalizeFirstLetter(roomType.name) : 'Unknown Category';
  };

  const filteredTemplates = templateNames.filter(template => {
    if (searchType === 'name') {
      return template.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'category') {
      const roomTypeName = getRoomTypeName(template.room_type_id).toLowerCase();
      return roomTypeName.includes(searchQuery.toLowerCase());
    }
    return false;
  });

  return (
    <div>
      <Navbar handleSearch={handleSearch} />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "25px", fontWeight: "500" }}>
        <div className={"mt-20 ml-5"}>
          <p>Room Templates</p>
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingLeft: "100px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "90%" }}>
          <div style={{ width: '80px', height: '70px', borderRadius: '50%', backgroundColor: '#D1D5DB', display: 'flex', justifyContent: 'center', marginRight: '20px' }} className={"bg-slate-700"}>
            <button onClick={handleClickCreateTemplate} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '30px', fontWeight: 'bold' }}>+</button>
          </div>

          <div ref={swiperContainer1} className="swiper-container" style={{ paddingLeft: "40px", paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="swiper-slide" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => viewTemplate(template)}>
                  <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={(e) => toggleDropdown(e, template.id, template.room_layout.room_layout)}>...</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DB', borderRadius: '20px', padding: '20px' }}>
                    <div className="bg-gray-300" style={{ borderRadius: '20px', height: '200px', marginBottom: '10px' }}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <p>{template.name}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p>{getRoomTypeName(template.room_type_id)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown list for Room Templates */}
      {showDropdown && renderDropdown()}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && renderDeleteConfirmation()}

      {/* Delete Confirmation Success Popup */}
      {confirmDeletePopup && renderConfirmDeletePopup()}

      <hr style={{ border: "1px solid black" }} />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "25px", fontWeight: "500" }}>
        <div className={"ml-5"}>
          <p>Room Objects</p>
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "0px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "100%" }}>
          <div ref={swiperContainer2} className="swiper-container" style={{ paddingLeft: "40px", paddingRight: "40px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {roomTypes.map((roomType, index) => (
                <div key={index} className="swiper-slide" style={{ position: 'relative' }}>
                  <div className="overlay">
                    <div className="option" onClick={() => handleCategoryClick('view')}>View Objects</div>
                    <div className="option" onClick={() => handleCategoryClick('import')}>Import Objects</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DB', borderRadius: '20px', padding: '20px' }}>
                    <div className="bg-gray-300" style={{ borderRadius: '20px', height: '200px', marginBottom: '10px' }}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <p> {roomType.name} </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessUserHomepage;
