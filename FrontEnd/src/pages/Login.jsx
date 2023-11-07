import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
// import "../styling.css"
import "./Login.css"

function Login() {
  return (
    <div className="login-wrapper">
      <div className="left-section">
        <div className="login-header">
          <Link to="/" >
            <div className="logo"></div>
          </Link>
          <h2 className="welcome-text">Välkommen! Logga in här</h2>
        </div>
        <LoginForm />
        <p className="copyright">Filmvisarna AB <span>&copy;</span>2023</p>
      </div>
      <div className="right-section">
        <div className="login-bg"></div>
      </div>
    </div>
  )
}

export default Login;