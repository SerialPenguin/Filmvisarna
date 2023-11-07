/** @format */

import bg from "../assets/img/filmvisarna-bg.png";

const CarouselWelcomeComponent = () => {
  return (
    <div className="welcome-carousel-container">
      <h2 className="welcome-carousel-title">Välkommen till Filmvisarna</h2>
      <img
        src={bg}
        alt=""
        style={{ width: "100%", height: "100%" }}
        className="welcome-carousel-img"
      />
    </div>
  );
};

export default CarouselWelcomeComponent;
