import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';

const LandingMission = () => {
  const {
    missionParagraph,
    loading,
    fetchLandingPageData,
    updateLandingPage
  } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true); // Show success message
      setEditMode(false); // Exit edit mode after successful update
      fetchLandingPageData(); // Refresh mission paragraph after update
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
      alert('Failed to update landing page. Please try again later.');
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editedParagraph, setEditedParagraph] = useState(missionParagraph);
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

  useEffect(() => {
    // Update editedParagraph when missionParagraph changes
    setEditedParagraph(missionParagraph);
  }, [missionParagraph]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedParagraph(missionParagraph); // Reset edited paragraph on toggle
  };

  const handleInputChange = (event) => {
    setEditedParagraph(event.target.value);
  };

  const handleUpdateLandingPage = () => {
    updateLandingPage({ missionParagraph: editedParagraph });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedParagraph(missionParagraph); // Reset edited paragraph when canceling
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    // Optionally perform any cleanup or action on close
  };

  const handleAlertOk = () => {
    setIsAlertVisible(false);
    // Optionally navigate back to LandingMission page or perform related action
  };

  return (
    <div name='ourMission' className='text-black text-center mx-auto max-w-screen-lg p-6'>
      <h1 className='text-4xl font-semibold mb-10 text-black'>Our Mission</h1>
      {editMode ? (
        <textarea
          className='text-justify text-lg w-full my-10 md:my-20 leading-relaxed bg-transparent text-black border-b-2 border-white p-2'
          value={editedParagraph}
          onChange={handleInputChange}
          rows={6}
        />
      ) : (
        <p className='text-lg text-justify max-w-[800px] mt-10 md:mb-10 leading-relaxed mx-auto'>
          {missionParagraph}
        </p>
      )}
      <div className="flex justify-center space-x-4">
        {editMode ? (
          <>
            <button
              onClick={handleUpdateLandingPage}
              className={`bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-red-500 hover:bg-red-700 text-white rounded-full px-4 py-2 my-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditMode}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2"
          >
            Edit Paragraph
          </button>
        )}
      </div>

      {/* Display success message */}
      {successMessage && (
        <AlertPopup
          title="Success"
          text="Updated Successfully!"
          onClose={handleAlertClose}
          onOk={handleAlertOk}
        />
      )}
    </div>
  );
}

export default LandingMission;
