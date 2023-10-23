import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/:screeningId" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;