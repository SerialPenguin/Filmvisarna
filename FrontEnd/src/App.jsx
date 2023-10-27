import { Outlet } from 'react-router-dom';
import './App.css';
import HeaderNavComponent from './components/HeaderNavComponent';

 
function App() {
 
  return (
    <>
      <HeaderNavComponent />
      <Outlet />
    </>
  )
}

export default App