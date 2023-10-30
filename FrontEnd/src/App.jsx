import HeaderNavComponent from './Components/HeaderNavComponent.jsx';
import { Outlet } from 'react-router-dom';
import './App.css';
function App() {
  return (
    <>
      <HeaderNavComponent />
      <Outlet />
    </>
  );
}

export default App;
