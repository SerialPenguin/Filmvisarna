import FooterComponent from "../Components/FooterComponent/FooterComponent";
import FrontCarouselComponent from "../Components/FrontCarouselComponent/FrontCarouselComponent";
import MovieCardComponent from "../Components/MovieCardComponent/MovieCardComponent";
import './Homepage.css'

const HomePage = () => {

  return (
    <div className="locked-orientation">
      <div className="homepage-container">
      <FrontCarouselComponent />
      <MovieCardComponent />
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
