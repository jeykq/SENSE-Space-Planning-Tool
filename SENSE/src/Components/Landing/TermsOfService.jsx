import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-blue-500 min-h-screen p-8 relative">
      <button 
        onClick={handleGoBack} 
        className="absolute top-4 right-4 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg"
      >
        X
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">
          Welcome to the SENSE Space Planning Tool! These Terms of Service outline the rules and regulations for using our website and services.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using our services, you agree to comply with and be bound by these terms. If you do not agree to these terms, you must not use our services.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">2. Use of Services</h2>
        <p className="mb-4">
          Our services are provided for your personal, non-commercial use. You may not use our services for any illegal or unauthorized purpose.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">3. User Accounts</h2>
        <p className="mb-4">
          You may be required to create an account to use certain features of our services. You are responsible for maintaining the confidentiality of your account information and are liable for all activities under your account.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2>
        <p className="mb-4">
          All content and materials on our website, including text, graphics, logos, and software, are the property of SENSE or its licensors and are protected by copyright and trademark laws.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">5. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your access to our services at any time, without notice or liability, for any reason, including if you breach these terms.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall SENSE be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use of our services.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">7. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by and construed in accordance with the laws of the jurisdiction in which SENSE operates.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          These Terms of Service were last updated on the 8th of August, 2024.
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;