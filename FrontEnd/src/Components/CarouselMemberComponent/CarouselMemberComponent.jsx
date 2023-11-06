import { Link } from "react-router-dom"
import '../CarouselMemberComponent/CarouselMemberComponent.css'

const CarouselMemberComponent = () => {
  return (
      <div className="member-carousel-container">
        <div className="member-carousel-box">
      <h2 className="member-carousel-title">Bli ny medlem</h2>
      <p className="member-carousel-text">Som medlem får du härliga erbjudanden och andra fördelar.</p>
       <p className="member-carousel-text"> Tryck på knappen för att registrera dig!</p>
      <Link to={'/register'}>
      <button className="member-carousel-btn">Bli medlem</button>
      </Link>
      </div>
    </div>
  )
}

export default CarouselMemberComponent
