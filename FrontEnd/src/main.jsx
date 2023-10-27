import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.jsx';
import Booking from './pages/Booking.jsx';
import './index.css';
import HomePage from './pages/HomePage.jsx';

const router = createBrowserRouter([{ 
  path: '/',
  element: <App />,
  children: [
    {path: '/', element: <HomePage />},
    {path: '/home', element: <HomePage />},
    {path: '/booking/:screeningId', element: <Booking />},
  ]
}])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
