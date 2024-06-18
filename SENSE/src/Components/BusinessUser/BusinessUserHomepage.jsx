import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios'; 
import { getHeaders } from '../../../apiUtils';
import "./BusinessUserHomepage.css";

const BusinessUserHomepage = () => {
  const navigate = useNavigate();
  const handleClickCreateTemplate = () => navigate('/CreateTemplate');
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);
  const [error, setError] = useState(null);

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

    const initializeSwiper = () => {
      if (swiperContainer2.current) {
        new Swiper(swiperContainer2.current, {
          slidesPerView: 'auto',
          spaceBetween: 20,
        });
      }
      if (swiperContainer1.current) {
        new Swiper(swiperContainer1.current, {
          slidesPerView: 'auto',
          spaceBetween: 20,
        });
      }
    };

    if (roomTypes.length > 0 && swiperContainer2.current) {
      initializeSwiper();
    }

    const handleScroll = () => {
      if (showDropdown) {
        const rect = swiperContainer2.current.getBoundingClientRect();
        setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDropdown, navigate, roomTypes]);

  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    // Implement deletion logic here
    setShowDeleteConfirmation(false);
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

  return (
    <div>
      <Navbar />

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
              {templateNames.map((template, index) => (
                <div key={index} className="swiper-slide" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={toggleDropdown}>...</div>
                  <FaPencilAlt style={{ position: 'absolute', top: '10px', left: '10px', cursor: 'pointer' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DB', borderRadius: '20px', padding: '20px' }}>
                    <div className="bg-gray-300" style={{ borderRadius: '20px', height: '200px', marginBottom: '10px' }}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <p>Template Name</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p>{template.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown list for Room Templates */}
      {showDropdown && (
        <div style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
          <ul>
            <li>View</li>
            <li>Update</li>
            <li onClick={() => handleDelete(deleteIndex)}>Delete</li>
          </ul>
        </div>
      )}

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
                  <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={toggleDropdown}>...</div>
                  <FaPencilAlt style={{ position: 'absolute', top: '10px', left: '10px', cursor: 'pointer' }} />
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

      {/* Dropdown list for Room Objects */}
      {showDropdown && (
        <div style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
          <ul>
            <li>View</li>
            <li>Update</li>
            <li>Delete</li>
          </ul>
        </div>
      )}

      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default BusinessUserHomepage;
