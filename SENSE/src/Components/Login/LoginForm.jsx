import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signup from '../../assets/signup.jpg';
import AlertPopup from '../UI/AlertPopup';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const { login } = useAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.sensespacesplanningtool.com/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                const { role, token } = response.data;
                login(token, role);

                if (role === 'FREE_USER') {
                    navigate('/FreeUserHomepage');
                } else if (role === 'PREMIUM_USER') {
                    navigate('/PremiumUserHomepage');
                } else if (role === 'BUSINESS_USER') {
                    navigate('/BusinessUserHomepage');
                } else if (role === 'SYS_ADMIN') {
                    navigate('/SystemAdminHomepage');
                }
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        }
    };

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
                                    <span>New user?</span><a href="/signup" className="ml-1 text-blue-600 hover:underline">Create an account</a>
                                </div>
                                <form onSubmit={handleSignIn}>
                                    <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <div className="mt-3">
                                        <a href="#" className="text-sm text-slate-500 hover:underline">Forget Password?</a>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-500 py-3 text-white mt-5">Log In</button>
                                </form>
                                <div className="flex mt-8 text-xs text-gray-400">
                                    <a href="#" className="hover:underline">Help</a>
                                    <a href="#" className="ml-4 hover:underline">Terms & Conditions</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAlert && (
                <AlertPopup
                    title="Login failed!"
                    text="Please check your email and password."
                    onClose={handleAlertClose}
                    onOk={handleAlertClose}
                />
            )}
        </div>
    );
};

export default LoginForm;
