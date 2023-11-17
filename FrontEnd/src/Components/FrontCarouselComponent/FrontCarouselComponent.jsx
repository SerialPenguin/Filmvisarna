/** @format */

import { useState, useRef } from "react";
import { useEffect } from "react";
import CarouselWelcomeComponent from "../CarouselWelcomeComponent/CarouselWelcomeComponent";
import CarouselMemberComponent from "../CarouselMemberComponent/CarouselMemberComponent";
import CarouselEventComponent from "../CarouselEventComponent/CarouselEventComponent";
import prev from "../../assets/img/prev.png";
import next from "../../assets/img/next.png";
import "../FrontCarouselComponent/FrontCarouselComponent.css";

const FrontCarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  let interval = useRef(null);

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
    clearInterval(interval.current);
    slideTimer();
  };

  const nextComponent = () => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % carouselComponents.length);
    clearInterval(interval.current);
    slideTimer();
  };

  const slideTimer = () => {
    interval.current = setInterval(() => {
      setCurrentSlide(
        (prevIndex) => (prevIndex + 1) % carouselComponents.length
      );
    }, 7000);
  };

  useEffect(() => {
    slideTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <>
      <div className="front-carousel">{carouselComponents[currentSlide]}</div>
      <img
        src={prev}
        alt=""
        className="front-carousel-icon"
        style={{ left: "1%" }}
        onClick={prevComponent}
      />
      <img
        src={next}
        alt=""
        className="front-carousel-icon"
        style={{ right: "1%" }}
        onClick={nextComponent}
      />
    </>
  );
};

export default FrontCarouselComponent;
