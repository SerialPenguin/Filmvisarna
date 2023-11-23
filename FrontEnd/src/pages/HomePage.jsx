import {useEffect} from 'react';
import FooterComponent from "../components/FooterComponent/FooterComponent";
import FrontCarouselComponent from "../components/FrontCarouselComponent/FrontCarouselComponent";
import MovieCardComponent from "../components/MovieCardComponent/MovieCardComponent";
import './Homepage.css'

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
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
