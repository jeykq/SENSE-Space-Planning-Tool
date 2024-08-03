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
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [darkLightMode, setDarkLightMode] = useState('light');
    const [textSize, setTextSize] = useState('regular');

    const handleGoBack = () => {
        navigate('/viewaccount');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        const darkMode = darkLightMode === 'dark'; // Convert to boolean for the API
        const newTextSize = textSize; // Use the text size as it is

        try {
            // Update preferences API
            await axios.post(
                'https://api.sensespacesplanningtool.com/user/update/preferences',
                { dark_mode: darkMode, text_size: newTextSize },
                { headers: getHeaders() }
            );

            // Fetch updated account details
            const response = await axios.post(
                'https://api.sensespacesplanningtool.com/user/get',
                {},
                { headers: getHeaders() }
            );

            if (!response.data || !response.data.body) {
                throw new Error('No data returned');
            }

            // Save preferences in local storage
            localStorage.setItem('theme', response.data.body.dark_mode ? 'dark' : 'light');
            localStorage.setItem('textSize', response.data.body.text_size);

            // Set state with new data
            setAccountDetails(response.data.body);
            setShowAlert(true);

            // Apply theme based on the updated preferences
            document.documentElement.classList.toggle("dark", response.data.body.dark_mode);
        } catch (error) {
            console.error('Error updating preferences:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const existingTheme = localStorage.getItem('theme');
        const existingTextSize = localStorage.getItem('textSize');

        if (existingTheme) {
            setDarkLightMode(existingTheme);
            document.documentElement.classList.toggle("dark", existingTheme === 'dark');
        }

        if (existingTextSize) {
            setTextSize(existingTextSize);
        }
    }, []);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/user/get', 
                    {}, 
                    { headers: getHeaders() }
                );

                if (!response.data || !response.data.body) {
                    throw new Error('No data returned');
                }

                setLoading(false);
                setAccountDetails(response.data.body);
            } catch (error) {
                console.error('Error fetching account details:', error);
                setError(error.message);
                setLoading(false);
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

    const handleMouseEnter = (event) => {
        event.target.style.backgroundColor = '#c5cbeb';
        event.target.style.color = '#6c6d70';
    };

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
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
    ];

    const TextSizeOptions = [
        { value: 'small', label: 'Small' },
        { value: 'regular', label: 'Regular' },
        { value: 'large', label: 'Large' },
    ];

    if (loading) {
        return (
            <>
                {accountDetails && accountDetails.role === "BUSINESS_USER" && <BusinessUserTopbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "FREE_USER" && <Topbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "PREMIUM_USER" && <PremiumUserTopbar title="Preferences" onClick={handleGoBack} />}
                {accountDetails && accountDetails.role === "SYS_ADMIN" && <Topbar title="Preferences" onClick={handleGoBack} />}

                <div className="bg-white dark:bg-zinc-800 h-screen">
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
                </div>
            </>
        );
    }

    return (
        <>
            {accountDetails && 
                <div className="h-screen bg-white dark:bg-zinc-800 dark:text-white">
                    {accountDetails && accountDetails.role.includes("BUSINESS_USER") && <BusinessUserTopbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "FREE_USER" && <Topbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "PREMIUM_USER" && <PremiumUserTopbar title="Preferences" onClick={handleGoBack} />}
                    {accountDetails && accountDetails.role === "SYS_ADMIN" && <Topbar title="Preferences" onClick={handleGoBack} />}

                    <div className="flex flex-col h-[400px] justify-center items-center mt-10">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div style={fieldContainerStyle}>
                                    <span style={labelStyle}>Dark/Light mode</span>
                                    <div style={valueStyle}>
                                        <select value={darkLightMode} name="darkLightMode" onChange={(e) => setDarkLightMode(e.target.value)} className="text-black bg-[#EDEFF7]">
                                            {DarkLightModeOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div style={fieldContainerStyle}>
                                    <span style={labelStyle}>Text size</span>
                                    <div style={valueStyle}>
                                        <select value={textSize} onChange={(e) => setTextSize(e.target.value)} className="text-black bg-[#EDEFF7]">
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
                                    type="submit"
                                    style={buttonStyle}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}>
                                    Save
                                </button>
                            </div>
                        </form>
                        {showAlert && 
                            <div className="fixed top-[40%] left-[39%] px-[20px] py-[40px] bg-black/60 text-white z-90 max-w-[280px] text-center rounded-lg">
                                <div className="flex flex-col">
                                    <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={() => setShowAlert(false)}>&times;</span>
                                    <p>Preferences Saved!</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default EditPreferences;
