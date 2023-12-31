import { useRef, useState } from "react";
import HandleMovies from "../components/AdministrativActions/AdminHandleMovies/HandleMovies.jsx";
import HandleScreenings from "../components/AdministrativActions/AdminHandleScreenings/HandleScreenings.jsx";
import HandleBookings from "../components/AdministrativActions/AdminHandleBookings/HandleBookings.jsx";
import HandleMembers from "../components/AdministrativActions/AdminHandleMembers/HandleMembers.jsx";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useAuthGet } from "../hooksAndUtils/useFetch.js";

export default function Admin() {
  const [optionState, setOptionState] = useState("non");
  const [topic, setTopic] = useState("noTopic");
  const [user, setUser] = useState();

  const movieRef = useRef();
  const screeningRef = useRef();
  const bookingRef = useRef();
  const memberRef = useRef();

  const navigate = useNavigate();

  const token = sessionStorage.getItem("JWT_TOKEN");
  
  useAuthGet('/api/auth/profile', token, (data) => {
    setUser(data);
  })

  return (
    <div className="top-container">
      {user?.userRole !== "ADMIN" && (
        <div className="no-auth-container">
          <p>Nothing here...</p>
          <button className="return-home-btn" onClick={() => navigate("/")}>
            Return to home
          </button>
        </div>
      )}
      {user?.userRole === "ADMIN" && (
        <div className="admin-landing-page">
          <h2 className="admin-welcome-header">Välkommen admin</h2>
          <h4 className="admin-options-header">Vad vill du göra?</h4>
          <div className="options-list">
            <div className="option">
              <p
                className="options-title"
                onClick={() => {
                  movieRef.current?.showModal();
                  setTopic("film");
                }}>
                Hantera filmer
              </p>
              <dialog className="dialog" ref={movieRef}>
                <button
                  className="close-ref-btn"
                  onClick={() => {
                    movieRef.current?.close();
                    setOptionState("non");
                  }}>
                  X
                </button>
                <HandleMovies
                  optionState={optionState}
                  token={token}
                  setOptionState={setOptionState}
                  topic={topic}
                  setTopic={setTopic}
                  movieRef={movieRef.current}
                />
              </dialog>
            </div>
            <div className="option">
              <p
                className="options-title"
                onClick={() => {
                  screeningRef.current?.showModal();
                  setTopic("visning");
                }}>
                Hantera visningar
              </p>
              <dialog className="dialog" ref={screeningRef}>
                <button
                  className="close-ref-btn"
                  onClick={() => {
                    screeningRef.current?.close();
                    setOptionState("non");
                  }}>
                  X
                </button>
                <HandleScreenings
                  optionState={optionState}
                  token={token}
                  setOptionState={setOptionState}
                  topic={topic}
                  screeningRef={screeningRef.current}
                />
              </dialog>
            </div>
            <div className="option" >
              <p
                className="options-title"
                onClick={() => {
                  bookingRef.current?.showModal();
                  setTopic("bokning");
                }}>
                Hantera bokningar
              </p>
              <dialog className="dialog" ref={bookingRef}>
                <button
                  className="close-ref-btn"
                  onClick={() => {
                    bookingRef.current?.close();
                    setOptionState("non");
                  }}>
                  X
                </button>
                <HandleBookings 
                  optionState={optionState}
                  setOptionState={setOptionState} 
                  bookingRef={bookingRef.current}
                  token={token}/>
              </dialog>
            </div>
            <div className="option">
              <p
                className="options-title"
                onClick={() => {
                  memberRef.current?.showModal();
                  setTopic("medlem");
                }}>
                Hantera medlemmar
              </p>
              <dialog className="dialog" ref={memberRef}>
                <button
                  className="close-ref-btn"
                  onClick={() => {
                    memberRef.current?.close();
                    setOptionState("non");
                  }}>
                  X
                </button>
                <HandleMembers
                  optionState={optionState}
                  setOptionState={setOptionState}
                  token={token}
                  topic={topic}
                  memberRef={memberRef.current}
                />
              </dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
