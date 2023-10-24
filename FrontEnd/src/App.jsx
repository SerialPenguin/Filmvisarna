import './App.css';
import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <>
    <ul>
      <li>
        <Link to="/">home</Link>
      </li>
      <li>
        <Link to="/screenings">screenings</Link>
      </li>
    </ul>
      <Outlet />
    </>
  );
}

export default App;