import cinema from "../assets/img/cinema.jpg";
import counter from "../assets/img/counter.jpg";

export function AboutUs() {
  return (
    <>
      <section>
        <h1>Om oss</h1>
        <img src={cinema} alt="Biograf" />
        <img src={counter} alt="Kassa" />
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
      </section>

      <section>
        <h1>Hitta hit</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.8067356887113!2d18.058986395070207!3d59.33436936086856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d5df576834b%3A0xaa5fb7c599c41398!2sFilmstaden%20Sergel!5e0!3m2!1ssv!2sse!4v1698224787582!5m2!1ssv!2sse"
          width="400"
          height="300"
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  );
}
