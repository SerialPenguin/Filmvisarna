import RegisterForm from "../components/RegisterForm.jsx";
import { Link } from "react-router-dom";
import "./Register.css"

function Register() {

  return (
    <div className="register-wrapper">
      <div className="login-header">
      < Link to="/" >
          <div className="logo"></div>
        </Link>
        <h2 className="welcome-text">Välkommen! Bli medlem här</h2>
      </div>
      <RegisterForm />
      <p className="copyright">Filmvisarna AB <span>&copy;</span>2023</p>
    </div>
  );
}

export default Register;