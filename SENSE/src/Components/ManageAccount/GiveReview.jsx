import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FreeUserTopbar from '../FreeUser/Topbar';
import PremiumUserTopbar from '../PremiumUser/Topbar';
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function

const GiveReview = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        const headers = getHeaders(); // Get headers using the function

        const fetchUserRole = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/user/get',
                    {},
                    { headers }
                );

                if (!response.data) {
                    throw new Error('No data returned');
                }

                const userDetails = response.data.body;
                setRole(userDetails.role); // Assuming the role is part of the response data
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmit = () => {
        // Handle the submit action here
        console.log('Review submitted:', { rating, review });
        setShowPopup(true); // Show popup on submit
    };

    const handleGoBack = () => {
        navigate('/viewaccount'); 
    };

    const renderTopbar = () => {
        if (role === 'PREMIUM_USER') {
            return <PremiumUserTopbar title="Give a review" onClick={handleGoBack} />;
        } else if (role === 'FREE_USER') {
            return <FreeUserTopbar title="Give a review" onClick={handleGoBack} />;
        } else {
            return null;
        }
    };

    return (
      <>
        {renderTopbar()}
        <div style={styles.container}>
            <div style={styles.reviewSection}>
                <p style={styles.subtitle}>Leave us a review</p>
                <div style={styles.stars}>
                    {[...Array(5)].map((star, index) => (
                        <span
                            key={index}
                            style={index < rating ? styles.starFilled : styles.starEmpty}
                            onClick={() => handleRating(index + 1)}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
                <textarea
                    style={styles.textarea}
                    value={review}
                    onChange={handleReviewChange}
                    placeholder="Write your review here..."
                />
                <button style={styles.button} onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            {showPopup && (
                <div style={styles.popup}>
                    <span style={styles.close} onClick={() => setShowPopup(false)}>&times;</span>
                    <p>Review has been submitted! Thank you!</p>
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
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '600px',
        margin: '50px auto'
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px'
    },
    reviewSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    subtitle: {
        fontSize: '18px',
        marginBottom: '10px'
    },
    stars: {
        display: 'flex',
        marginBottom: '20px',
        cursor: 'pointer'
    },
    starFilled: {
        fontSize: '30px',
        color: '#FFD700'
    },
    starEmpty: {
        fontSize: '30px',
        color: '#ccc'
    },
    textarea: {
        width: '400px',
        height: '200px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '16px'
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    popup: {
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        borderRadius: '10px',
        zIndex: 1000,
        textAlign: 'center',
        width: '280px'
    },
    close: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '20px',
        cursor: 'pointer'
    }
};

export default GiveReview;
