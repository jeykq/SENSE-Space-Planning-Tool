import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from './Topbar'
import ImportRoomForm from './ImportRoomForm'

const ImportRoom = () => {
  const navigate = useNavigate();

  const validateForm = () => {
    // const errors = {};

    // const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    // if (!specialCharacters.test(password)) {
    //   errors.password = "Password must contain special characters!";
    // }

    // setErrors(errors);
    // return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // const isValid = validateForm();
    // if (isValid) {
    //   try {
    //     const response = await fetch('https://api.sensespacesplanningtool.com/signup/free', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         email,
    //         password,
    //         firstName,
    //         lastName,
    //         dateOfBirth,
    //       }),
    //     });
        
    //     if (response.ok) {
    //       // Handle successful sign up
    //       setShowAlert(true); // Show the alert
    //       console.log('Sign up successful!');
    //       //navigate("/login");
    //     } else {
    //       // Handle sign up errors
    //       const errorData = await response.json();
    //       console.error('Sign up failed:', errorData);
    //     }
    //   } catch (error) {
    //     console.error('Error during sign up:', error);
    //   }
    // }
  };

  return (
    <div>
        <div>
            <Topbar title={"Import Objects"} onClick={() => navigate("/CreateRoom")}/>
        </div>
        <div className="px-40 py-14">
            <ImportRoomForm submit={() => handleSubmit()}/>
        </div>
    </div>
  );
}

export default ImportRoom;