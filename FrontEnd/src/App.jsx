import { Outlet } from 'react-router-dom';
import './App.css';
function App() {
 
  return (
    <>
      <a href="/">Hem</a>
      <Outlet />
    </>
  )
}

export default App