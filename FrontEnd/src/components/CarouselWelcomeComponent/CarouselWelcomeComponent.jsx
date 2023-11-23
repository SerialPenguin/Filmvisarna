// import bg from "../../assets/img/filmvisarna-bg.png";
import bg2000w from "../../assets/scaled/cinema-2000w.jpg"
import bg1500w from "../../assets/scaled/cinema-1500w.jpg"
import bg1000w from "../../assets/scaled/cinema-1000w.jpg"
import bg500w from "../../assets/scaled/cinema-500w.jpg"

import "../CarouselWelcomeComponent/CarouselWelcomeComponent.css";

const CarouselWelcomeComponent = () => {
  return (
    <div className="welcome-carousel-container">
      <h2 className="welcome-carousel-title">Välkommen till Filmvisarna</h2>
      <img
        src={bg2000w}
        srcSet={`${bg2000w} 2000w, ${bg1500w} 1500w, ${bg1000w} 1000w, ${bg500w} 500w`}
        sizes="(max-width: 2500px) 2000w, (max-width: 1700px) 1500w, (max-width: 1200px) 1000w, (max-width: 700px) 500px"
        alt=""
        style={{ width: "100%", height: "100%" }}
        className="welcome-carousel-img"
      />
    </div>
  );
};

export default CarouselWelcomeComponent;