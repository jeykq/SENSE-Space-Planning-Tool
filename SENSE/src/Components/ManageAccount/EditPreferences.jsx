import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';
import BusinessUserTopbar from '../BusinessUser/Topbar';
import Topbar from '../FreeUser/Topbar';
import PremiumUserTopbar from '../PremiumUser/Topbar';
import ConfirmDialogPopup from "../UI/ConfirmDialog";
import { TailSpin } from 'react-loader-spinner'


const EditPreferences = () => {
    const navigate = useNavigate();
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [darkLightMode, setDarkLightMode] = useState(1);
    const [textSize, setTextSize] = useState(2);

    const handleGoBack = () => {
        navigate('/viewaccount');
    };

    // const handleCancelSubscription = () => {
    //     setShowPopup(true);
    // };

    // const handleSubmit = async () => {
    //     setShowPopup(false);
    //     setIsCancelling(true);
    //     const token = localStorage.getItem('authToken');

    //     if (!token) {
    //         navigate('/login');
    //         return;
    //     }

    //     try {
    //         const response = await fetch('https://api.sensespacesplanningtool.com/user/cancel_subscription', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'sense-token': token
    //             },
    //             body: JSON.stringify({

    //             }),
    //         });
    //         console.log(response);
    //         if (response.ok) {
    //             setIsCancelling(false);
    //             setShowAlert(true); // Show the alert
    //             console.log('Cancelled premium subscription successfully.');
    //             const timer = setTimeout(() => {
    //                 navigate('/viewaccount'); 
    //             }, 3000);

    //             return () => clearTimeout(timer);
    //         } else {
    //             const errorData = await response.json();
    //             console.error('Cancel subscription failed:', errorData);
    //             setError({ general: 'Cancel subscription failed.' });
    //         }
    //     } catch (error) {
    //         console.error('Error during cancelling of subscription:', error);
    //         setError({ general: 'Cancel subscription failed.' });
    //     }
    // };

    useEffect(() => {
        const headers = getHeaders(); 

        if (!headers) {
        setError('Token not found');
        setLoading(false);
        return;
        }
        
        const fetchAccountDetails = async () => {
            try {
            const response = await axios.post(
                'https://api.sensespacesplanningtool.com/user/get', 
                {}, 
                { headers }
            );
            // console.log(response);
            if (!response.data) {
                throw new Error('No data returned');
            }
    
            setLoading(false);
            setAccountDetails(response.data.body);
            } catch (error) {
            console.error('Error fetching account details:', error);
            setError(error.message);
            }
        };
        fetchAccountDetails();
    }, []);

    const fieldContainerStyle = {
        marginBottom: "5px",
        display: "flex",
        alignItems: "center"
      };
    
      const labelStyle = {
        fontWeight: "bold",
        marginRight: "10px",
        minWidth: "150px" 
      };
    
      const valueStyle = {
        backgroundColor: "#EDEFF7",
        padding: "10px",
        borderRadius: "5px",
        display: "inline-block",
        flexGrow: 1 
      };
    
      const buttonContainerStyle = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "300px", 
        marginTop: "0px"
      };
    
      const buttonStyle = {
        backgroundColor: '#dde0ed',
        color: '#333',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '5px',
        flex: '1 1 48%', 
        margin: '5px', 
        transition: 'background-color 0.3s, color 0.3s',
      };
    
      // Function to handle mouse enter event
      const handleMouseEnter = (event) => {
        event.target.style.backgroundColor = '#c5cbeb'; 
        event.target.style.color = '#6c6d70'; 
      };
    
      // Function to handle mouse leave event
      const handleMouseLeave = (event) => {
        event.target.style.backgroundColor = '#dde0ed'; 
        event.target.style.color = '#333'; 
      };
    
      const hrStyle = {
        width: "100%",
        borderTop: "2px solid #ccc5c5",
        margin: "20px 0"
      };

      const DarkLightModeOptions = [
        { value: '1', label: 'Light' },
        { value: '2', label: 'Dark' },
      ];

      const TextSizeOptions = [
        { value: '1', label: 'Small' },
        { value: '2', label: 'Regular' },
        { value: '3', label: 'Large' },
      ];

    if ( loading ) {
        return (
            <>
                {accountDetails && accountDetails.role === "BUSINESS_USER" && <BusinessUserTopbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "FREE_USER" && <Topbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "PREMIUM_USER" && <PremiumUserTopbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "SYS_ADMIN" && <Topbar title="Preferences" onClick={handleGoBack} />}


                <div className="flex h-[90vh] justify-center items-center">
                    <TailSpin
                        visible={true}
                        height="25"
                        width="25"
                        color="#595959"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            </>
            
            
        )
    }
        
    return (
        <>
            {accountDetails && 
                <>
                    {accountDetails && accountDetails.role.includes("BUSINESS_USER") && <BusinessUserTopbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "FREE_USER" && <Topbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "PREMIUM_USER" && <PremiumUserTopbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "SYS_ADMIN" && <Topbar title="Preferences" onClick={handleGoBack} />}

                    <div className="flex flex-col h-[400px] justify-center items-center mt-10">
                        <div>
                            <div style={fieldContainerStyle}>
                                <span style={labelStyle}>Dark/Light mode</span>
                                <div style={valueStyle}>
                                    <select value={darkLightMode} onChange={(e) => setDarkLightMode(e.target.value)} className="bg-[#EDEFF7]">
                                    {DarkLightModeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            <div style={fieldContainerStyle}>
                                <span style={labelStyle}>Text size</span>
                                <div style={valueStyle}>
                                    <select value={textSize} onChange={(e) => setTextSize(e.target.value)} className="bg-[#EDEFF7]">
                                    {TextSizeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            <hr style={hrStyle} />
                        </div>
                        <div style={buttonContainerStyle}>
                            <button 
                                onClick={() => console.log('save button clicked')}
                                style={buttonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                Save
                            </button>
                        </div>
                        {showAlert && 
                            <div className="fixed top-[40%] left-[39%] px-[20px] py-[40px] bg-black/60 text-white z-90 max-w-[280px] text-center rounded-lg">
                                <div className="flex flex-col">
                                    <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={() => setShowAlert(false)}>&times;</span>
                                    <p>Preferences Saved!</p>
                                </div>
                            </div>
                        }
                        {/* {isCancelling &&  */}
                            {/* <div className="flex h-[90vh] justify-center items-center fixed">
                                <TailSpin
                                    visible={isCancelling}
                                    height="25"
                                    width="25"
                                    color="#595959"
                                    ariaLabel="tail-spin-loading"
                                    radius="1"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div> */}
                        {/* } */}
                    </div>
                </>
            }
        </>
    );
}

export default EditPreferences;