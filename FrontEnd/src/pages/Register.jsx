import RegisterForm from "../Components/RegisterForm.jsx";
import { Link } from "react-router-dom";
import "./Register.css"

function Register() {

  return (
    <div className="register-wrapper">
      <div className="left-section">
        <h2 className="welcome-text">Välkommen! Bli medlem här</h2>
        <RegisterForm />
        <p className="copyright">Filmvisarna AB <span>&copy;</span>2023</p>
      </div>
      <div className="right-section">
        <div className="login-bg"></div>
      </div>
    </div>
  );
}

export default Register;