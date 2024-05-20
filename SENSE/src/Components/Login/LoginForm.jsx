import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signup from '../../assets/signup.jpg';
import AlertPopup from '../UI/AlertPopup';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.sensespacesplanningtool.com/login', {
                email: email,
                password: password
            });
    
            if (response.status === 200) {
                // Handle successful login response
                console.log('Login successful:', response.data);
                const { role, token } = response.data;
    
                // Save the login token to local storage
                localStorage.setItem('authToken', token);
    
                // Redirect based on user role
                if (role === 'FREE_USER') {
                    navigate('/FreeUserHomepage'); // Redirect to free user homepage
                } else if (role === 'PREMIUM_USER') {
                    navigate('/PremiumUserHomepage'); // Redirect to premium user homepage
                }
            } else {
                console.error('Unexpected response status:', response.status);
                setShowAlert(true);
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Login failed:', error.response.data);
            } else if (error.request) {
                // Request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something else happened in making the request
                console.error('Error in request:', error.message);
            }
            setShowAlert(true);
        }
    };
    
    // Close the alert popup
    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-300">
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <div className="w-8/12 bg-white rounded-lg">
                        <div className="flex">
                            <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${signup})` }}>
                                <h1 className="text-3xl mb-3">Welcome to Sense Spaces Planning Tool</h1>
                            </div>
                            <div className="w-1/2 py-16 px-12">
                                <h2 className="text-3xl mb-4 text-center">Log In</h2>
                                <div className="mb-3">
                                    <span>New user?</span><a href={"/signup"} className="ml-1 text-blue-600 hover:underline">Create an account</a>
                                </div>
                                <form onSubmit={handleSignIn}>
                                    <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <div className="mt-3">
                                        <a href={"#"} className="text-sm text-slate-500 hover:underline">Forget Password?</a>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-500 py-3 text-white mt-5">Log In</button>
                                </form>
                                <div className="flex mt-8 text-xs text-gray-400">
                                    <a href={"#"} className="hover:underline">Help</a>
                                    <a href={"#"} className="ml-4 hover:underline">Terms & Conditions</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Show the AlertPopup for login errors */}
            {showAlert && (
                <AlertPopup
                    title="Login failed!"
                    text="Please check your email and password."
                    onClose={handleAlertClose}
                />
            )}
        </div>
    );
}

export default LoginForm;