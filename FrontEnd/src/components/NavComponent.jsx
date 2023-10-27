import { Link } from "react-router-dom";
import close from "../assets/close.png";
import logo from "../assets/FilmvisarnaLogoTwo.png";

const NavComponent = ({onCloseClick}) => {
  return (
    <>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "390px",
          height: "100vh",
          background: "black",
          position: "absolute",
          textAlign: "center",
          top: "0em",
          left: "0em",
          zIndex: "1000"
        }}>
        <Link to={"/"}>
          <img
            style={{ height: "2.5em", top: "2em", position: "absolute", left: "2em" }}
            src={logo}
            alt=""
          />
        </Link>
        <img style={{ position: "absolute", right: 0, margin: "2.5em",  height: "2em" }} src={close} alt="" onClick={onCloseClick}/>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <Link to={"/"}>
            <li style={{ padding: "2em" }}>HEM</li>
          </Link>
          <Link to={"/booking"}>
            <li style={{ padding: "2em" }}>BOKA</li>
          </Link>
          <Link to={"/contactUs"}>
            <li style={{ padding: "2em" }}>KONTAKT</li>
          </Link>
          <Link to={"/profile"}>
            <li style={{ padding: "2em" }}>PROFIL</li>
          </Link>
          <Link to={"/register"}>
            <li style={{ padding: "2em" }}>BLI MEDLEM</li>
          </Link>
        </ul>
        <Link to={"/login"}>
          <button style={{ marginBottom: "2em" }}>Logga In</button>
        </Link>
      </nav>
    </>
  );
};

export default NavComponent;
