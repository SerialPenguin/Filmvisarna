import "./ContactFooterComponent.css";
import fb from "../../assets/img/fb-logo.png";
import insta from "../../assets/img/insta-logo.png";
import mail from "../../assets/img/email-logo.png";
import { Link } from "react-router-dom";

const ContactFooterComponent = ({ scrollToTop }) => {
  return (
    <div>
      <div className="contact-footer-container">
        <div className="flex">
          <img className="contact-footer-icon facebook" src={fb} alt="" />
          <img className="contact-footer-icon instagram" src={insta} alt="" />
        </div>
        <nav>
          <ul className="contact-nav-ul">
            <Link to="">
              <li onClick={scrollToTop()}>Hem</li>
            </Link>
            <Link to="/om-oss">
              <li>Om oss</li>
            </Link>
            <Link to="/logga-in">
              <li>Logga in</li>
            </Link>
          </ul>
        </nav>
        <div className="contact-footer-info-container">
          <h2>Kontakta oss</h2>
          <p>Ring oss på 0123-456789<br/>
          eller skicka ett mail
          </p>
          <div className="footer-mail-container">
          <img className="footer-mail-icon" src={mail} alt="" />
          <a href="mailto:film.visers123@outlook.com">Maila oss</a>
          </div>
        </div>
      </div>
      <div className="contact-footer-address">
        <p>Filmvisarna ©2023</p>
        <p>Biografvägen 66</p>
        <p>123 45 Bioland</p>
      </div>
    </div>
  );
};

export default ContactFooterComponent;
