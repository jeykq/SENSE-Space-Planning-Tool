import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Welcome to the SENSE Space Planning Tool! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect information about you in various ways, including the information you provide directly to us, information we collect automatically, and information from third parties.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">2. Use of Your Information</h2>
        <p className="mb-4">
          We use the information we collect to operate, maintain, and provide you with the features and functionality of our services, as well as to improve and personalize your experience.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">3. Disclosure of Your Information</h2>
        <p className="mb-4">
          We may share your information with third parties in certain circumstances, such as with service providers, for legal reasons, or in connection with a business transaction.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">4. Security of Your Information</h2>
        <p className="mb-4">
          We use administrative, technical, and physical security measures to help protect your personal information. However, no security system is impenetrable, and we cannot guarantee the absolute security of your information.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">5. Your Privacy Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your information.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">6. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          This Privacy Policy was last updated on the 8th of August, 2024.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;