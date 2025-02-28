import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import carouselImagesData from './carouselImagesData';


const responsive = {
  0: { items: 1 },
  568: { items: 1 },
  1024: { items: 1 },
};

const MainCarousel = () => {
  const items = carouselImagesData.map((image, index) => (
    <div key={index} className="w-full flex justify-center object-cover object-top">
      <img
        className="w-full max-w-screen h-auto"
        src={image.image}
        alt={`Slide ${index + 1}`}
        role="presentation"
      />
    </div>
));

  return (
    <div className="w-full relative -z-99">
      <AliceCarousel
        mouseTracking
        items={items}
        responsive={responsive}
        controlsStrategy="alternate"
        infinite
        autoPlay
        disableButtonsControls
        autoPlayInterval={1000}
      />
    </div>
  );
};

export default MainCarousel;
