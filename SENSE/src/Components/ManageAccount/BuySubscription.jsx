import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../FreeUser/Topbar';
import premiumImage from '../../assets/ten.png';
import scanpay from '../../assets/scanpay.png';
import supportedbanks from '../../assets/supportedbanks.png';
import visa from '../../assets/visa.png';
import debit from '../../assets/debit.png';
import ucb from '../../assets/ucb.jpeg';
import axios from 'axios';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils';
import { getHeaders } from '../../../apiUtils';
import { TailSpin } from 'react-loader-spinner';

const BuySubscription = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [billingCountry, setBillingCountry] = useState('Singapore'); // Default to Singapore
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [premiumFeatures, setPremiumFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state for the loader

    useEffect(() => {
        const headers = getHeaders(); 

        const fetchAccountDetails = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/user/get',
                    {},
                    { headers }
                );

                if (!response.data) {
                    throw new Error('No data returned');
                }

                const accountDetails = response.data.body;
                setEmail(accountDetails.email);
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };

        fetchAccountDetails();
    }, []);

    const { fetchLandingPageData, premiumPlanFeatures } = LandingPageAPIUtils({
        onUpdateSuccess: () => {}, 
        onError: (error) => {
            console.error('Error fetching data for BuySubscription component:', error);
        }
    });

    useEffect(() => {
        // Fetch landing page data on component mount
        fetchLandingPageData();
    }, []);

    useEffect(() => {
        // Update premium features when premiumPlanFeatures change
        setPremiumFeatures(premiumPlanFeatures);
    }, [premiumPlanFeatures]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show loader when form is submitted
    
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('https://api.sensespacesplanningtool.com/user/buy_subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'sense-token': token
                },
                body: JSON.stringify({
                    email
                }),
            });
            console.log(response);
            if (response.ok) {
                console.log('Upgraded to premium subscription successfully');
                
                // Introduce a delay before hiding the loader and showing the popup
                setTimeout(() => {
                    setIsLoading(false); // Hide loader after the delay
                    setShowPopup(true); // Show the popup
                    
                    const timer = setTimeout(() => {
                        navigate('/viewaccount');
                    }, 3000);
    
                    return () => clearTimeout(timer);
                }, 3000); // 3 seconds delay
            } else {
                const errorData = await response.json();
                console.error('Buy subscription failed:', errorData);
                setErrors({ general: 'Buy subscription failed.' });
                setIsLoading(false); // Hide loader on error
            }
        } catch (error) {
            console.error('Error during buying subscription:', error);
            setErrors({ general: 'Buy subscription failed.' });
            setIsLoading(false); // Hide loader on error
        }
    };
    
    
    const countryList = [
        'Singapore', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France', 'China', 'Japan', 'Brazil', 'Russia', 'South Africa', 'Mexico', 'Argentina', 'Italy', 'Spain', 'South Korea', 'Indonesia', 'Saudi Arabia',
    ];

    const handleGoBack = () => {
        navigate('/viewaccount');
    };

    const handleClickBuyPlan = () => navigate('/paid-signup');

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
                            <div className="bg-orange-500 text-white rounded-md py-2 px-4 inline-block">Premium</div>
                        </div>
                        <img src={premiumImage} alt="Premium" className="mx-auto mb-6 w-35 h-30 pointer-events-none" />
                        <hr className="border-gray-400 mb-6" />
                        {renderFeatures(premiumFeatures)}
                    </div>
                </div>
                <div className="w-1/2 px-10 py-8 mt-4 flex justify-center">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-8 w-80 flex flex-col -translate-x-12">
                            <label>Email: </label>
                            <input type="email" name="Email" className="border border-gray-400 py-1 px-2 w-full mt-5 rounded" value={email} readOnly />
                            <div className="flex flex-col mt-5 h-48 overflow-y-auto">
                                <div>
                                    <h3>Payment:</h3>
                                </div>
                                <div className="relative w-full mt-2">
                                    <input type="text" placeholder="1234 1234 1234 1234" className="border border-gray-400 py-1 px-2 w-full rounded" required />
                                    <div className="absolute top-0 right-0 flex items-center mt-2 mr-2">
                                        <img src={visa} alt="visa" className="w-10 h-6 ml-1" />
                                        <img src={debit} alt="debit" className="w-10 h-6 ml-1" />
                                        <img src={ucb} alt="ucb" className="w-10 h-6 ml-1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5 w-full my-2">
                                    <input type="text" placeholder="MM/YY" className="border border-gray-400 py-1 px-2 w-full rounded" required />
                                    <input type="text" placeholder="CVC" className="border border-gray-400 py-1 px-2 w-full rounded" required />
                                </div>
                                <input type="text" placeholder="Full Name on Card" className="border border-gray-400 py-1 px-2 w-full rounded" required />
                                <select className="border border-gray-400 py-1 px-2 w-full mt-2 rounded" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} required>
                                    {countryList.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-5 w-full flex items-center justify-center">
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                    <TailSpin
                                        visible={true}
                                        height="24"
                                        width="24"
                                        color="#fff"
                                        ariaLabel="tail-spin-loading"
                                        radius="1"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />
                                    <span className="ml-2">Payment Loading</span>
                                    </div>
                                ) : (
                                    'Buy Subscription'
                                )}
                            </button>
                            <div className="mt-20 px-1 py-1 flex flex-col">
                                <p className="ml-auto text-sm text-slate-500">Supported Banks</p>
                                <div className="py-1 px-1">
                                    <img src={supportedbanks} alt="supportedbanks" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {showPopup && 
                <div className="fixed top-[40%] left-[39%] px-[20px] py-[40px] bg-black/60 text-white z-90 max-w-[280px] text-center rounded-lg">
                    <div className="flex flex-col">
                        <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={() => setShowPopup(false)}>&times;</span>
                        <p>Successfully upgraded to premium account.</p>
                        <p>Thank you!</p>
                    </div>
                </div>
            }
        </>
    );
};

export default BuySubscription;
