import { Link } from "react-router-dom"

const CarouselMemberComponent = () => {
  return (
      <div style={{ width: "70%", height: "100%", background: "black", margin: "0 auto", textAlign: "center", color: "white"}}>
      <h2 style={{ margin: "0"}}>Bli ny medlem</h2>
      <p>Som medlem får du härliga erbjudanden och andra fördelar. Tryck på knappen för att registrera dig!</p>
      <Link to={'/register'}>
      <button style={{ backgroundColor: "#BA7E36", width: "200px"}}>Bli medlem</button>
      </Link>
    </div>
  )
}

export default CarouselMemberComponent
