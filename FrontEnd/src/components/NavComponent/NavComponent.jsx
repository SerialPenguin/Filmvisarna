/** @format */

import { Link, useLocation } from "react-router-dom";
import close from "../../assets/img/close.png";
import logo from "../../assets/img/FilmvisarnaLogoTwo.png";
import "./NavComponent.css";

const NavComponent = ({ onCloseClick }) => {
  const location = useLocation();
  const jwtToken = sessionStorage.getItem("JWT_TOKEN");
  const handleLogout = () => {
    // Ta bort JWT-token från sessionStorage vid utloggning
    sessionStorage.removeItem("JWT_TOKEN");
    onCloseClick();
  };
  return (
    <>
      <nav className="nav-container">
        <Link to={"/"}>
          <img className="logo-img-nav" src={logo} alt="" />
        </Link>
        <img
          className="hmbrg-img-nav"
          src={close}
          alt=""
          onClick={onCloseClick}
        />
        <div className="nav-div-container">
          <ul className="nav-list-container">
            <Link to={"/"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                HEM
              </li>
            </Link>
            <Link to={"/booking/6523d4ca1451567f3ed4cebe"}>
              <li
                className={`nav-list-item ${
                  location.pathname.includes("/booking") ? "active" : ""
                }`}
                onClick={onCloseClick}>
                BOKA
              </li>
            </Link>
            <Link to={"/screenings"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/screenings" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                VISNINGAR
              </li>
            </Link>
            <Link to={"/aboutUs"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/aboutUs" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                OM OSS
              </li>
            </Link>
            {jwtToken ? (
              <Link to={"/profile"}>
                <li
                  className={`nav-list-item ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  onClick={onCloseClick}>
                  PROFIL
                </li>
              </Link>
            ) : (
              <Link to={"/register"}>
                <li
                  className={`nav-list-item ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                  onClick={onCloseClick}>
                  BLI MEDLEM
                </li>
              </Link>
            )}
          </ul>
          {jwtToken ? (
            // Om jwtToken finns, visa logout-knapp
            <Link to="/">
              <button className="nav-login-btn" onClick={handleLogout}>
                Logga Ut
              </button>
            </Link>
          ) : (
            // Om jwtToken inte finns, visa login-knapp som länkar till /login
            <Link to="/login">
              <button className="nav-login-btn" onClick={onCloseClick}>
                Logga In
              </button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavComponent;
