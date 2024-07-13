import React, { useState, useEffect } from 'react';
import LandingPageAPIUtils from '../SystemAdmin/LandingPageAPIUtils'; 

const Video = () => {
  const { videoLink, fetchLandingPageData } = LandingPageAPIUtils({
    onUpdateSuccess: () => {}, // Define success callback if needed
    onError: (error) => {
      console.error('Error fetching data for Video component:', error);
    }
  });

  useEffect(() => {
    // Fetch initial data for Video component
    fetchLandingPageData();
  }, []);

  // Convert YouTube link to embed link
  const getEmbedLink = (link) => {
    const videoIdMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : link;
  };

  const embedLink = getEmbedLink(videoLink);

  return (
    <div name='video' className="flex flex-col items-center mt-10">
      <h2 className="text-black text-4xl text-center m-20 font-semibold">Demo Video</h2>
      <div className="w-3/4 m-5">
        {embedLink ? (
          <iframe
            width="560"
            height="500"
            src={embedLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-74 sm:h-96"
          ></iframe>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
}

export default Video;
