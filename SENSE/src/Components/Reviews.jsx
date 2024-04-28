import React from 'react'
import jenImage from '../assets/jen.jpeg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };
  return (
    <div className='w-3/4 m-auto mb-4'>
        <h2 className='text-white text-4xl text-center m-20 font-semibold '>Reviews</h2>
        <div>
        <Slider {...settings}>
            {data.map((d) => (
                <div key={d.name} className='bg-white h-[300px] text-black rounded-xl'>

                    <div className='flex flex-col justify-center items-center gap-4 p-4'>
                        <p className='text-xl font-semibold'>{d.name}</p>
                        <p className='text-justify'>{d.review}</p>
                </div>
                </div>    
            ))}
        </Slider>
        </div>
      <div></div>
    </div>
  )
}

const data = [
    {
        name: 'DB_name',
        img:jenImage,
        review:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quos ipsum quis aliquam voluptatibus sapiente exercitationem omnis esse earum? Quos officia ullam vitae sapiente et. Officiis nam ea explicabo facilis.'
    },
    {
        name: 'DB_name',
        img:jenImage,
        review:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quos ipsum quis aliquam voluptatibus sapiente exercitationem omnis esse earum? Quos officia ullam vitae sapiente et. Officiis nam ea explicabo facilis.'
    },
    {
        name: 'DB_name',
        img:jenImage,
        review:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quos ipsum quis aliquam voluptatibus sapiente exercitationem omnis esse earum? Quos officia ullam vitae sapiente et. Officiis nam ea explicabo facilis.'
    },
    {
        name: 'DB_name',
        img:jenImage,
        review:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quos ipsum quis aliquam voluptatibus sapiente exercitationem omnis esse earum? Quos officia ullam vitae sapiente et. Officiis nam ea explicabo facilis.'
    },
    {
        name: 'DB_name',
        img:jenImage,
        review:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quos ipsum quis aliquam voluptatibus sapiente exercitationem omnis esse earum? Quos officia ullam vitae sapiente et. Officiis nam ea explicabo facilis.'
    }

]

export default Reviews
