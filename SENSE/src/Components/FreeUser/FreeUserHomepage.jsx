import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { getHeaders } from '../../../apiUtils';
import "./FreeUserHomepage.css";

const FreeUserHomepage = () => {
  const navigate = useNavigate();
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
  const [activeSearchField, setActiveSearchField] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTemplates, setRefreshTemplates] = useState(false);

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

  useEffect(() => {
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

  const toggleDropdown = (event, templateId, url) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
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

    navigate('/FU_Room3D', {
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

  const toggleSearchField = (field) => {
    setActiveSearchField(activeSearchField === field ? null : field);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(room => room.id === roomTypeId);
    return roomType ? capitalizeFirstLetter(roomType.name) : 'Unknown Category';
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "25px", fontWeight: "500", display: 'flex', alignItems: 'center' }}>
        <div className={"mt-20 ml-5"}>
          <p style={{ marginRight: '10px' }}>Room Templates</p>
        </div>
        <div className={"mt-20 ml-10"} style={{ border: '1px solid black', borderRadius: '20px', padding: '10px 40px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleSearchField('roomTemplates')}>
          <FaSearch />
        </div>
        {activeSearchField === 'roomTemplates' && (
          <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              style={{ padding: '10px', borderRadius: '20px', border: '1px solid black', width: '300px' }}
            />
          </div>
        )}
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "96%" }}>
          <div ref={swiperContainer1} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {templateNames.map((template) => (
                <div key={template.id} className="swiper-slide" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => viewTemplate(template)}>
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
            <div className="swiper-pagination swiper-pagination1"></div>
          </div>
        </div>
      </div>

      <hr style={{ border: "1px solid black" }} />

      <div style={{ paddingLeft: "20px", fontSize: "25px", fontWeight: "500", display: 'flex', alignItems: 'center' }}>
        <div className={"mt-5 ml-5"}>
          <p style={{ marginRight: '10px' }}>Recent Designs</p>
        </div>
        <div className={"mt-5 ml-10"} style={{ border: '1px solid black', borderRadius: '20px', padding: '10px 40px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleSearchField('recentDesigns')}>
          <FaSearch />
        </div>
        {activeSearchField === 'recentDesigns' && (
          <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              style={{ padding: '10px', borderRadius: '20px', border: '1px solid black', width: '300px' }}
            />
          </div>
        )}
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "96%" }}>
          <div ref={swiperContainer2} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {templateNames.map((template) => (
                <div key={template.id} className="swiper-slide" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => viewTemplate(template)}>
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
            <div className="swiper-pagination swiper-pagination2"></div>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default FreeUserHomepage;
