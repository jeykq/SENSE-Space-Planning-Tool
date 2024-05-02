import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import signup from '../../assets/signup.jpg';
import ConfirmDialogPopup from '../UI/ConfirmDialog';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
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
                <h2 className="text-3xl mb-4 text-center">Sign In</h2>
                <div className="mb-3">
                    <span>New user?</span><a href={"/signup"} className="ml-1 text-blue-600 hover:underline">Create an account</a>
                </div>
                <form>
                  <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                  <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                  <div className="mt-3">
                    <a href={"#"} className="text-sm text-slate-500 hover:underline">Forget Password?</a>
                  </div>
                  <button className="w-full bg-blue-500 py-3 text-white mt-5">Sign In</button>
                </form>
                <div className="flex mt-8 text-xs text-gray-400">
                    <a href={"#"} className="hover:underline">Help</a>
                    <a href={"#"} className="ml-4 hover:underline">Terms & Conditions</a>
                </div>
                <div>
                    <button onClick={() => setShowPopup(true)} className="border p-2 mt-4">
                        test popup button (for logout)
                    </button>
                    {showPopup && <ConfirmDialogPopup title={"Confirm Logout"} text={"Are you sure you want to log out?"} onConfirm={() => navigate("/")} onClose={()=>setShowPopup(false)}/>}
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