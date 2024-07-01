import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../FreeUser/Topbar';

const ApplyBusinessUser = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [companyInfo, setCompanyInfo] = useState('');
    const [businessUseCase, setBusinessUseCase] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = () => {
        // Handle the submit action here
        console.log('Application submitted:', { firstName, lastName, email, contact, companyInfo, businessUseCase });
        setShowPopup(true); // Show popup on submit
    };

    const handleGoBack = () => {
        navigate('/viewaccount');
    };

    return (
      <>
        <Topbar title="Apply for Business User" onClick={handleGoBack} />
        <div style={styles.container}>
            <h1 style={styles.title}>Fill in an application</h1>
            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    <div style={styles.inputContainer}>
                        <label style={styles.label}>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <label style={styles.label}>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.inputContainerFull}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.inputFull}
                    />
                </div>
                <div style={styles.inputContainerFull}>
                    <label style={styles.label}>Contact no.</label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        style={styles.inputFull}
                    />
                </div>
                <div style={styles.inputContainerFull}>
                    <label style={styles.label}>Company information</label>
                    <textarea
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                        style={styles.textarea}
                    />
                </div>
                <div style={styles.inputContainerFull}>
                    <label style={styles.label}>Business use case</label>
                    <textarea
                        value={businessUseCase}
                        onChange={(e) => setBusinessUseCase(e.target.value)}
                        style={styles.textarea}
                    />
                </div>
                <button style={styles.button} onClick={handleSubmit}>
                    Apply
                </button>
            </div>
            {showPopup && (
                <div style={styles.popup}>
                    <span style={styles.close} onClick={() => setShowPopup(false)}>&times;</span>
                    <p>Application has been sent! Thank you!</p>
                </div>
            )}
        </div>
      </>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f3f3f3',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '400px', 
        margin: '50px auto',
        position: 'relative'
    },
    title: {
        fontSize: '20px', 
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    inputGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '10px'
    },
    inputContainer: {
        width: '48%',
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainerFull: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '10px'
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px' 
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px' 
    },
    inputFull: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px', 
        marginBottom: '10px'
    },
    textarea: {
        width: '100%',
        height: '80px', 
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px',
        fontSize: '14px' 
    },
    button: {
        padding: '10px 20px',
        fontSize: '14px', 
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    popup: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '10px',
        zIndex: 1000,
        textAlign: 'center',
        width: '300px' 
    },
    close: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '20px',
        cursor: 'pointer'
    }
};

export default ApplyBusinessUser;