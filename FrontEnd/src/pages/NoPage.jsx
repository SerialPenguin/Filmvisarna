import { useNavigate } from "react-router-dom"
import './NoPage.css';

export default function NoPage() {
  const navigate = useNavigate();
  
  return (
    <div className='no-page-conatiner'>
      <h1 className="no-page-header">This is not the site you are looking for..</h1>
      <button className="no-page-back-btn" onClick={() => navigate("/")}>Go back to home</button>
    </div>
  )
}
