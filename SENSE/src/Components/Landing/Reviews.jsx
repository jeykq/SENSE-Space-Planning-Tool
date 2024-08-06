import React, { useEffect, useState } from 'react';
import userImage from '../../assets/user.jpeg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { getHeaders } from '../../../apiUtils'; // Import the getHeaders function

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [jobIndustries, setJobIndustries] = useState({});

    useEffect(() => {
        const fetchJobIndustries = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/job_industry/list',
                    {},
                    { headers: getHeaders() }
                );
                const industryMap = response.data.body.reduce((acc, industry) => {
                    acc[industry.id] = industry.name;
                    return acc;
                }, {});
                setJobIndustries(industryMap);
            } catch (error) {
                console.error('Error fetching job industries:', error.message);
            }
        };

        fetchJobIndustries();
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.post(
                    'https://api.sensespacesplanningtool.com/user/list',
                    {},
                    { headers: getHeaders() }
                );

                const filteredReviews = response.data.body
                    .filter(user => user.review && user.rating)
                    .sort((a, b) => {
                        // First sort by rating (descending)
                        if (b.rating !== a.rating) return b.rating - a.rating;
                        // Then sort by timestamp (latest first)
                        return b.last_review_timestamp - a.last_review_timestamp;
                    })
                    .slice(0, 10); // Get the top 10 reviews

                setReviews(filteredReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error.message);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} style={index < rating ? styles.starFilled : styles.starEmpty}>
                &#9733;
            </span>
        ));
    };

    const capitalizeName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a string
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div name='reviews' className='w-3/4 m-auto mb-4'>
            <h2 className='text-black text-4xl text-center m-20 font-semibold'>Reviews</h2>
            <div>
                <Slider {...settings}>
                    {reviews.map((review, index) => (
                        <div key={index} className='bg-white h-[400px] text-black rounded-xl shadow-lg p-6 flex flex-col items-center overflow-hidden'>
                            <p className='text-xs text-left text-gray-500'>
                                    {formatDate(review.last_review_timestamp)}
                                </p>
                            <img src={userImage} alt={`${review.first_name} ${review.last_name}`} className='w-20 h-20 rounded-full mb-4 object-cover mx-auto' />
                            <div className='flex flex-col items-center gap-4'>
                                <p className='text-xl font-semibold text-center text-gray-800'>
                                    {`${capitalizeName(review.first_name)} ${capitalizeName(review.last_name)}`}
                                </p>
                                <p className='text-sm text-center text-gray-500'>
                                   Occupation - {jobIndustries[review.job_industry_id]}
                                </p>
                                <div style={styles.stars}>
                                    {renderStars(review.rating)}
                                </div>
                                <p className='text-justify overflow-hidden text-ellipsis text-gray-700'>{review.review}</p>
                                
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

const styles = {
    stars: {
        display: 'flex',
        marginBottom: '0px',
    },
    starFilled: {
        fontSize: '24px',
        color: '#FFD700'
    },
    starEmpty: {
        fontSize: '24px',
        color: '#ccc'
    }
};

export default Reviews;
