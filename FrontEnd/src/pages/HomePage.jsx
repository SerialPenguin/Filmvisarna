import FooterComponent from "../components/FooterComponent/FooterComponent";
import FrontCarouselComponent from "../components/FrontCarouselComponent/FrontCarouselComponent";
import MovieCardComponent from "../components/MovieCardComponent/MovieCardComponent";
import './Homepage.css'

const HomePage = () => {
  return (
    <div className="locked-orientation">
      <FrontCarouselComponent />
      <MovieCardComponent />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
