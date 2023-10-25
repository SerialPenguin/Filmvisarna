import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <a href="/">Hem</a>
      <a href="/auth/profile">Profil</a>
      <a href="/aboutus">Om oss</a>

      <Outlet />
    </>
  );
}

export default App;

// om man är inloggad; visa profil
