import bg from '../assets/filmvisarna-bg.png';

const CarouselWelcomeComponent = () => {
  return (
    <div key='welcome' style={{ width: "100%", height: "100%", background: "white", margin: "0 auto", textAlign: "center", marginTop: "0"}}>
        <h2 style={{position: "absolute", left: "0%", color: "#C699EA", fontSize: "3em"}}>Välkommen till Filmvisarna</h2>
        <img src={bg} alt="" style={{ width: "100%", height: "100%" }}/>
    </div>
  )
}

export default CarouselWelcomeComponent
