import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';
import freeImageSrc from '../../assets/zero.jpeg'; // Default image source

const LandingFreePlan = () => {
  const navigate = useNavigate();
  const { freePlan, loading, fetchFreePlan, updatePlanPage } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true);
      setEditMode(false);
      fetchFreePlan();
    },
    onError: (error) => {
      console.error('Error updating plan page:', error);
      alert('Failed to update plan page. Please try again later.');
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [freeAccountText, setFreeAccountText] = useState('Free Account');
  const [createAccountButtonText, setCreateAccountButtonText] = useState('Create Account');
  const [freeFeatures, setFreeFeatures] = useState([
    "Create your own room",
    "Access to ready-made templates",
    "Access to the whole collection of objects",
  ]);
  const [freeImage, setFreeImage] = useState(freeImageSrc);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFeatureChange = (index, event) => {
    const updatedFeatures = [...freeFeatures];
    updatedFeatures[index] = event.target.value;
    setFreeFeatures(updatedFeatures);
  };

  const handleUpdatePlanPage = () => {
    updatePlanPage();
    // You might need a separate method to update features as well.
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFreeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFeatures = () => (
    <ul className="list-none pl-0">
      {freeFeatures.map((feature, index) => (
        <li key={index} className="mb-2">
          {editMode ? (
            <input
              type="text"
              value={feature}
              onChange={(event) => handleFeatureChange(index, event)}
              className="border-b-2 border-gray-300 bg-transparent w-full"
            />
          ) : (
            <div className="flex items-center">
              <i className="fas fa-check text-green-500 mr-2"></i>
              {feature}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div name='plan' className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className='text-center mx-auto max-w-screen-lg'>
        <div className="flex justify-center mt-10">
          <div className="w-80 bg-white rounded-lg p-6 m-4 shadow-lg">
            <div className="text-center mb-6">
              <div className="bg-blue-500 text-white rounded-md py-2 px-4 inline-block">
                {freeAccountText}
              </div>
            </div>
            <img src={freeImage} alt="Free Account" className="mx-auto mb-6 w-35 h-30" />
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full">
              {createAccountButtonText}
            </button>
            <hr className="border-gray-400 mb-6" />
            {renderFeatures()}
          </div>
        </div>
        <button
          onClick={toggleEditMode}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2"
        >
          {editMode ? 'Save Changes' : 'Edit Features'}
        </button>
      </div>
      {successMessage && (
        <AlertPopup
          title="Success"
          text="Updated Successfully!"
          onClose={() => setSuccessMessage(false)}
        />
      )}
    </div>
  );
}

export default LandingFreePlan;
