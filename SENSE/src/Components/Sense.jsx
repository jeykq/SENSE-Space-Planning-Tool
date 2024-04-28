import React from 'react';
import backgroundImage from '../assets/p2.png';

const Sense = () => {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 0, 58, 0.7), rgba(8, 0, 58, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className='text-center mx-auto max-w-screen-lg'>
        <h1 className='text-6xl font-semibold'>SENSE SPACES Planning Tool</h1>
        <p className='text-justify text-lg max-w-[800px] my-10 md:my-20 leading-relaxed'>Welcome to SENSE Spaces Planning Tool, where you can unleash your creativity and design immersive multi-sensory environments right from your web browser. Whether you’re creating a therapeutic space, an educational environment, or simply looking to enhance your surroundings, our intuitive web application empowers you to bring your vision to life.</p>
      </div>
    </div>
  );
}

export default Sense;
