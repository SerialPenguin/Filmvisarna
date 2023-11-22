import blueHour from "../assets/img/blue-hour_21.jpg";
import mio from "../assets/img/mio_min_mio_3.avif";
import grinch from "../assets/img/grinch.jpeg";
import "./Events.css";

const Events = () => {
  const eventsInfo = [
    {
      id: 1,
      date: "15 oktober - 4 november",
      movie: "The Blue Hour",
      img: blueHour,
      title: "Rysligt nöje hos Filmvisarna",
      textInfo:
        "Dyk in i Halloween-natten med Filmvisarna och upplev en oöverträffad skräckupplevelse. Vi presenterar två internationella skräckmästerverk som kommer få ditt hjärta att klappa snabbare. Vårt dunkla bioljus skapar den perfekta atmosfären för en oförglömlig kväll fylld med spänning och skräck. Var beredd på att bli förförd av mörkrets mystik och upplev en natt som kommer sätta sina spår i dina drömmar. Från överraskande vändningar till skrämmande scener - vågar du ge dig hän åt den rysliga njutningen? Ta mod till dig och fira Halloween med oss på Filmvisarna för en natt du sent kommer glömma.",
    },
    {
      id: 2, 
      date: "1 december - 30 december",
      movie: "Grinchen",
      img: grinch,
      title: "Fånga julmagin i vinter",
      textInfo:
        "Följ med oss på Filmvisarna in i en julfylld värld, där två hjärtvärmande internationella julsagor väntar. I vår ombonade biosalong kommer du att uppleva känslan av julefrid och överraskningar. Luta dig tillbaka och låt dessa berättelser fylla ditt hjärta med värme och glädje. Från stämningsfulla miljöer till känslosamma ögonblick, varje scen är noggrant utvald för att skapa en underbar kväll som sprider julefrid och lycka. Ta med familj och vänner för att dela denna magiska stund tillsammans. Skapa minnen och låt juleandens glädje lysa upp ditt hjärta hos oss på Filmvisarna.",
    },
    {
      id: 3,
      date: "3 januari - 16 januari",
      movie: "Mio min Mio",
      img: mio,
      title: "Gör dig redo för äventyr!",
      textInfo:
        "Ge dig hän åt en dag av glädje och lekfullhet hos Filmvisarna med två fantastiska barnfilmer som tar de små på ett magiskt äventyr. Utforska en värld av skratt och spänning där varje scen är fylld med glädje. Upplev hjärtvärmande överraskningar och låt barnens skratt fylla biosalongen. Från färgglada karaktärer till spännande berättelser är varje ögonblick noga utvalt för att skapa en oförglömlig upplevelse. Ta med hela familjen och fördjupa er i en dag av ren underhållning och glädje. Hos Filmvisarna väntar en värld där barnens lekfullhet och oskuldsfullhet tar center stage för en dag att minnas.",
    },
  ];

  return (
    <div className="event-container">
      <h1 className="event-header">Event</h1>
      {/* <p className="event-text">Här kan du få information om vad som händer hos oss på Filmvisarna.</p> */}
      {eventsInfo.map((event) => (
        <div key={event.title} id={event.id} className="event-cards">
          <h2 className="event-title">{event.title}</h2>
          <img className="event-img" src={event.img} alt="" />
          <div className="event-textbox">
            <p className="event-date">{event.date}</p>
            <p className="event-text">{event.textInfo}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
