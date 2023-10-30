/** @format */

import HeaderNavComponent from "./Components/HeaderNavComponent.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

function useClearLocalStorageOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/booking") {
      localStorage.removeItem("bookingData");
    }
  }, [pathname]);
}

function App() {
  useClearLocalStorageOnRouteChange();
  return (
    <>
      <HeaderNavComponent />
      <Outlet />
    </>
  );
}

export default App;
