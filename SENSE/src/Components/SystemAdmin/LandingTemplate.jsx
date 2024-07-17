import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { FreeMode, Pagination } from 'swiper/modules'; // Import Swiper modules
import { RxArrowTopRight } from 'react-icons/rx';
import LandingPageAPIUtils from './LandingPageAPIUtils';

const LandingTemplate = () => {
  const {
    images,
    loading,
    fetchLandingPageData,
    updateLandingPage
  } = LandingPageAPIUtils({ // Initialize LandingPageAPIUtils with callbacks
    onUpdateSuccess: () => console.log('Update successful'),
    onError: (error) => console.error('Update error', error),
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchLandingPageData(); // Fetch landing page data
      setLoaded(true); // Set loaded state to true after data fetch
    };

    loadData();
  }, [fetchLandingPageData]); // Call effect only on component mount

  if (!loaded || loading) return <div>Loading...</div>; // Display loading indicator while data is fetched

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
              <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: `url(${imageUrl})`}}></div>
              <div className='absolute inset-0 bg-black opacity-10 group-hover:opacity-50'></div>
              <a href="#" className='absolute top-[60%] flex items-center justify-center space-x-2 text-white opacity-0 hover:opacity-100'>
                <span className='text-sm md:text-base font-medium'>View More</span>
                <RxArrowTopRight />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LandingTemplate;
