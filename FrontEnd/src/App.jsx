/** @format */

import HeaderNavComponent from "./Components/HeaderNavComponent.jsx";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("bookingData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <HeaderNavComponent />
      <Outlet />
    </>
  );
}

export default App;
