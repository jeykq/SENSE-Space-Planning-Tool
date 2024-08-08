import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TermsAndConditions = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
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
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">
          Welcome to SENSE Space Planning Tool! These terms and conditions outline the rules and regulations for the use of our site.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">1. License</h2>
        <p className="mb-4">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use our site if you do not agree to all of the terms and conditions stated on this page.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">2. Cookies</h2>
        <p className="mb-4">
          We employ the use of cookies. By accessing our website, you agreed to use cookies in agreement with our privacy policy.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">3. License to Use</h2>
        <p className="mb-4">
          Unless otherwise stated, we or our licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">4. User Comments</h2>
        <p className="mb-4">
          Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. We do not filter, edit, publish, or review comments before their presence on the website.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">5. Content Liability</h2>
        <p className="mb-4">
          We shall not be held responsible for any content that appears on your website.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">6. Removal of Links</h2>
        <p className="mb-4">
          If you find any link on our website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links but are not obligated to do so or to respond directly.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">7. Disclaimer</h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          These terms and conditions were last updated on the 8th of August in 2024.
        </p>
      </div>
    </div>
  );
}

export default TermsAndConditions;