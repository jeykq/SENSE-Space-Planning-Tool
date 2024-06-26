import React, { useRef, useEffect, useState } from "react";
import Swiper from "swiper";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";
import { FaPencilAlt, FaSearch } from "react-icons/fa"; // Import the search icon

const PremiumUserHomepage = () => {
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [activeSearchField, setActiveSearchField] = useState(null); // State for tracking active search field
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (swiperContainer1.current) {
      new Swiper(swiperContainer1.current, {
        slidesPerView: 3,
        spaceBetween: 20,
      });
    }

    if (swiperContainer2.current) {
      new Swiper(swiperContainer2.current, {
        slidesPerView: 3,
        spaceBetween: 20,
      });
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
  }, [showDropdown]);

  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  const toggleSearchField = (field) => {
    setActiveSearchField(activeSearchField === field ? null : field);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
          <div className={"mt-20 ml-10"} style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
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

      <div style={{ paddingTop: "20px", paddingLeft: "100px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "100%" }}>
          <div ref={swiperContainer1} className="swiper-container" style={{ paddingLeft: "40px", paddingRight: "50px", paddingBottom: "50px", width: "90%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="swiper-slide" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={toggleDropdown}>...</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DB', borderRadius: '20px', padding: '20px' }}>
                    <div className="bg-gray-300" style={{ borderRadius: '20px', width: '100%', height: '200px', marginBottom: '10px' }}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <p> [Placeholder for Template Name] </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p> [Placeholder for Category] </p>
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
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}

      <hr style={{ border: "1px solid black" }} />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "25px", fontWeight: "500", display: 'flex', alignItems: 'center' }}>
        <div className={"ml-5"}>
          <p style={{ marginRight: '10px' }}>Recent Designs</p>
        </div>
        <div className={"mt-1 ml-10"} style={{ border: '1px solid black', borderRadius: '20px', padding: '10px 40px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleSearchField('recentDesigns')}>
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

      <div style={{ paddingTop: "20px", paddingBottom: "0px", paddingLeft: "100px" }} className="justify-center">
        <div className="flex items-center" style={{ width: "90%" }}>
          <div ref={swiperContainer2} className="swiper-container" style={{ paddingLeft: "40px", paddingRight: "50px", width: "100%", height: "350px", overflow: "hidden" }}>
            <div className="swiper-wrapper">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="swiper-slide" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '30%', backgroundColor: 'white', cursor: 'pointer' }} onClick={toggleDropdown}>...</div>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', paddingTop: "8px", paddingLeft: "10px" }}> {/* Pencil Icon */}
                    <FaPencilAlt style={{ cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DB', borderRadius: '20px', padding: '20px' }}>
                    <div className="bg-gray-300" style={{ borderRadius: '20px', width: '100%', height: '200px', marginBottom: '10px' }}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <p> [Placeholder for Room Name] </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p> [Placeholder for Category] </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown list for Object Categories */}
      {showDropdown && (
        <div style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default PremiumUserHomepage;