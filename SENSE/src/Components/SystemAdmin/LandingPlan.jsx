import React, { useEffect, useState } from 'react';
import freeImage from '../../assets/zero.jpeg';
import premiumImage from '../../assets/ten.png';
import { useNavigate } from 'react-router-dom';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LandingPlan = () => {
  const [freeFeatures, setFreeFeatures] = useState([]);
  const [premiumFeatures, setPremiumFeatures] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedFreeFeatures, setEditedFreeFeatures] = useState([]);
  const [editedPremiumFeatures, setEditedPremiumFeatures] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const { freePlanFeatures, premiumPlanFeatures, fetchLandingPageData, updateLandingPage } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true);
      setEditMode(false);
      fetchLandingPageData();
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
      alert('Failed to update landing page. Please try again later.');
    }
  });

  useEffect(() => {
    fetchLandingPageData();
  }, []);

  useEffect(() => {
    setFreeFeatures(freePlanFeatures);
    setPremiumFeatures(premiumPlanFeatures);
    setEditedFreeFeatures(freePlanFeatures);
    setEditedPremiumFeatures(premiumPlanFeatures);
  }, [freePlanFeatures, premiumPlanFeatures]);

  const handleFeatureChange = (index, value, planType) => {
    if (planType === 'free') {
      const updatedFeatures = [...editedFreeFeatures];
      updatedFeatures[index] = value;
      setEditedFreeFeatures(updatedFeatures);
    } else if (planType === 'premium') {
      const updatedFeatures = [...editedPremiumFeatures];
      updatedFeatures[index] = value;
      setEditedPremiumFeatures(updatedFeatures);
    }
  };

  const handleAddFeature = (planType) => {
    if (planType === 'free') {
      setEditedFreeFeatures([...editedFreeFeatures, '']);
    } else if (planType === 'premium') {
      setEditedPremiumFeatures([...editedPremiumFeatures, '']);
    }
  };

  const handleRemoveFeature = (index, planType) => {
    if (planType === 'free') {
      const updatedFeatures = [...editedFreeFeatures];
      updatedFeatures.splice(index, 1);
      setEditedFreeFeatures(updatedFeatures);
    } else if (planType === 'premium') {
      const updatedFeatures = [...editedPremiumFeatures];
      updatedFeatures.splice(index, 1);
      setEditedPremiumFeatures(updatedFeatures);
    }
  };

  const handleUpdateLandingPage = () => {
    updateLandingPage({
      freePlanFeatures: editedFreeFeatures,
      premiumPlanFeatures: editedPremiumFeatures,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedFreeFeatures(freePlanFeatures);
    setEditedPremiumFeatures(premiumPlanFeatures);
  };

  const renderFeatures = (features, planType) => (
    <ul className="list-none pl-0">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <i className="fas fa-check text-green-500 mr-2"></i>
          {editMode ? (
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value, planType)}
              className="bg-transparent text-black border-b-2 border-white p-2 flex-1"
            />
          ) : (
            <span className="flex-1">{feature}</span>
          )}
          {editMode && (
            <button
              onClick={() => handleRemoveFeature(index, planType)}
              className="ml-2 text-red-500"
            >
              Remove
            </button>
          )}
        </li>
      ))}
      {editMode && (
        <li>
          <button onClick={() => handleAddFeature(planType)} className="text-blue-500">
            Add Feature
          </button>
        </li>
      )}
    </ul>
  );

  return (
    <div name='plan' className="flex flex-col items-center mt-10">
      <div className="flex flex-row space-x-4">
        {/* Free Account */}
        <div className="w-80 bg-white rounded-lg p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="bg-blue-500 text-white rounded-md py-2 px-4 inline-block">Free Account</div>
          </div>
          <img src={freeImage} alt="Free Account" className="mx-auto mb-6 w-35 h-30" />
          <div className="text-center mb-6">
            <div className="bg-blue-500 text-white py-2 px-4 rounded-full inline-block">Create Account</div>
          </div>
          <hr className="border-gray-400 mb-6" />
          {renderFeatures(editMode ? editedFreeFeatures : freeFeatures, 'free')}
        </div>

        {/* Premium */}
        <div className="w-80 bg-white rounded-lg p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="bg-yellow-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
          </div>
          <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30" />
          <div className="text-center mb-6">
            <div className="bg-yellow-500 text-white py-2 px-4 rounded-full inline-block">Buy Plan</div>
          </div>
          <hr className="border-gray-400 mb-6" />
          {renderFeatures(editMode ? editedPremiumFeatures : premiumFeatures, 'premium')}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        {editMode ? (
          <>
            <button
              onClick={handleUpdateLandingPage}
              className="bg-red-500 hover:bg-red-700 text-white rounded-full px-4 py-2 my-2"
            >
              Update
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-700 text-white rounded-full px-4 py-2 my-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2"
          >
            Edit Plans
          </button>
        )}
      </div>

      {successMessage && (
        <AlertPopup
          title="Success"
          text="Updated Successfully!"
          onClose={() => setSuccessMessage(false)}
          onOk={() => setSuccessMessage(false)}
        />
      )}
    </div>
  );
}

export default LandingPlan;
