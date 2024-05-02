import React from 'react';
import freeImage from '../../assets/zero.jpeg';
import premiumImage from '../../assets/ten.png';
import { useNavigate } from 'react-router-dom';

const Plan = () => {
  const navigate = useNavigate();
  const handleClickCreateAcc = () => navigate('/signup');
  const handleClickBuyPlan = () => navigate('/paid-signup');
  return (
    <div name='plan' className="flex justify-center mt-10">
      {/* Free Account */}
      <div className="w-80 bg-white rounded-lg p-6 m-4">
        <div className="text-center mb-6">
          <div className="bg-blue-500 text-white rounded-md py-2 px-4 inline-block">Free Account</div>
        </div>
        <img src={freeImage} alt="Free Account" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickCreateAcc} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full">Create Account</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        <ul className="list-disc list-inside">
          <li>Create your own room</li>
          <li>Access to ready-made templates</li>
          <li>Access to selected trial objects</li>
          <li>Cannot export rooms</li>
          {/* Add more features as needed */}
        </ul>
      </div>

      {/* Premium */}
      <div className="w-80 bg-white rounded-lg p-6 m-4">
        <div className="text-center mb-6">
          <div className="bg-yellow-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
        </div>
        <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30" />
        <div className="text-center mb-6">
          <button onClick={handleClickBuyPlan} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full">Buy Plan</button>
        </div>
        <hr className="border-gray-400 mb-6" />
        <ul className="list-disc list-inside">
          <li>Create your own room</li>
          <li>Access to ready-made templates</li>
          <li>Access to the whole collection of objects we offer</li>
          <li>Can export rooms</li>
          <li>Able to customise display settings (dark/light mode, text sizes, etc.)</li>
          <li>Access to premium only tips</li>
          <li>Easily manage your subscription, cancel anytime.</li>
          {/* Add more features as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Plan;
