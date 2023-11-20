/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import Booking from "./pages/Booking.jsx";
import MovieInfo from "./pages/MovieInfo.jsx";
import Screenings from "./pages/Screenings.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Events from "./pages/Events.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import Admin from "./pages/Admin.jsx";
import NoPage from "./pages/NoPage.jsx";
import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/bokning/:screeningId", element: <Booking /> },
      { path: "/sök/filmer/:movieId", element: <MovieInfo /> },
      { path: "/visningar", element: <Screenings /> },
      { path: "/registrera", element: <Register /> },
      { path: "/logga-in", element: <Login /> },
      { path: "/profil", element: <Profile /> },
      { path: "/om-oss", element: <AboutUs /> },
      { path: "/admin", element: <Admin /> },
      { path: "/evenemang", element: <Events />},
      { path: "*", element: <NoPage /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
