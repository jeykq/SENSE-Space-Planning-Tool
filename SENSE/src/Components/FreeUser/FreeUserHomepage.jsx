import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import axios from "axios";
import FU_SearchBar from "./FU_SearchBar";
import { getHeaders } from '../../../apiUtils';
import "./FreeUserHomepage.css";

const FreeUserHomepage = () => {
  const navigate = useNavigate();
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [deleteRoomURL, setDeleteRoomURL] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);

  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [refreshRooms, setRefreshRooms] = useState(false);

  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  if (swiperContainer1.current) {
    new Swiper(swiperContainer1.current, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: true,
      pagination: {
        el: '.swiper-pagination1',
        clickable: true,
      },
    });
  }

  if (swiperContainer2.current) {
    new Swiper(swiperContainer2.current, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: true,
      pagination: {
        el: '.swiper-pagination2',
        clickable: true,
      },
    });
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const headers = getHeaders();
        const response = await axios.post(
          'https://api.sensespacesplanningtool.com/room/list',
          {},
          { headers }
        );

        if (!response.data || !response.data.body) {
          throw new Error('No room data returned');
        }

        const sortedRooms = response.data.body.sort((a, b) => a.id - b.id);
        setRooms(sortedRooms);
      } catch (error) {
        console.error('Error fetching room types:', error);
        setError(error.message);
      }
    };


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

    fetchRooms();
    fetchRoomTypes();
    fetchTemplateNames();
  }, [refreshRooms]);

  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) {
        const rect = swiperContainer1.current.getBoundingClientRect();
        setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDropdown, roomTypes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (event, roomId, url) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    setDeleteRoomId(roomId);
    setDeleteRoomURL(url);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  // Delete Template functions
  const handleDelete = (roomId, deleteURL) => {
    setDeleteRoomId(roomId);
    setDeleteRoomURL(deleteURL);
    setShowDeleteConfirmation(true);
    setShowDropdown(false);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);

    try {
      const headers = getHeaders();

      await axios.post('https://api.sensespacesplanningtool.com/room/delete',
        { id: deleteRoomId },
        { headers }
      );

      setConfirmDeletePopup(true);
      setRefreshRooms(prev => !prev);
      console.log("Room Layout URL: ", deleteRoomURL);
      console.log("Room ID: ", deleteRoomId);
    } catch (error) {
      setError('Failed to delete Room ID', deleteRoomId);
      console.error("Error:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };


  const viewRoom = (room) => {
    const {
      id: roomId, 
      name: roomName, 
      room_type_id: roomType, 
      dimension: { 
        length: roomLength, 
        width: roomWidth, 
        height: roomHeight 
      }, 
      room_layout: { 
        room_layout: roomLayoutUrl 
      } } = room;

    navigate('/FU_Room3D', {
      state: {
        roomId,
        roomName,
        roomType,
        roomLength: parseFloat(roomLength),
        roomWidth: parseFloat(roomWidth),
        roomHeight: parseFloat(roomHeight),
        roomLayoutUrl
      }
    });
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const renderDropdown = () => (
    <div ref={dropdownRef} style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
      <button className="block px-4 py-2 text-sm text-gray-700 custom-hover w-full text-left" onClick={() => handleDelete(deleteRoomId, deleteRoomURL)}>Delete</button>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <div className="bg-white text-black rounded-lg p-8">
        <p className="mb-4">Are you sure you want to delete this room?</p>
        <div className="flex justify-center">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmDelete}>Delete</button>
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={handleCancelDelete}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderConfirmDeletePopup = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <div className="bg-white rounded-lg p-8">
        <p className="mb-4">{`Room deleted successfully!`}</p>
        <div className="flex justify-center">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirmDeletePopup(false)}>Close</button>
        </div>
      </div>
    </div>
  );

  const renderNoRoomsMessage = () => (
    <div className="swiper-slide" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', width: '100%' }}>
      <p style={{ textAlign: 'center', justifyItems: 'center', fontSize: '20px', fontWeight: 'bold', color: 'grey' }}>NO ROOM DESIGNS CREATED</p>
    </div>
  );

  const renderNoTemplatesMessage = () => (
    <div className="swiper-slide" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', width: '100%' }}>
      <p style={{ textAlign: 'center', justifyItems: 'center', fontSize: '20px', fontWeight: 'bold', color: 'grey' }}>NO TEMPLATES AVAILABLE</p>
    </div>
  );

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

  const filteredTemplates = templateNames.filter(template => {
    if (searchType === 'name') {
      return template.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'category') {
      const roomTypeName = getRoomTypeName(template.room_type_id).toLowerCase();
      return roomTypeName.includes(searchQuery.toLowerCase());
    }
    return false;
  });

  const filteredRooms = rooms.filter(room => {
    if (searchType === 'name') {
      return room.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'category') {
      const roomTypeName = getRoomTypeName(room.room_type_id).toLowerCase();
      return roomTypeName.includes(searchQuery.toLowerCase());
    }
    return false;
  });

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontWeight: "500" }}>
        <div className={"mt-20 ml-5"}>
          <p style={{ marginRight: '10px', fontSize: "25px" }}>Recent Designs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <FU_SearchBar handleSearch={handleSearch} />
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "96%" }}>
          <div ref={swiperContainer1} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const screenshotURL = room.room_layout.room_layout.replace(/\.glb$/, '.png');
                  return (
                    <div key={room.id} className="swiper-slide" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => viewRoom(room)}>
                      <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={(e) => toggleDropdown(e, room.id, room.room_layout.room_layout)}>...</div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${screenshotURL})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '20px', padding: '20px' }}>
                        <div className="bg-gray-300" style={{ borderRadius: '20px', height: '200px', marginBottom: '10px' }}></div>
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          <p>{room.name}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p>{getRoomTypeName(room.room_type_id)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                renderNoRoomsMessage()
              )}
            </div>
            <div className="swiper-pagination swiper-pagination1"></div>
          </div>
        </div>
      </div>

      <hr className="border border-black" />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontWeight: "500" }}>
        <div className={"mt-5 ml-5"}>
          <p style={{ marginRight: '10px', fontSize: "25px" }}>Room Templates</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <FU_SearchBar handleSearch={handleSearch} />
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center">
          <div ref={swiperContainer2} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => {
                    const screenshotURL = template.room_layout.room_layout.replace(/\.glb$/, '.png');
                    return (
                      <div 
                      key={template.id} 
                      className="swiper-slide" 
                      style={{ position: 'relative', cursor: 'pointer' }} 
                      onMouseEnter={() => handleMouseEnter(template)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${screenshotURL})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '20px', padding: '20px' }}>
                          <div className="bg-gray-300" style={{ borderRadius: '20px', height: '200px', marginBottom: '10px' }}></div>
                          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <p>{template.name}</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p>{getRoomTypeName(template.room_type_id)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  renderNoTemplatesMessage()
                )}
            </div>
            <div className="swiper-pagination swiper-pagination2"></div>
          </div>
        </div>
      </div>

      {hoveredItem && (
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
            <h3 className="mb-2 text-lg font-bold text-center">{hoveredItem.name}</h3>
            <hr></hr>
            <p className="mt-2 text-lg font-medium text-center"> Room Dimensions </p>
            <p className="text-center">Width: {hoveredItem.dimension.width}m</p>
            <p className="text-center">Length: {hoveredItem.dimension.length}m</p>
            <p className="text-center">Height: {hoveredItem.dimension.height}m</p>
          </div>
        )}

      {showDropdown && renderDropdown()}

      {showDeleteConfirmation && renderDeleteConfirmation()}

      {confirmDeletePopup && renderConfirmDeletePopup()}

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default FreeUserHomepage;
