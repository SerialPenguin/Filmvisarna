/** @format */

import HeaderNavComponent from "./components/HeaderNavComponent/HeaderNavComponent";
import { Outlet } from "react-router-dom";
import "./App.css";
import ContactFooterComponent from "./components/ContactFooterComponent/ContactFooterComponent";

function App() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeaderNavComponent />
      <Outlet />
      <ContactFooterComponent scrollToTop={() => handleScrollToTop} />
    </>
  );
}

export default App;
