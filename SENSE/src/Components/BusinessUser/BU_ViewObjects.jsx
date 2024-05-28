import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../Landing/Footer";

const BU_ViewObjects = () => {
  const objects = [
    { name: "Object 1", image: "https://via.placeholder.com/150" },
    { name: "Object 2", image: "https://via.placeholder.com/150" },
    { name: "Object 3", image: "https://via.placeholder.com/150" },
    { name: "Object 4", image: "https://via.placeholder.com/150" },
    { name: "Object 5", image: "https://via.placeholder.com/150" },
    { name: "Object 6", image: "https://via.placeholder.com/150" },
    { name: "Object 7", image: "https://via.placeholder.com/150" },
    { name: "Object 8", image: "https://via.placeholder.com/150" },
    { name: "Object 9", image: "https://via.placeholder.com/150" },
    { name: "Object 10", image: "https://via.placeholder.com/150" },
    { name: "Object 11", image: "https://via.placeholder.com/150" },
    { name: "Object 12", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "25px", fontWeight: "500" }}>
      <div className={"mt-20 ml-5"}>
          <p>(Category_Name)</p>
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingLeft: "50px", paddingRight: "50px" }} className="justify-center">
        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: "100%" }}>
          {objects.map((object, index) => (
            <div key={index} style={{ backgroundColor: '#D1D5DB', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '150px', height: '150px', backgroundColor: '#E5E7EB', borderRadius: '10px', marginBottom: '10px' }}>
                <img src={object.image} alt={object.name} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                <p>{object.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BU_ViewObjects;