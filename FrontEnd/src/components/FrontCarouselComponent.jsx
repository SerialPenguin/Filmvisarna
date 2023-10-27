import CarouselWelcomeComponent from "./CarouselWelcomeComponent";
import { useState } from "react";
import { useEffect } from "react";
import CarouselMemberComponent from "./CarouselMemberComponent";
import CarouselEventComponent from "./CarouselEventComponent";
import prev from '../assets/prev.png';
import next from '../assets/next.png';

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
      <div style={{ width: "390px", height: "30vh", background: "black", position: "relative"}}>
        {carouselComponents[currentSlide]}
      </div>
      <img src={prev} alt="" style={{ position: "absolute", top: "21%", left: "1%", width: "30px"}} onClick={prevComponent}/>
      <img src={next} alt="" style={{ position: "absolute", top: "21%", right: "1%", width: "30px"}} onClick={nextComponent}/>
    </>
  );
};

export default FrontCarouselComponent;
