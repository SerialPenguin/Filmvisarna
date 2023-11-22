import { Link } from "react-router-dom"
import '../CarouselMemberComponent/CarouselMemberComponent.css'

const CarouselMemberComponent = () => {
  return (
      <div className="member-carousel-container">
        <div className="member-carousel-box">
      <h2 className="member-carousel-title">BLI NY MEDLEM</h2>
      <p className="member-carousel-text">Som medlem får du härliga erbjudanden och andra fördelar.</p>
       <p className="member-carousel-text"> Tryck på knappen för att registrera dig!</p>
      <Link to={'/registrera'}>
      <button className="member-carousel-btn">Bli medlem</button>
      </Link>
      </div>
    </div>
  )
}

export default CarouselMemberComponent
