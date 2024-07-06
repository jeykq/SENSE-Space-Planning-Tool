import React from 'react';
import userImage from '../../assets/user.jpeg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
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

    const data = [
        {
            name: 'Jane Doe',
            review: 'Sense has completely transformed how I plan my spaces. The intuitive interface and powerful features make it easy to create and customize any room layout.'
        },
        {
            name: 'John Smith',
            review: 'Sense is incredibly user-friendly and versatile. It has become an essential part of my workflow for planning and organizing spaces efficiently.'
        },
        {
            name: 'Sarah Johnson',
            review: 'I love the ready-made templates and the extensive object library. Sense has saved me so much time and effort in visualizing my design ideas.'
        },
        {
            name: 'Michael Brown',
            review: 'The customization options in Sense are outstanding. Being able to adjust display settings to my preference makes using the tool a delight.'
        },
        {
            name: 'Emily Davis',
            review: 'The ability to import and export room designs has been a game-changer for my interior design projects. Highly recommended for professionals and hobbyists alike.'
        }
    ];

    return (
        <div name='reviews' className='w-3/4 m-auto mb-4'>
            <h2 className='text-black text-4xl text-center m-20 font-semibold'>Reviews</h2>
            <div>
                <Slider {...settings}>
                    {data.map((d, index) => (
                        <div key={index} className='bg-white h-[400px] text-black rounded-xl shadow-lg p-6 flex flex-col items-center overflow-hidden'>
                            <img src={userImage} alt={d.name} className='w-20 h-20 rounded-full mb-4 object-cover mx-auto' />
                            <div className='flex flex-col items-center gap-4'>
                                <p className='text-xl font-semibold text-center'>{d.name}</p>
                                <p className='text-justify overflow-hidden text-ellipsis'>{d.review}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Reviews;
