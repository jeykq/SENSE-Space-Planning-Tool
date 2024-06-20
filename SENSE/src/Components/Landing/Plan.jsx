import React from 'react';
import freeImage from '../../assets/zero.jpeg';
import premiumImage from '../../assets/ten.png';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Plan = () => {
  const navigate = useNavigate();
  const handleClickCreateAcc = () => navigate('/signup');
  const handleClickBuyPlan = () => navigate('/paid-signup');
  
  const freeFeatures = [
    "Create your own room",
    "Access to ready-made templates",
    "Access to the whole collection of objects",
    // Add more features as needed
  ];
  
  const premiumFeatures = [
    "Create your own room",
    "Access to ready-made templates",
    "Access to the whole collection of objects",
    "Can import rooms",
    "Can export rooms",
    "Able to customise display settings (dark/light mode, text sizes, etc.)",
    "Access to premium only tips",
    "Easily manage your subscription, cancel anytime.",
    // Add more features as needed
  ];

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
    <div name='plan' className="flex justify-center mt-10">
      {/* Free Account */}
      <div className="w-80 bg-white rounded-lg p-6 m-4 shadow-lg">
        <div className="text-center mb-6">
          <div className="bg-blue-500 text-white rounded-md py-2 px-4 inline-block">Free Account</div>
        </div>
        <img src={freeImage} alt="Free Account" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickCreateAcc} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full">Create Account</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        {renderFeatures(freeFeatures)}
      </div>

      {/* Premium */}
      <div className="w-80 bg-white rounded-lg p-6 m-4 shadow-lg">
        <div className="text-center mb-6">
          <div className="bg-yellow-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
        </div>
        <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickBuyPlan} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full">Buy Plan</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        {renderFeatures(premiumFeatures)}
      </div>
    </div>
  );
}

export default Plan;
