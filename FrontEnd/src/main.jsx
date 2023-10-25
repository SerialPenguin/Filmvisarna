import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Booking from './pages/Booking.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import './index.css';

const router = createBrowserRouter([{ 
  path: '/',
  element: <App />,
  children: [
    {path: '/', element: <Home />},
    {path: '/booking/:screeningId', element: <Booking />},
    {path: '/register', element: <Register />},
    {path: '/login', element: <Login />}
  ]
}])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
