import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import Topbar from '../BusinessUser/Topbar';
import Footer from "../Landing/Footer";

const BU_ViewObjects = () => {
  const location = useLocation();
  const { roomType } = location.state || {};
  const [objects, setObjects] = useState([]);

  const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

  const fetchObjData = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'sense-token': token
    };

    try {
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/object/list',
        {},
        { headers: headers }
      );
      setObjects(response.data.body || []);
    } catch (err) {
      console.error('API Error', err);
    }
  };

  useEffect(() => {
    fetchObjData();
  }, []);

  const viewObjectInfo = (object) => {
    console.log(object);

    const id = object.id;
    const name = object.name;
    const categoryID = object.category_ids;
    const description = object.product_description;
    const tags = object.tag_ids;
    const objURL = object.object_media.preview;

    navigate('/BU_ViewObjectsInfo', {
      state: {
        id,
        name,
        categoryID,
        description,
        tags,
        objURL
      }
    });
  }

  return (
    <div>
      <Topbar title="View Objects" onClick={handleGoBack} />
      <div style={{ paddingLeft: "20px", fontSize: "25px", fontWeight: "500" }}>
        <div className={"mt-10 ml-5"}>
          {roomType && <p>{roomType}</p>}
        </div>
      </div>

      <div style={{ paddingTop: "20px", paddingLeft: "50px", paddingRight: "50px" }} className="justify-center">
        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: "100%" }}>
        {objects.map((object, index) => {
          return (
            <div key={index} onClick={() => viewObjectInfo(object)} style={{ backgroundColor: '#D1D5DB', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}}>
              <div style={{ width: '150px', height: '150px', backgroundColor: '#E5E7EB', borderRadius: '10px', marginBottom: '10px' }}>
                <img src={object.object_media.preview} alt={object.name} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                <p>{object.name}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BU_ViewObjects;