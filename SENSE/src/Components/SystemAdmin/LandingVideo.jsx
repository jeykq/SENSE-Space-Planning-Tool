import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';

const LandingVideo = () => {
  const {
    videoLink,
    loading,
    fetchLandingPageData,
    updateLandingPage
  } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true); // Show success message
      setEditMode(false); // Exit edit mode after successful update
      fetchLandingPageData(); // Refresh video link after update
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
      alert('Failed to update landing page. Please try again later.');
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editedVideoLink, setEditedVideoLink] = useState(videoLink);
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
    // Update editedVideoLink when videoLink changes
    setEditedVideoLink(videoLink);
  }, [videoLink]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedVideoLink(videoLink); // Reset edited video link on toggle
  };

  const handleInputChange = (event) => {
    setEditedVideoLink(event.target.value);
  };

  const handleUpdateVideoLink = () => {
    updateLandingPage({ videoLink: editedVideoLink });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedVideoLink(videoLink); // Reset edited video link when canceling
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    // Optionally perform any cleanup or action on close
  };

  const handleAlertOk = () => {
    setIsAlertVisible(false);
    // Optionally navigate back to LandingVideo page or perform related action
  };

  // Convert YouTube link to embed link
  const getEmbedLink = (link) => {
    const videoIdMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : link;
  };

  const embedLink = getEmbedLink(videoLink);

  return (
    <div name='video' className="flex flex-col items-center mt-10">
      <h2 className="text-black text-4xl text-center m-20 font-semibold">Demo Video</h2>
      <div className="w-3/4 m-5">
        {editMode ? (
          <textarea
            className='text-justify text-lg w-full my-10 md:my-20 leading-relaxed bg-gray-100 text-blue-600 border-b-2 p-2 rounded'
            value={editedVideoLink}
            onChange={handleInputChange}
            rows={2}
          />
        ) : (
          <iframe
            width="560"
            height="500"
            src={embedLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-74 sm:h-96"
          ></iframe>
        )}
        <div className="flex justify-center space-x-4 mt-4">
          {editMode ? (
            <>
              <button
                onClick={handleUpdateVideoLink}
                className={`bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-700 text-white rounded-full px-4 py-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2"
            >
              Edit Video Link
            </button>
          )}
        </div>
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

export default LandingVideo;
