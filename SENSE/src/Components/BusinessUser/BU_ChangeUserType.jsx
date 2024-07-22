import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../FreeUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const ApplyBusinessUser = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [userType, setUserType] = useState('');
    const [applicationReason, setApplicationReason] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const headers = getHeaders(); // Get headers using the function

        const fetchAccountDetails = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/user/get',
                    {},
                    { headers }
                );

                if (!response.data) {
                    throw new Error('No data returned');
                }

                const accountDetails = response.data.body;
                setFirstName(accountDetails.first_name);
                setLastName(accountDetails.last_name);
                setEmail(accountDetails.email);
            } catch (error) {
                console.error('Error fetching account details:', error);
            }
        };

        fetchAccountDetails();
    }, []);

    const handleFormSubmit = () => {
        setShowPopup(true);
    };

    const handleGoBack = () => {
        navigate('/viewaccount');
    };

    return (
        <>
            <Topbar title="Change to Normal User" onClick={handleGoBack} />
            <div style={styles.container}>
                <h1 style={styles.title}>Fill in an application</h1>
                <form
                    action="https://formsubmit.co/fypgp42@gmail.com"
                    method="POST"
                    style={styles.form}
                    onSubmit={handleFormSubmit}
                >
                    <input type="hidden" name="_captcha" value="false" />

                    <div style={styles.inputGroup}>
                        <div style={styles.inputContainer}>
                            <label style={styles.label}>First Name</label>
                            <input
                                type="text"
                                name="First Name"
                                value={firstName}
                                readOnly
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputContainer}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                type="text"
                                name="Last Name"
                                value={lastName}
                                readOnly
                                style={styles.input}
                            />
                        </div>
                    </div>
                    <div style={styles.inputContainerFull}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="Email"
                            value={email}
                            readOnly
                            style={styles.inputFull}
                        />
                    </div>
                    <div style={styles.inputContainerFull}>
                        <label style={styles.label}>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            style={styles.inputFullEditable}
                        />
                    </div>
                    <div style={styles.inputContainerFull}>
                        <label style={styles.label}>Previous User Type</label>
                        <select
                            name="User Type"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            style={styles.select}
                        >
                            <option value="freeUser"> Free User </option>
                            <option value="premiumUser"> Premium User </option>
                        </select>
                    </div>
                    <div style={styles.inputContainerFull}>
                        <label style={styles.label}>Reason for application</label>
                        <textarea
                            name="Reason for application"
                            value={applicationReason}
                            onChange={(e) => setApplicationReason(e.target.value)}
                            style={styles.textarea}
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Apply
                    </button>
                </form>
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
        fontSize: '14px',
        backgroundColor: '#e9ecef',
        color: '#495057',
        cursor: 'not-allowed'
    },
    inputFull: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px',
        marginBottom: '10px',
        backgroundColor: '#e9ecef',
        color: '#495057',
        cursor: 'not-allowed'
    },
    inputFullEditable: {
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
    select: {
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        backgroundColor: '#fff'
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