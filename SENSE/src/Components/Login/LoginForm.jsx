import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signup from '../../assets/signup.jpg';
import AlertPopup from '../UI/AlertPopup';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const response = await axios.post('https://api.sensespacesplanningtool.com/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                const { role, token } = response.data;
                localStorage.setItem('authToken', token);
                setIsAuthenticated(true);
                setUserRole(role);

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
        } finally {
            setLoginLoading(false);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const handleCancelLogin = () => {
        navigate(-1); // Go back in history
    };

    return (
        <div className="relative">
            <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                onClick={handleCancelLogin}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="flex h-screen">
                <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${signup})` }}>
                    <h1 className="text-3xl mb-3">Welcome to Sense Spaces Planning Tool</h1>
                </div>
                <div className="w-1/2 py-16 px-12 flex self-center justify-center">
                    <div className="max-w-[400px]">
                        <h2 className="text-3xl mb-4 text-center">Log In</h2>
                        <div className="mb-3">
                            <span>New user?</span><a href="/signup" className="ml-1 text-blue-600 hover:underline">Create an account</a>
                        </div>
                        <form onSubmit={handleSignIn}>
                            <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5 max-w-[400px] rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5 max-w-[400px] rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                            
                            {loginLoading ? (
                                <button type="submit" className="w-full bg-slate-300 py-3 text-white mt-5 max-w-[400px]" disabled>
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
                                    </div>
                                </button>
                            ) : (
                                <button type="submit" className="w-full bg-blue-500 py-3 text-white mt-5 max-w-[400px] rounded">
                                    Log In
                                </button>
                            )}
                            
                        </form>
                        <div className="flex mt-8 text-xs text-gray-400">
                            <a href="#" className="hover:underline">Help</a>
                            <a href="#" className="ml-4 hover:underline">Terms & Conditions</a>
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
