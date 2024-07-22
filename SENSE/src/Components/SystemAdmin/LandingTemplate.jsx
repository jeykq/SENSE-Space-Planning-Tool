import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { FreeMode, Pagination } from 'swiper/modules';
import { RxArrowTopRight, RxPencil1 } from 'react-icons/rx';
import LandingPageAPIUtils from './LandingPageAPIUtils';
import AlertPopup from '../UI/AlertPopup';

const LandingTemplate = () => {
  const {
    images,
    loading,
    fetchLandingPageData,
    updateLandingPageImage
  } = LandingPageAPIUtils({
    onUpdateSuccess: () => setSuccessMessage(true),
    onError: (error) => console.error('Update error', error),
  });

  const [loaded, setLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchLandingPageData();
      setLoaded(true);
    };

    loadData();
  }, []);

  if (!loaded || loading) return <div>Loading...</div>;

  const handleEditClick = (imageKey) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await updateLandingPageImage(imageKey, file, file.name);
      }
    };
    input.click();
  };

  const extractFilename = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0];
  };

  const handleAlertClose = () => {
    setSuccessMessage(false);
  };

  const handleAlertOk = () => {
    setSuccessMessage(false);
  };

  return (
    <div name="templates" className='flex items-center justify-center flex-col h-screen'>
      <h1 className='text-black text-4xl text-center m-20 font-semibold'>Templates</h1>
      <Swiper
        breakpoints={{
          340: { slidesPerView: 2, spaceBetween: 15 },
          700: { slidesPerView: 3, spaceBetween: 15 }
        }}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className='max-w-[90%] lg:max-w-[80%]'
      >
        {Object.entries(images).map(([key, imageUrl]) => (
          <SwiperSlide key={key}>
            <div className='flex flex-col mb-20 gap-6 group relative shadow-lg text-white rounded-xl px-6 py-8 h-[210px] w-[190px] lg:h-[350px] lg:w-[300px] overflow-hidden cursor-pointer'>
              <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: `url(${imageUrl})` }}></div>
              <div className='absolute inset-0 bg-black opacity-10 group-hover:opacity-50'></div>
              <div className='relative flex gap-3'>
                <h1 className='text-xl ml-10 lg:text-2xl group-hover:text-blue-200'>{extractFilename(imageUrl)}</h1>
              </div>
              <a href="#" className='absolute top-[60%] flex items-center justify-center space-x-2 text-white opacity-0 hover:opacity-100'>
                <span className='text-sm md:text-base font-medium'>View More</span>
                <RxArrowTopRight />
              </a>
              <button
                onClick={() => handleEditClick(key)}
                className='absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg opacity-75 hover:opacity-100'
              >
                <RxPencil1 />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Display success message */}
      {successMessage && (
        <AlertPopup
          title="Success"
          text="New Template Image Updated Successfully!"
          onClose={handleAlertClose}
          onOk={handleAlertOk}
        />
      )}
    </div>
  );
};

export default LandingTemplate;
