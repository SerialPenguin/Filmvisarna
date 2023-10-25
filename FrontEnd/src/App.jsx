import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <a href="/">Hem</a>
      <a href="/auth/profile">Profile</a>

      <Outlet />
    </>
  );
}

export default App;

// om man är inloggad; visa profil
