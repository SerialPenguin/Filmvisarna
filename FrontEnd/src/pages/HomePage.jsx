import FooterComponent from "../components/FooterComponent/FooterComponent";
import FrontCarouselComponent from "../components/FrontCarouselComponent/FrontCarouselComponent";
import MovieCardComponent from "../components/MovieCardComponent/MovieCardComponent";

const HomePage = () => {
  return (
    <>
      <FrontCarouselComponent />
      <MovieCardComponent />
      <FooterComponent />
    </>
  );
};

export default HomePage;
