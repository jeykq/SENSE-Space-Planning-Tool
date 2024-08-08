import React from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
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
        <h1 className="text-3xl font-bold mb-4">Help</h1>
        <p className="mb-4">
          Welcome to the SENSE Space Planning Tool Help page! Here you can find answers to common questions and guidance on how to use our tool effectively.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">1. Getting Started</h2>
        <p className="mb-4">
          To get started, you can create a new room by clicking on the "Create a room" button.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">2. Adding Objects</h2>
        <p className="mb-4">
          You can add objects to your space by selecting them from the object library. Drag and drop the objects into the space to position them as desired.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">3. Saving Your Work</h2>
        <p className="mb-4">
          Remember to save your work regularly by clicking the "Save" button. You can also save your layout as a template for future use.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">4. Troubleshooting</h2>
        <p className="mb-4">
          If you encounter any issues, try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team for assistance.
        </p>
        
        <h2 className="text-2xl font-semibold mb-2">5. Contact Support</h2>
        <p className="mb-4">
          For further assistance, you can reach out to our support team via email at fypgp42@gmail.com.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          This help page was last updated on the 8th of August in 2024.
        </p>
      </div>
    </div>
  );
}

export default Help;