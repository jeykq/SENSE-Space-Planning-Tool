import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import Footer from "../Landing/Footer";
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const SA_UpdateLanding = () => {
  // Hardcoded initial content for testing
  const initialLandingContent = `
    <div>
      <h1>Welcome to Our Website</h1>
      <p>This is the landing page content.</p>
    </div>
  `;

  const [landingContent, setLandingContent] = useState(initialLandingContent);
  const [editedLandingContent, setEditedLandingContent] = useState(initialLandingContent);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setLandingContent(editedLandingContent);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedLandingContent(landingContent);
    setIsEditing(false);
  };

  return (
    <div>
      <Navbar />
      <div>
        {isEditing ? (
          <h2 style={{ textAlign: "center" }}>Edit Landing Page</h2>
        ) : (
          <h2 style={{ textAlign: "center" }}>Landing Page Content</h2>
        )}
      </div>
      <div style={{ paddingTop: "100px", paddingLeft: "50px", paddingRight: "50px" }} className="justify-center">
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", textAlign: "center", maxWidth: "600px", margin: "0 auto", background: isEditing ? "none" : "#f0f0f0" }}>
          {isEditing ? (
            <div>
              <label htmlFor="landingContent"><strong>Landing Page Content:</strong></label>
              <textarea
                id="landingContent"
                value={editedLandingContent}
                onChange={(e) => setEditedLandingContent(e.target.value)}
                style={{ width: "100%", minHeight: "300px" }}
              />
            </div>
          ) : (
            <div>
              <div style={{ background: "#fff", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
                <pre>{landingContent}</pre>
              </div>
            </div>
          )}
          {isEditing ? (
            <div>
              <button style={{ marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer" }} onClick={handleSaveClick}>Save</button>
              <button style={{ backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer" }} onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button style={{ backgroundColor: "#008CBA", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer", marginTop: "10px" }} onClick={handleEditClick}>Edit</button>
          )}
        </div>
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      </div>
      <Footer />
    </div>
  );
};

export default SA_UpdateLanding;
