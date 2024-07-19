import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import axios from "axios";
import { getHeaders } from '../../../apiUtils';
import "./FreeUserHomepage.css";
import FU_SearchBar from "./FU_SearchBar";

const FreeUserHomepage = () => {
  const navigate = useNavigate();
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
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
  }, [templateNames]);

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

    navigate('/FU_CreateRoom', {
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

  return (
    <div>
      <Navbar handleSearch={handleSearch} />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontWeight: "500" }}>
        <div className={"mt-20 ml-5"}>
          <p style={{ marginRight: '10px', fontSize: "25px" }}>Room Templates</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <FU_SearchBar handleSearch={handleSearch} />
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "96%" }}>
          <div ref={swiperContainer1} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {filteredTemplates.map((template) => (
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

      <hr style={{ border: "1px solid black", margin: "20px 0" }} />

      <div style={{ paddingTop: "10px", paddingLeft: "20px", fontWeight: "500" }}>
        <div className={"mt-0 ml-5"}>
          <p style={{ marginRight: '10px', fontSize: "25px"}}>Recent Designs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <FU_SearchBar handleSearch={handleSearch} />
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "30px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "96%" }}>
          <div ref={swiperContainer2} className="swiper-container" style={{ paddingRight: "40px", paddingBottom: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {filteredTemplates.map((template) => (
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

      <Footer />
    </div>
  );
};

export default FreeUserHomepage;
