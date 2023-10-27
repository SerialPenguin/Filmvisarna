import bg from '../assets/filmvisarna-bg.png';

const CarouselWelcomeComponent = () => {
  return (
    <div key='welcome' style={{ width: "100%", height: "100%", background: "white", margin: "0 auto", textAlign: "center"}}>
        <p style={{position: "absolute", left: "30%", color: "purple"}}>Welcome to Filmvisarna</p>
        <img src={bg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", }}/>
    </div>
  )
}

export default CarouselWelcomeComponent
