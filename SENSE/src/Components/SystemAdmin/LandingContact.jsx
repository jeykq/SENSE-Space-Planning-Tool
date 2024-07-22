import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';

const LandingContact = () => {
  const {
    contactEmail,
    contactPhone,
    contactAddress,
    loading,
    fetchLandingPageData,
    updateLandingPage
  } = LandingPageAPIUtils({
    onUpdateSuccess: () => {
      setSuccessMessage(true); // Show success message
      setEditMode(false); // Exit edit mode after successful update
      fetchLandingPageData(); // Refresh contact information after update
    },
    onError: (error) => {
      console.error('Error updating contact information:', error);
      alert('Failed to update contact information. Please try again later.');
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editedEmail, setEditedEmail] = useState(contactEmail);
  const [editedPhone, setEditedPhone] = useState(contactPhone);
  const [editedAddress, setEditedAddress] = useState(contactAddress);
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
    // Update edited contact information when contact information changes
    setEditedEmail(contactEmail);
    setEditedPhone(contactPhone);
    setEditedAddress(contactAddress);
  }, [contactEmail, contactPhone, contactAddress]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedEmail(contactEmail); // Reset edited email on toggle
    setEditedPhone(contactPhone); // Reset edited phone on toggle
    setEditedAddress(contactAddress); // Reset edited address on toggle
  };

  const handleEmailChange = (event) => {
    setEditedEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setEditedPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setEditedAddress(event.target.value);
  };

  const handleUpdate = async () => {
    try {
      await updateLandingPage({
        contactEmail: editedEmail,
        contactPhone: editedPhone,
        contactAddress: editedAddress,
      });
      setIsAlertVisible(true); // Show success alert popup
    } catch (error) {
      console.error('Error updating contact information:', error);
    }
  };

  const closeAlertPopup = () => {
    setIsAlertVisible(false);
  };

  return (
    <div className="contact-us-container flex justify-center">
      {editMode ? (
        <div className="contact-form  "> 
          <label className="block mb-4">
            Email:
            <input 
            type="email" 
            value={editedEmail} 
            onChange={handleEmailChange} 
            className="w-full p-2 mt-1 border rounded" />
          </label>
          <label className="block mb-4">
            Phone:
            <input 
            type="text" 
            value={editedPhone} 
            onChange={handlePhoneChange} 
            className="w-full p-2 mt-1 border rounded" />
          </label>
          <label className="block mb-4">
            Address:
            <input 
            type="text" 
            value={editedAddress} 
            onChange={handleAddressChange} 
            className="w-full p-2 mt-1 border rounded" />
          </label>
          <div className="flex justify-center space-x-4">
            <button onClick={handleUpdate} disabled={loading} className={`bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button onClick={toggleEditMode} className="bg-red-500 hover:bg-red-700 text-white rounded-full px-4 py-2 my-2">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div name='contactUs' className='text-black text-center mx-auto max-w-screen-lg p-6'>
          <div className='bg-white shadow-lg rounded-lg p-10'>
            <h1 className='text-4xl font-semibold mb-10 text-black'>Contact Us</h1>
            <p className='text-lg my-10 leading-relaxed'>
              For inquiries, feedback, or assistance, please feel free to contact us using the following methods:
            </p>
            <ul className="text-lg space-y-4">
              <li className="flex items-center justify-center">
                <span className="mr-4">📧</span>
                <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a>
              </li>
              <li className="flex items-center justify-center">
                <span className="mr-4">📞</span>
                <a href={`tel:${contactPhone}`} className="text-blue-600 hover:underline">{contactPhone}</a>
              </li>
              <li className="flex items-center justify-center">
                <span className="mr-4">📍</span>
                {contactAddress}
              </li>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleEditMode}
                  className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2 my-2"
                >
                  Edit Contact Info
                </button>
              </div>
            </ul>
          </div>
        </div>
      )}
      {successMessage && (
        <AlertPopup
          title="Success"
          text="Contact information updated successfully!"
          onClose={closeAlertPopup}
          onOk={closeAlertPopup}
        />
      )}
    </div>
  );
};

export default LandingContact;
