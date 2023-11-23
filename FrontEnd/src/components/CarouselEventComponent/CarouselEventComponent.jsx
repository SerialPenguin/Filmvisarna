/** @format */
import { Link } from "react-router-dom";
import movieEventImg from "../../assets/img/halloween-event.png";
import "../CarouselEventComponent/CarouselEventComponent.css";

const CarouselEventComponent = () => {
  return (
    <div className="event-carousel-container">
      <Link to={"/evenemang"}>
      <img src={movieEventImg} title="Klicka för mer information" className="movie-bg-img"/>
      </Link>
    </div>
  );
};

export default CarouselEventComponent;
