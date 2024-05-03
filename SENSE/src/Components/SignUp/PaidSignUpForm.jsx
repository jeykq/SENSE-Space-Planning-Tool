import React from 'react';
import signup from '../../assets/signup.jpg';
import scanpay from '../../assets/scanpay.png';


const PaidSignUpForm = () => {
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
                <h2 className="text-3xl mb-4 text-center">Sign Up Premium</h2>
                <form>
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="First Name" className="border border-gray-400 py-1 px-2" />
                    <input type="text" placeholder="Last Name" className="border border-gray-400 py-1 px-2" />
                  </div>
                  <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                  <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                  <input type="password" placeholder="Confirm Password" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="Age" className="border border-gray-400 py-1 px-2 w-full mt-5" />
                    <select id="industry" name="industry" className="border border-gray-400 py-1 px-1 w-full mt-5 text-sm" >
                      <option value="" disabled selected hidden>Job Industry</option>
                      <option value="designer">Designer</option>
                      <option value="educator">Educator</option>
                      <option value="whs">WHS</option>
                      <option value="supportworker">Support Worker</option>
                      <option value="supportworker">Parents</option>
                      <option value="supportworker">Others</option>
                    </select>
                  </div>

                  <div className="flex items-center mt-5">
                    <input type="checkbox" className="border border-gray-400 mr-2" />
                    <span>
                      Accept <a href="#" className="text-blue-500">Terms & Conditions</a>
                    </span>
                  </div>

                  <div className="flex flex-col items-center mt-5">
                    <div>
                     <h3>$ Payment instructions:</h3>
                    </div>
                     <img src={scanpay} alt="scanpay" style={{ width: '120px', height: '140px' }} />
                  </div>

                  <button className="w-full bg-blue-500 py-3 text-white mt-5">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaidSignUpForm;