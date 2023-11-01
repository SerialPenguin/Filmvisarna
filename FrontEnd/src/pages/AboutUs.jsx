/* eslint-disable react/no-unescaped-entities */
import cinema from "../assets/img/cinema.jpg";
import counter from "../assets/img/counter.jpg";
import "./aboutUs.css";

export function AboutUs() {
  return (
    <div className="about-us-content">
      <section className="about-us-section">
        <img className="cinema-img" src={cinema} alt="Biograf" />
        <div className="img-h2-text-container">
          <div className="img-h2-container">
            <h2>Om oss</h2>
            <img className="counter-img" src={counter} alt="Kassa" />
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            porttitor dictum libero, in porttitor nulla elementum mattis. Duis
            pretium consectetur libero quis sodales. In justo dui, dignissim sed
            magna non, malesuada placerat diam. Vivamus eu dapibus nisi, at
            scelerisque arcu. Maecenas molestie at dolor eget euismod. Fusce
            quis iaculis lorem, vel condimentum urna. Nulla augue quam, volutpat
            non pretium consequat, dapibus at ipsum. Donec rhoncus purus a
            lectus vehicula, id ornare eros fringilla
          </p>
        </div>
      </section>

      <section className="find-us-section">
        <h2>Hitta hit</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.8067356887113!2d18.058986395070207!3d59.33436936086856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d5df576834b%3A0xaa5fb7c599c41398!2sFilmstaden%20Sergel!5e0!3m2!1ssv!2sse!4v1698224787582!5m2!1ssv!2sse"
          width="400"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
