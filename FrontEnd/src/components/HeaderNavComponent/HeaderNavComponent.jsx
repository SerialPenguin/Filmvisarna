/** @format */

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/img/FilmvisarnaLogoTwo.png";
import menu from "../../assets/img/menu.png";
import NavComponent from "../NavComponent/NavComponent.jsx";
import "./HeaderNavComponent.css";
import { useAuthGet } from "../../hooksAndUtils/useFetch.js";

export default function HeaderNavComponent() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [activeMenu, setActiveMenu] = useState(false);
  const [userRole, setUserRole] = useState();

  const token = sessionStorage.getItem("JWT_TOKEN");

  useAuthGet("/api/auth/profile", token, (data) => {
    setUserRole(data.userRole);
  })

  const showMenu = () => {
    setActiveMenu(true);
  };
  const closeMenu = () => {
    setActiveMenu(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const isWindowDesktop = window.innerWidth >= 768;
      setIsDesktop(isWindowDesktop);

      // Close the menu if window width is greater than or equal to 800 pixels
      if (isWindowDesktop) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="header-nav-bar">
      {!isDesktop && (
        <>
          <Link to={"/"}>
            <img className="logo-img" src={logo} alt="" />
          </Link>
          <img className="hmbrg-img" src={menu} alt="" onClick={showMenu} />
        </>
      )}

      {(activeMenu || isDesktop) && <NavComponent onCloseClick={closeMenu} userRole={userRole} />}
    </div>
  );
}
