import { Link } from "react-router-dom";
import blueHour from "../assets/img/blue-hour_21.jpg";
import mio from "../assets/img/mio_min_mio_3.avif"; 
import grinch from "../assets/img/grinch.jpeg";
import "./Events.css";

const Events = () => {
  const eventsInfo = [
    {
      date: "15 oktober - 4 november",
      movie: "The Blue Hour", 
      img: blueHour,
      title: "Upplev rysligt nöje hos oss på Filmvisarna",
      textInfo:
        "Låt dig förföras av två internationella skräckmästerverk i vårt Halloween-dunkla bioljus. Spänning, skräck och en natt du sent ska glömma. Vågar du?",
    },
    {
        date: "1 december - 30 december",
        movie: "Grinchen", 
        img: grinch,
        title: "Fånga julmagin hos oss i vinter",
        textInfo:
          " Två hjärtvärmande internationella julsagor väntar på dig i vår julfyllda biosalong. Upplev känslan av julefrid och överraskningar. En underbar kväll som sprider glädje!",
      },
      {
        date: "3 januari - 16 januari",
        movie: "Mio min Mio",
        img: mio,
        title:"Gör dig redo för #förtrollande äventyr!",
        textInfo:
          "Utforska en värld av skratt och spänning med två fantastiska barnfilmer. Ett magiskt äventyr för de små, fyllt med skratt och glädje. En dag fylld av överraskningar och lekfullhet! ",
      },
  ];

  return (
    <div className="event-container">
      <h1 className="event-header">Vad händer hos oss?</h1>
      {eventsInfo.map((event) => (
        <div key={event.title} className="event-cards">
          <p className="event-date">{event.date}</p>
          <img className="event-img" src={event.img} alt="" />
          <div className="event-textbox">
            <h2 className="event-title">{event.title}</h2>
            <p className="event-text">{event.textInfo}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
