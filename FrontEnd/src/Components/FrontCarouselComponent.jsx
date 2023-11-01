import CarouselWelcomeComponent from "./CarouselWelcomeComponent";
import { useState } from "react";
import { useEffect } from "react";
import CarouselMemberComponent from "./CarouselMemberComponent";
import CarouselEventComponent from "./CarouselEventComponent";
import prev from '../assets/prev.png';
import next from '../assets/next.png';
import '../frontpage.css'

const FrontCarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselComponents = [
    <CarouselWelcomeComponent key="welcome" />,
    <CarouselMemberComponent key="member" />,
    <CarouselEventComponent key="events" />,
  ];

  const prevComponent = () => {
    setCurrentSlide(
      (prevIndex) =>
        (prevIndex - 1 + carouselComponents.length) % carouselComponents.length
    );
  };

  const nextComponent = () => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % carouselComponents.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prevIndex) => (prevIndex + 1) % carouselComponents.length
      );
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [carouselComponents.length]);

  return (
    <>
      <div className="front-carousel">
        {carouselComponents[currentSlide]}
      </div>
      <img src={prev} alt="" className="front-carousel-icon" onClick={prevComponent}/>
      <img src={next} alt="" className="front-carousel-icon" style={{ right: "1%"}}onClick={nextComponent}/>
    </>
  );
};

export default FrontCarouselComponent;
