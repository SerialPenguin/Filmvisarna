import bluehour from '../assets/halloween-thebluehour.jpeg';
import rubber from '../assets/halloween-rubber.jpeg';

const CarouselEventComponent = () => {
  return (
      <div style={{ width: "70%", height: "100%", background: "black", margin: "0 auto", textAlign: "center"}}>
      <p style={{ color: "orange", margin: 0}}>Halloween Extravaganza</p>
      <img src={bluehour} alt="" style={{ height: "70%"}}/>
      <img src={rubber} alt="" style={{ height: "70%"}}/>
    </div>
    
  )
}

export default CarouselEventComponent

