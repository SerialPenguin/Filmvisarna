import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/FilmvisarnaLogoTwo.png";
import menu from "../assets/menu.png";
import NavComponent from "./NavComponent.jsx";
import "../styling.css"

export default function HeaderNavComponent() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 800);
  const [activeMenu, setActiveMenu] = useState(false);

  const showMenu = () => {
      setActiveMenu(true); 
  }
  const closeMenu = () => {
    setActiveMenu(false)
  }

  useEffect(() => {
    const handleResize = () => {
      const isWindowDesktop = window.innerWidth >= 800;
      setIsDesktop(isWindowDesktop);

      // Close the menu if window width is greater than or equal to 800 pixels
      if (isWindowDesktop) {
        setActiveMenu(false);
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
          <img className="logo-img" src={logo} alt=""/>
        </Link>
        <img className="hmbrg-img" src={menu} alt="" onClick={showMenu}/>
        </>
      )}
      
      {(activeMenu || isDesktop) && (<NavComponent onCloseClick={closeMenu}/>)}
    </div>
  );
}
