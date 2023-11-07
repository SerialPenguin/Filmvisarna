import bluehour from '../../assets/halloween-thebluehour.jpeg';
import rubber from '../../assets/halloween-rubber.jpeg';
import '../CarouselEventComponent/CarouselEventComponent.css'

const CarouselEventComponent = () => {
  return (
      <div className='event-carousel-container'>
      <p className='event-carousel-title'>Halloween Extravaganza</p>
      <div>
      <img src={bluehour} alt="" className='event-carousel-img'/>
      <img src={rubber} alt="" className='event-carousel-img'/>
      </div>
      <div>
      <p className='event-carousel-text'>Sugen på en spöklik Halloween? Gör din kväll riktigt otäck med vårt urval av internationella skräckfilmer.</p>
      </div>
    </div>
    
  )
}

export default CarouselEventComponent

