/** @format */

import bluehour from "../assets/img/The-Blue-Hour.jpg";
import rubber from "../assets/img/Rubber.jpg";

const CarouselEventComponent = () => {
  return (
    <div className="event-carousel-container">
      <p className="event-carousel-title">Halloween Extravaganza</p>
      <img src={bluehour} alt="" className="event-carousel-img" />
      <img src={rubber} alt="" className="event-carousel-img" />
    </div>
  );
};

export default CarouselEventComponent;
