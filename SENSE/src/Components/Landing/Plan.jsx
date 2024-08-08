import React, { useState, useEffect } from 'react';
import freeImage from '../../assets/zero.jpeg';
import premiumImage from '../../assets/ten.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils';
import { useNavigate } from 'react-router-dom';

const Plan = () => {
  const { freePlanFeatures, premiumPlanFeatures, fetchLandingPageData } = LandingPageAPIUtils({
    onUpdateSuccess: () => {}, // Define success callback if needed
    onError: (error) => {
      console.error('Error fetching data for Plan component:', error);
      // Handle error as needed (e.g., display error message)
    }
  });

  const [editedFreeFeatures, setEditedFreeFeatures] = useState([]);
  const [editedPremiumFeatures, setEditedPremiumFeatures] = useState([]);

  useEffect(() => {
    // Fetch landing page data on component mount
    fetchLandingPageData();
  }, []);

  useEffect(() => {
    // Update edited features when freePlanFeatures or premiumPlanFeatures change
    setEditedFreeFeatures(freePlanFeatures);
    setEditedPremiumFeatures(premiumPlanFeatures);
  }, [freePlanFeatures, premiumPlanFeatures]);

  const navigate = useNavigate();
  const handleClickCreateAcc = () => navigate('/signup');
  const handleClickBuyPlan = () => navigate('/paid-signup');

  const renderFeatures = (features) => (
    <ul className="list-none pl-0">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <i className="fas fa-check text-green-500 mr-2"></i>
          {feature}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex justify-center mt-10">
      {/* Free Account */}
      <div className="w-80 bg-white rounded-lg p-6 m-4" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
        <div className="text-center mb-6">
          <div className="bg-blue-500 text-white rounded-md py-2 px-4 inline-block">Free Account</div>
        </div>
        <img src={freeImage} alt="Free Account" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickCreateAcc} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full">Create Account</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        {editedFreeFeatures.length > 0 ? renderFeatures(editedFreeFeatures) : <p>No features available</p>}
      </div>

      {/* Premium */}
      <div className="w-80 bg-white rounded-lg p-6 m-4" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
        <div className="text-center mb-6">
          <div className="bg-orange-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
        </div>
        <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickBuyPlan} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full">Buy Plan</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        {editedPremiumFeatures.length > 0 ? renderFeatures(editedPremiumFeatures) : <p>No features available</p>}
      </div>
    </div>
  );
}

export default Plan;
