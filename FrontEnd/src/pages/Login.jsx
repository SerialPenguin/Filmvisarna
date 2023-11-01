import LoginForm from "../components/LoginForm";
import "../styling.css"

function Login() {
  return (
    <div className="page-wrapper">
      <h2 className="welcome-text">Välkommen! Logga in här</h2>
      <LoginForm />
    </div>
  )
}

export default Login;