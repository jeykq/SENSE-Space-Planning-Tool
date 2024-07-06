import React from 'react';
import videoSrc from '../../assets/demo.mp4';

const Video = () => {
  return (
    <div name='video' className="flex flex-col items-center mt-10">
      <h2 className="text-black text-4xl text-center m-20 font-semibold">Demo Video</h2>
      <video controls className="w-3/4 m-5">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default Video;
