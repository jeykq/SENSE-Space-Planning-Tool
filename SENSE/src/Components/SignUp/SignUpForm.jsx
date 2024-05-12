import React, { useState } from 'react';
import signup from '../../assets/signup.jpg';
import AlertPopup from '../UI/AlertPopup';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [industry, setIndustry] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match!";
    }

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharacters.test(password)) {
      errors.password = "Password must contain special characters!";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await fetch('https://api.sensespacesplanningtool.com/signup/free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
          }),
        });
        
        if (response.ok) {
          // Handle successful sign up
          setShowAlert(true); // Show the alert
          console.log('Sign up successful!');
          //navigate("/login");
        } else {
          // Handle sign up errors
          const errorData = await response.json();
          console.error('Sign up failed:', errorData);
        }
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    }
  };

  // Close the alert popup when click OK, and navigate to login
  const handleOK = () => {
    navigate("/login");
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
                <h2 className="text-3xl mb-4 text-center">Sign Up Free</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="First Name" className="border border-gray-400 py-1 px-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <input type="text" placeholder="Last Name" className="border border-gray-400 py-1 px-2" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input type="password" placeholder="Password" style={{ borderColor: errors.password ? 'red' : 'gray' }} className="border py-1 px-2 w-full mt-5" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {errors.password && <p style={{ color: 'red' }} className="text-sm">{errors.password}</p>}
                  <input type="password" placeholder="Confirm Password" style={{ borderColor: errors.confirmPassword ? 'red' : 'gray' }} className="border py-1 px-2 w-full mt-5" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  {errors.confirmPassword && <p style={{ color: 'red' }} className="text-sm">{errors.confirmPassword}</p>}
                  <div className="grid grid-cols-2 gap-5">
                    <div style={{ position: 'relative' }}>
                      <label className="absolute top-0 left-0 py-1 px-1 mt-2" style={{ pointerEvents: 'none', zIndex: 1, fontSize: '0.75rem' }}>Date of Birth</label>
                      <input type="date" className="border border-gray-400 py-1 px-2 w-full mt-8 text-sm" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <label className="absolute top-0 left-0 py-1 px-1 mt-2" style={{ pointerEvents: 'none', zIndex: 1, fontSize: '0.75rem' }}>Job Industry</label>
                      <select id="industry" name="industry" className="border border-gray-400 py-1 px-1 w-full mt-8 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value)} required >
                        <option value="" disabled selected hidden>-</option>
                        <option value="designer">Interior Designer</option>
                        <option value="educator">Educator</option>
                        <option value="whs">WHS</option>
                        <option value="supportworker">Support Worker</option>
                        <option value="parents">Parents</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center mt-5">
                    <input type="checkbox" className="border border-gray-400 mr-2" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                    <span>
                      Accept <a href="#" className="text-blue-500">Terms & Conditions</a>
                    </span>
                  </div>
                  <button className="w-full bg-blue-500 py-3 text-white mt-5">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Show the AlertPopup if showAlert is true */}
      {showAlert && (
        <AlertPopup
          title="Sign up successful!"
          text="Your account has been created successfully."
          onClose={() => setShowAlert(false)}
          // Redirect to login page when click OK
          onOK={handleOK}
        />
      )}
    </div>
  );
}

export default SignUpForm;