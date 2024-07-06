import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../FreeUser/Topbar';
import premiumFeatures from '../Landing/Plan';
import premiumImage from '../../assets/ten.png';
import scanpay from '../../assets/scanpay.png';
import supportedbanks from '../../assets/supportedbanks.png';

const BuySubscription = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    // const handleSubmit = () => {
    //     // Handle the submit action here
    //     console.log('Review submitted:', { rating, review });
    //     setShowPopup(true); // Show popup on submit
    // };

    const handleGoBack = () => {
        navigate('/viewaccount'); 
    };

    const handleClickBuyPlan = () => navigate('/paid-signup');

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
                <li key={index} className="flex items-center mb-2 text-sm">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                </li>
            ))}
        </ul>
    );

    return (
      <>
        <Topbar title="Buy subscription" onClick={handleGoBack} />
        <div className="w-full flex">
            <div className="w-1/2 px-10 py-8 mt-4 flex justify-center">
                <div className="max-w-[400px] bg-white rounded-lg p-6 m-4 shadow-lg translate-x-12">
                    <div className="text-center mb-6">
                        <div className="bg-yellow-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
                    </div>
                    <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30 pointer-events-none" />
                    {/* <div className="text-center mb-6">
                        <button onClick={handleClickBuyPlan} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full">Buy Plan</button>
                    </div> */}
                    <hr className="border-gray-400 mb-6" />
                    {renderFeatures(premiumFeatures)}
                </div>
            </div>
            <div className="w-1/2 px-10 py-8 mt-4 flex justify-center">
                <div className="w-80 flex flex-col -translate-x-12">
                    <label>Email: </label>
                    <input
                        name="email"
                        type="text"
                        // value="1"
                        // onChange={(e) => setNewRoomTypeName(e.target.value)}
                        placeholder="Enter email address"
                        className="px-3 py-1 border border-gray-300 rounded w-full mt-1"
                    />
                    <label className="mt-8">Select payment method: </label>
                    <select name="payment_method" className="border border-gray-400 py-1 px-3 w-full mt-1 rounded">
                        <option value="0">Paynow</option>
                        <option value="1">Credit Card</option>
                    </select>
                    <div className="mt-8 px-1 py-1 flex flex-col">
                        <p>Scan below QR code using your internet banking app.</p>
                        <div className="flex justify-center p-2">
                            <img src={scanpay} alt="scanpay" style={{width: '120px', height: '140px'}} />
                        </div>
                    </div>
                    <div className="mt-16 px-1 py-1 flex flex-col">
                        <p className="ml-auto text-sm text-slate-500">Supported Banks</p>
                        <div className="py-1 px-1">
                            <img src={supportedbanks} alt="supportedbanks" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {showPopup && 
            <div className="fixed top-[40%] left-[44%] px-[20px] py-[40px] bg-black/60 text-white z-90 max-w-[280px] text-center rounded-lg">
                <div className="flex flex-col">
                    <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={() => setShowPopup(false)}>&times;</span>
                    <p>Payment completed!</p>
                    <p>Thank you!</p>
                </div>
            </div>
        }
      </>
    );
};

export default BuySubscription;