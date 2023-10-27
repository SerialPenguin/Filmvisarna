import { Outlet } from 'react-router-dom';
import './App.css';
import HeaderNavComponent from './components/HeaderNavComponent';

 
function App() {
 
  return (
    <>
      <HeaderNavComponent />
      <a href="/screenings">link</a>
      <Outlet />
    </>
  )
}

export default App