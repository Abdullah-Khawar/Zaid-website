import React, { useState, useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import HomeCard from "../HomeSectionCard/HomeCard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link


function HomeSectionCarousel({ sectionName, dummyData }) {
  const responsive = {
    0: {
      items: 1,
      padding: 30,
      cardWidth: "90%",
      cardHeight: "auto",
      fontSizeTitle: "calc(.7rem + 1vw)",
      fontSizeDescription: "calc(0.6rem + 0.5vw)",
    },
    320: {
      items: 2,
      padding: 5,
      cardWidth: "90%",
      cardHeight: "auto",
      fontSizeTitle: "calc(.5rem + 1vw)",
      fontSizeDescription: "calc(0.5rem + 0.4vw)",
    },
    480: {
      items: 2,
      padding: 30,
      cardWidth: "80%",
      cardHeight: "auto",
      fontSizeTitle: "calc(.5rem + 1vw)",
      fontSizeDescription: "calc(.5rem + 0.5vw)",
    },
    720: {
      items: 3,
      padding: 15,
      cardWidth: "90%",
      cardHeight: "20%",
      fontSizeTitle: "calc(.7rem + 0.8vw)",
      fontSizeDescription: "calc(.5rem + 0.7vw)",
    },
    900: {
      items: 4,
      padding: 20,
      cardWidth: "80%",
      cardHeight: "20%",
      fontSizeTitle: "calc(.5rem + 0.9vw)",
      fontSizeDescription: "calc(.4rem + 0.6vw)",
    },
    1024: {
      items: 5,
      padding: 10,
      cardWidth: "80%",
      cardHeight: "auto",
      fontSizeTitle: "calc(.3rem + 1vw)",
      fontSizeDescription: "calc(.3rem + 0.7vw)",
    },
    1280: {
      items: 5,
      padding: 10,
      cardWidth: "80%",
      cardHeight: "auto",
      fontSizeTitle: "calc(.3rem + 1.2vw)",
      fontSizeDescription: "calc(.3rem + 0.8vw)",
    },
    1440: {
      items: 5,
      padding: 10,
      cardWidth: "85%",
      cardHeight: "auto",
      fontSizeTitle: "calc(0rem + 1.2vw)",
      fontSizeDescription: "calc(.0rem + 1vw)",
    },
  };

  const [currentSettings, setCurrentSettings] = useState(responsive[1024]); // Default to 1024 breakpoint
  const [currentIndex, setCurrentIndex] = useState(0); // Track current index
  const carouselRef = useRef(null); // Ref for AliceCarousel

  const determineBreakpoint = () => {
    const screenWidth = window.innerWidth;
    const breakpoints = Object.keys(responsive)
      .map(Number)
      .sort((a, b) => a - b);

    let selectedBreakpoint = breakpoints[0];
    for (let breakpoint of breakpoints) {
      if (screenWidth >= breakpoint) {
        selectedBreakpoint = breakpoint;
      }
    }
    return responsive[selectedBreakpoint];
  };
  useEffect(() => {
    console.log(
      "Carousel Methods: ",
      carouselRef.current?.slidePrev,
      carouselRef.current?.slideNext
    );
  }, []);

  useEffect(() => {
    const updateSettings = () => {
      const newSettings = determineBreakpoint();
      setCurrentSettings(newSettings);
    };

    updateSettings();
    window.addEventListener("resize", updateSettings);

    return () => window.removeEventListener("resize", updateSettings);
  }, []);

 
  const items = dummyData.map((item, index) => (
    <Link key={index} to={`/products/${item._id}`} style={{ textDecoration: "none" }}>
      <HomeCard
        cardWidth={currentSettings.cardWidth}
        cardHeight={currentSettings.cardHeight}
        fontSizeTitle={currentSettings.fontSizeTitle}
        fontSizeDescription={currentSettings.fontSizeDescription}
        data={item}
      />
    </Link>
  ));
  

  

  // Hide buttons dynamically
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= items.length - currentSettings.items;

  return (
    <div className="relative px-4 lg:px-6 max-w-7xl mx-auto ">
      {/* Category Title */}
      <h2 className="category-title text-xl font-semibold ml-10 mb-4">
        {sectionName}
      </h2>

      <div className="relative p-1">
        <AliceCarousel
          ref={carouselRef} // Attach ref to carousel
          mouseTracking
          items={items}
          responsive={responsive}
          controlsStrategy="alternate"
          disableButtonsControls
          disableDotsControls
          activeIndex={currentIndex}
          onSlideChanged={(e) => setCurrentIndex(e.item)}
          paddingLeft={currentSettings.padding}
          paddingRight={currentSettings.padding}
        />
      </div>

      {/* Previous Button */}
      {!isAtStart && (
        <Button
          variant="contained"
          onClick={() => {
            event.stopPropagation();
            console.log("Previous button clicked");
            if (
              carouselRef.current &&
              typeof carouselRef.current.slidePrev === "function"
            ) {
              carouselRef.current.slidePrev();
            } else {
              console.error(
                "slidePrev method is not available on carouselRef.current"
              );
            }
          }}
          className="absolute z-50 top-1/2 transform -translate-y-1/2 left-[-40px]"
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "0px 0px",
            minWidth: "auto",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "8px",
            zIndex: 10,
          }}
          aria-label="previous"
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: "1.3rem" }} />
        </Button>
      )}

      {/* Next Button */}
      {!isAtEnd && (
        <Button
          variant="contained"
          onClick={() => {
            event.stopPropagation();
            console.log("Next button clicked");
            if (
              carouselRef.current &&
              typeof carouselRef.current.slideNext === "function"
            ) {
              carouselRef.current.slideNext();
            } else {
              console.error(
                "slideNext method is not available on carouselRef.current"
              );
            }
          }}
          className="absolute z-50 top-1/2 transform -translate-y-1/2 right-[-40px]"
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "0px 0px",
            minWidth: "auto",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            right: "9px",
            zIndex: 9999,
            boxShadow: "none",
          }}
          aria-label="next"
        >
          <ChevronRightIcon sx={{ fontSize: "1.3rem" }} />
        </Button>
      )}
    </div>
  );
}

export default HomeSectionCarousel;
