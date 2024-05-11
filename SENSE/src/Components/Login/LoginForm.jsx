import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import signup from '../../assets/signup.jpg';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let token;

    const handleSignIn = async (e) => {
      
        e.preventDefault();
        try {
          console.log("handling sign in");
            const response = await axios.post('https://api.sensespacesplanningtool.com/login', {
                email: email,
                password: password
            });
            // Handle successful login response
            console.log(response.data);
            token = response.data.token;
            const role = response.data.role;

            // Redirect or do something else upon successful login
            if (role === 'FREE_USER') {
              navigate('/FreeUserHomepage'); // Redirect to free user homepage
            } else if (role === 'PREMIUM_USER') {
              navigate('/PremiumUserHomepage'); // Redirect to premium user homepage
            }
        } catch (error) {
            // Handle login error
            console.error('Login failed:', error);
            // Show error message to the user or perform other error handling
        }
    };

    const handleLogOut = async (e) => {
      const headers = { 
        'Content-Type': 'application/json',
        'sense-token': 'b1d8bc94-0656-40a4-8ad3-9a83a1a08bda' // This needs to come from login request token
      };
      console.log(headers);
      const response = await axios.post(
        'https://api.sensespacesplanningtool.com/logout',
        {},
        { headers: headers }
      );
      console.log("logging out");
      navigate("/");
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
                                <div>
                                    <button onClick={() => setShowPopup(true)} className="border p-2 mt-4">
                                        test popup button (for logout)
                                    </button>
                                    {showPopup && <ConfirmDialogPopup title={"Confirm Logout"} text={"Are you sure you want to log out?"} onConfirm={() => handleLogOut()} onClose={() => setShowPopup(false)} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
