import React, { useState, useEffect } from 'react';
import signup from '../../assets/signup.jpg';
import scanpay from '../../assets/scanpay.png';
import AlertPopup from '../UI/AlertPopup';
import { useNavigate } from 'react-router-dom';

const PaidSignUpForm = () => {
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
  const [industryList, setIndustryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndustryList = async () => {
      try {
        const response = await fetch('https://api.sensespacesplanningtool.com/job_industry/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Empty body or any parameters needed by your API
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setIndustryList(data.body);
      } catch (error) {
        console.error('Error fetching industry list:', error.message);
      }
    };

    fetchIndustryList();
  }, []);

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
        const response = await fetch('https://api.sensespacesplanningtool.com/signup/premium', {
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
            jobIndustryId: parseInt(industry, 10), // Ensure only ID is sent
          }),
        });
        
        if (response.ok) {
          // Handle successful sign up
          setShowAlert(true); // Show the alert
          console.log('Sign up successful!');
          // navigate("/login");
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
    setShowAlert(false);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${signup})` }}>
        <h1 className="text-3xl mb-3">Welcome to Sense Spaces Planning Tool</h1>
      </div>
      <div className="w-1/2 py-16 px-12 flex items-center justify-center">
        <div>
          <h2 className="text-3xl mb-4 text-center">Sign Up Premium</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              <input type="text" placeholder="First Name" className="border border-gray-400 py-1 px-2 rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type="text" placeholder="Last Name" className="border border-gray-400 py-1 px-2 rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full mt-5 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" style={{ borderColor: errors.password ? 'red' : 'gray' }} className="border py-1 px-2 w-full mt-5 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {errors.password && <p style={{ color: 'red' }} className="text-sm">{errors.password}</p>}
            <input type="password" placeholder="Confirm Password" style={{ borderColor: errors.confirmPassword ? 'red' : 'gray' }} className="border py-1 px-2 w-full mt-5 rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {errors.confirmPassword && <p style={{ color: 'red' }} className="text-sm">{errors.confirmPassword}</p>}
            <div className="grid grid-cols-2 gap-5">
              <div style={{ position: 'relative' }}>
                <label className="absolute top-0 left-0 py-1 px-1 mt-2 rounded" style={{ pointerEvents: 'none', zIndex: 1, fontSize: '0.75rem' }}>Date of Birth</label>
                <input type="date" className="border border-gray-400 py-1 px-2 w-full mt-8 text-sm rounded" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
              <div style={{ position: 'relative' }}>
                <label className="absolute top-0 left-0 py-1 px-1 mt-2 rounded" style={{ pointerEvents: 'none', zIndex: 1, fontSize: '0.75rem' }}>Job Industry</label>
                <select
                  id="industry"
                  name="industry"
                  className="border border-gray-400 py-1 px-1 w-full mt-8 text-sm rounded"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                >
                  <option value="">Select job industry</option>
                  {industryList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center mt-5">
              <input type="checkbox" className="border border-gray-400 mr-2" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
              <span>
                Accept <a href="#" className="text-blue-500">Terms & Conditions</a>
              </span>
            </div>

            <div className="flex flex-col items-center mt-5">
              <div>
                <h3>$ Payment instructions:</h3>
              </div>
              <img src={scanpay} alt="scanpay" style={{width: '120px', height: '140px'}} />
            </div>

            <button className="w-full bg-blue-500 py-3 text-white mt-5 rounded">Sign Up</button>
          </form>
        </div>
      </div>
      {showAlert && (
        <AlertPopup
          title="Sign up successful!"
          text="Your account has been created successfully."
          onClose={() => setShowAlert(false)}
          onOk={handleOK}
        />
      )}
    </div>
  );
};

export default PaidSignUpForm;
