/** @format */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGet } from "../../hooksAndUtils/useFetch";
import close from "../../assets/img/close.png";
import logo from "../../assets/img/FilmvisarnaLogoTwo.png";
import "./NavComponent.css";
import { useState } from "react";

const NavComponent = ({ onCloseClick, userRole }) => {
  const [screening, setScreenings] = useState([]);
  const navigate = useNavigate();

  useGet("/api/screenings", (data) => {
    setScreenings(data);
  });
  const firstScreeningId =
    screening.length > 0 ? "/bokning/" + screening[0]._id : "";
  const location = useLocation();
  const jwtToken = sessionStorage.getItem("JWT_TOKEN");

  const handleLogout = () => {
    // Ta bort JWT-token från sessionStorage vid utloggning
    sessionStorage.removeItem("JWT_TOKEN");
    navigate("/");
    window.location.reload();
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
            {firstScreeningId ? (
              <Link to={`${firstScreeningId}`}>
                <li
                  className={`nav-list-item ${
                    location.pathname.includes("/bokning") ? "active" : ""
                  }`}
                  onClick={onCloseClick}>
                  BOKA
                </li>
              </Link>
            ) : (
              <div>
                <li
                  className={`nav-list-item loading-cursor ${
                    location.pathname.includes("/bokning") ? "active" : ""
                  }`}>
                  BOKA
                </li>
              </div>
            )}
            <Link to={"/visningar"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/visningar" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                VISNINGAR
              </li>
            </Link>
            <Link to={"/om-oss"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/om-oss" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                OM OSS
              </li>
            </Link>
            <Link to={"/evenemang"}>
              <li
                className={`nav-list-item ${
                  location.pathname === "/evenemang" ? "active" : ""
                }`}
                onClick={onCloseClick}>
                EVENT
              </li>
            </Link>
            {userRole === "ADMIN" ? (
              <Link to={"/admin"}>
                <li
                  className={`nav-list-item ${
                    location.pathname === "/admin" ? "active" : ""
                  }`}
                  onClick={onCloseClick}>
                  ADMIN
                </li>
              </Link>
            ) : userRole === "USER" ? (
              <Link to={"/profil"}>
                <li
                  className={`nav-list-item ${
                    location.pathname === "/profil" ? "active" : ""
                  }`}
                  onClick={onCloseClick}>
                  PROFIL
                </li>
              </Link>
            ) : (
              <Link to={"/registrera"}>
                <li
                  className={`nav-list-item ${
                    location.pathname === "/registrera" ? "active" : ""
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
            <Link to="/logga-in">
              <button
                className={`nav-login-btn ${
                  location.pathname === "/logga-in" ? "active" : ""
                }`}
                onClick={onCloseClick}>
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
