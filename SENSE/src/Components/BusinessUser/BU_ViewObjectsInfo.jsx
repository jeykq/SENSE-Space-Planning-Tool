import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";

const BU_ViewObjectsInfo = () => {
  const [productName, setProductName] = useState("Product Name");
  const [objectCategory, setObjectCategory] = useState("Object Category");
  const [productDescription, setProductDescription] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquam lobortis est, nec ullamcorper metus. Duis nec nisl id nisi eleifend viverra. Nulla facilisi.");
  const [isEditing, setIsEditing] = useState(false);

  const [editedProductName, setEditedProductName] = useState(productName);
  const [editedObjectCategory, setEditedObjectCategory] = useState(objectCategory);
  const [editedProductDescription, setEditedProductDescription] = useState(productDescription);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle editing mode
  };

  const handleSaveClick = () => {
    // Save the edited values
    setProductName(editedProductName);
    setObjectCategory(editedObjectCategory);
    setProductDescription(editedProductDescription);
    
    setIsEditing(false); // Exit editing mode
  };

  const handleCancelClick = () => {
    // Reset edited values to original
    setEditedProductName(productName);
    setEditedObjectCategory(objectCategory);
    setEditedProductDescription(productDescription);

    setIsEditing(false); // Exit editing mode
  };

  return (
    <div>
      <Navbar />

      <div>
        {/* Conditionally render title based on editing mode */}
        {isEditing ? (
          <h2 style={{ textAlign: "center" }}>Edit Object Information</h2>
        ) : (
          <h2 style={{ textAlign: "center" }}>Object Information</h2>
        )}
      </div>

      <div style={{ paddingTop: "100px", paddingLeft: "50px", paddingRight: "50px" }} className="justify-center">
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", textAlign: "center", maxWidth: "600px", margin: "0 auto", background: isEditing ? "none" : "#f0f0f0" }}>
          {/* Render editable fields when in editing mode */}
          {isEditing ? (
            <div>
              <label htmlFor="productName"><strong>Product Name:</strong></label>
              <input type="text" id="productName" value={editedProductName} onChange={(e) => setEditedProductName(e.target.value)} />
              <br />
              <label htmlFor="objectCategory"><strong>Object Category:</strong></label>
              <select id="objectCategory" value={editedObjectCategory} onChange={(e) => setEditedObjectCategory(e.target.value)}>
                <option value="Category 1">Category 1</option>
                <option value="Category 2">Category 2</option>
                <option value="Category 3">Category 3</option>
              </select>
              <br />
              <label htmlFor="productDescription"><strong>Product Description:</strong></label>
              <textarea
                id="productDescription"
                value={editedProductDescription}
                onChange={(e) => setEditedProductDescription(e.target.value)}
                style={{ width: "100%", minHeight: "100px" }}
              />
            </div>
          ) : (
            <div>
              {/* Display non-editable fields when not in editing mode */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
                <p><strong>Product Name:</strong> {productName}</p>
                <p><strong>Object Category:</strong> {objectCategory}</p>
                <p><strong>Product Description:</strong> {productDescription}</p>
              </div>
            </div>
          )}

          {/* Render edit button */}
          {isEditing ? (
            <div>
              <button style={{ marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer" }} onClick={handleSaveClick}>Save</button>
              <button style={{ backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer" }} onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button style={{ backgroundColor: "#008CBA", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer", marginTop: "10px" }} onClick={handleEditClick}>Edit</button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BU_ViewObjectsInfo;
