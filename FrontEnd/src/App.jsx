import './App.css';
import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <Link to="/">Hem</Link>
      <Outlet />
    </>
  );
}

export default App;