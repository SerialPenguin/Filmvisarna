import { Link } from "react-router-dom"
import '../CarouselMemberComponent/CarouselMemberComponent.css'

const CarouselMemberComponent = () => {
  return (
      <div className="member-carousel-container">
        <div className="member-carousel-box">
      <h2 className="member-carousel-title">MEDLEMSKLUBBEN</h2>
      <p className="member-carousel-text">Bli medlem hos oss på Filmvisarna och utforska filmens magi! Få tillgång till ett brett utbud av internationella filmer, exklusiva evenemang och fantastiska erbjudanden. Ansök idag för en filmupplevelse utöver det vanliga! </p>
       <p className="member-carousel-text">Registrera dig idag!</p>
      <Link to={'/registrera'}>
      <button className="member-carousel-btn">Bli medlem</button>
      </Link>
      </div>
    </div>
  )
}

export default CarouselMemberComponent
