/** @format */

import LoginForm from "../components/LoginForm";
import "./Login.css";

function Login() {
  return (
    <div className="login-wrapper">
      <div className="left-section">
        <h2 className="welcome-text">Välkommen!<br/> Logga in här</h2>
        <LoginForm />
        <p className="copyright">
          Filmvisarna AB <span>&copy;</span>2023
        </p>
      </div>
      <div className="right-section">
        <div className="login-bg"></div>
      </div>
    </div>
  );
}

export default Login;
