import '../FooterComponent/FooterComponent.css'

const FooterComponent = () => {
  return (
    <div className="footer-container">
        <div className="footer-info-container">
      <h3 className="footer-title">VISSTE DU ATT</h3>
      <p className="footer-text">
        Som medlem får du exklusiva erbjudanden
      </p>
      <p className="footer-text-desktop">
      Fyll i formuläret för att bli medlem hos oss och få tillgång till dina exklusiva erbjudanden redan idag! Det tar bara några sekunder, och du kan vara lugn, vi kommer inte skicka några spam-mejl och dina användaruppgifter är säkra hos oss.
      </p>
      </div>
      <form
        action=""
        className="footer-form-style">
        <h3 style={{ textAlign: "center" }}>Bli Medlem</h3>
        <label htmlFor="">Förnamn</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder="John"
          className="footer-input"
        />
        <label htmlFor="">Efternamn</label>
        <input
          type="text"
          name="surname"
          id=""
          placeholder="Andersson"
          className="footer-input"
        />
        <label htmlFor="">E-postadress</label>
        <input
          type="mail"
          name="email"
          id=""
          placeholder="namn@exempel.se"
          className="footer-input"
        />
        <label htmlFor="">Lösenord</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder="John"
          className="footer-input"
        />

        <button className="footer-btn">Bli medlem</button>
      </form>
    </div>
  );
};

export default FooterComponent;
