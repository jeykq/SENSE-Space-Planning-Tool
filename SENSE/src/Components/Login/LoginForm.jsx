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
    const [loginLoading, setLoginLoading] = useState(false);
    const { login } = useAuth();

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
        } finally {
            setLoginLoading(false);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <div>
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
                            <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5 max-w-[400px]" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5 max-w-[400px]" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="mt-3">
                                <a href="#" className="text-sm text-slate-500 hover:underline">Forget Password?</a>
                            </div>
                            {loginLoading ? (
                                <button type="submit" className="w-full bg-slate-300 py-3 text-white mt-5 max-w-[400px]" disabled>Logging in...</button>
                            ) : (
                                <button type="submit" className="w-full bg-blue-500 py-3 text-white mt-5 max-w-[400px]">Log In</button>
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
