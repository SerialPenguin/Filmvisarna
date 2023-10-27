import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.jsx';
import Booking from './pages/Booking.jsx';
import MovieInfo from './pages/MovieInfo.jsx'
import Screenings from './pages/Screenings.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import './index.css';
import HomePage from './pages/HomePage.jsx';

const router = createBrowserRouter([{ 
  path: '/',
  element: <App />,
  children: [
    {path: '/', element: <HomePage />},
    {path: '/booking/:screeningId', element: <Booking />},
    {path: '/search/movies/:movieId', element: <MovieInfo />},
    {path: '/screenings', element: <Screenings />},
    {path: '/register', element: <Register />},
    {path: '/login', element: <Login />}
  ]
}])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
