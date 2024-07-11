import React from 'react';

const Video = () => {
  return (
    <div name='video' className="flex flex-col items-center mt-10">
      <h2 className="text-black text-4xl text-center m-20 font-semibold">Demo Video</h2>
      <div className="w-3/4 m-5">
        <iframe
          width="560"
          height="500"
          src="https://www.youtube.com/embed/_svOdVvX5LA?si=dRb8NMFLf8f6_crk"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          className="w-full h-74 sm:h-96"
        ></iframe>
      </div>
    </div>
  );
}

export default Video;
