import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import { FaPencilAlt, FaEllipsisH } from "react-icons/fa"; // Import the pencil and ellipsis icons

const ViewTemplates = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(null);

  const handleGoBack = () => {
    navigate('/BusinessUserHomepage'); 
  };

  const toggleDropdown = (event, index) => {
    setCurrentTemplateIndex(index);
    setShowDropdown(!showDropdown);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  const handleAction = (action) => {
    // Handle the action (View, Update, Delete) here
    console.log(`Action: ${action} on template index: ${currentTemplateIndex}`);
    setShowDropdown(false);
  };

  return (
    <div>
      <Topbar title="My Templates" onClick={handleGoBack} />
      <div style={{ padding: "20px" }}>
        <div>
          <h2>My Drafts</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "200px", height: "200px", backgroundColor: "#D1D5DB", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px" }}>
              <button style={{ fontSize: "30px", fontWeight: "bold", border: "none", background: "transparent" }}>+</button>
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} style={{ width: "200px", height: "200px", backgroundColor: "#D1D5DB", borderRadius: "10px", position: "relative" }}>
                <FaPencilAlt style={{ position: "absolute", top: "10px", left: "10px", cursor: "pointer" }} />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "1px solid white"
                  }}
                  onClick={(e) => toggleDropdown(e, index)}
                >
                  <FaEllipsisH />
                </div>
                <div style={{ textAlign: "center", marginTop: "60px" }}>
                  <p>Template Name</p>
                  <p>Living Room</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: "40px" }}>
          <h2>Published Templates</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            {[...Array(3)].map((_, index) => (
              <div key={index} style={{ width: "200px", height: "200px", backgroundColor: "#D1D5DB", borderRadius: "10px", position: "relative" }}>
                <FaPencilAlt style={{ position: "absolute", top: "10px", left: "10px", cursor: "pointer" }} />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "1px solid white"
                  }}
                  onClick={(e) => toggleDropdown(e, index)}
                >
                  <FaEllipsisH />
                </div>
                <div style={{ textAlign: "center", marginTop: "60px" }}>
                  <p>Template Name</p>
                  <p>Living Room</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDropdown && (
        <div style={{ position: 'absolute', top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px`, backgroundColor: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
          <ul>
            <li onClick={() => handleAction('View')}>View</li>
            <li onClick={() => handleAction('Update')}>Update</li>
            <li onClick={() => handleAction('Delete')}>Delete</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewTemplates;