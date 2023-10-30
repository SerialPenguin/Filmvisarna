import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/FilmvisarnaLogoTwo.png";
import menu from "../assets/menu.png";
import NavComponent from "./NavComponent";

export default function HeaderNavComponent() {
    const [activeMenu, setActiveMenu] = useState(false);

    const showMenu = () => {
        console.log("show")
        setActiveMenu(true); 
    }
    const closeMenu = () => {
      setActiveMenu(false)
    }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "390px",
        height: "4em",
        background: "black",
        padding: ".5em",
      }}>
        
      <Link to={"/"}>
        <img style={{ height: "2.5em", marginTop: "1em" }} src={logo} alt=""/>
      </Link>
      <img style={{ height: "2.5em", marginTop: "1.8em" }} src={menu} alt="" onClick={showMenu}/>
      {activeMenu && (<NavComponent onCloseClick={closeMenu}/>)}
    </div>
  );
}
