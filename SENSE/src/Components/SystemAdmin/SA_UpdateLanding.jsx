import React, { useState, useEffect } from 'react';
import backgroundImage from '../../assets/p2.png';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';

const SA_UpdateLanding = () => {
  const { mainParagraph, loading, fetchMainParagraph, updateLandingPage } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true); // Show success message
      setEditMode(false); // Exit edit mode after successful update
      fetchMainParagraph(); // Refresh main paragraph after update
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
      alert('Failed to update landing page. Please try again later.');
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editedParagraph, setEditedParagraph] = useState(mainParagraph);
  const [successMessage, setSuccessMessage] = useState(false); // State to control success message display
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State to control AlertPopup visibility

  useEffect(() => {
    // Clear success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedParagraph(mainParagraph); // Reset edited paragraph on toggle
  };

  const handleInputChange = (event) => {
    setEditedParagraph(event.target.value);
  };

  const handleUpdateLandingPage = () => {
    updateLandingPage(editedParagraph);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    // Optionally perform any cleanup or action on close
  };

  const handleAlertOk = () => {
    setIsAlertVisible(false);
    // Optionally navigate back to LandingSense page or perform related action
  };

  return (
    <div
      name='sense'
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 0, 58, 0.7), rgba(8, 0, 58, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className='text-center mx-auto max-w-screen-lg'>
        <h1 className='text-6xl font-semibold'>SENSE SPACES Planning Tool</h1>
        {editMode ? (
          <textarea
            className='text-justify text-lg w-full my-10 md:my-20 leading-relaxed bg-transparent text-black border-b-2 border-white p-2'
            value={editedParagraph}
            onChange={handleInputChange}
            rows={6}
          />
        ) : (
          <p className='text-justify text-lg max-w-[800px] my-10 md:my-20 leading-relaxed'>
            {mainParagraph}
          </p>
        )}
        <div className="flex justify-center">
          {editMode ? (
            <button
              onClick={handleUpdateLandingPage}
              className={`bg-red-500 hover:bg-red-700 text-white rounded-full px-4 py-2 my-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          ) : (
            <button
              onClick={toggleEditMode}
              className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2"
            >
              Edit Paragraph
            </button>
          )}
        </div>
      </div>

      {/* Display success message */}
      {successMessage && (
        <AlertPopup
          title="Success"
          text="Updated Successful!"
          onClose={handleAlertClose}
          onOk={handleAlertOk}
        />
      )}
    </div>
  );
}

export default SA_UpdateLanding;
