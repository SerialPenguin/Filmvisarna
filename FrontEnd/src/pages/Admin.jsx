import { useEffect, useRef, useState } from "react";
import HandleMovies from "../Components/AdministrativActions/AdminHandleMovies/HandleMovies.jsx";
import HandleScreenings from "../Components/AdministrativActions/AdminHandleScreenings/HandleScreenings.jsx";
import HandleBookings from "../Components/AdministrativActions/AdminHandleBookings/HandleBookings.jsx";
import HandleMembers from "../Components/AdministrativActions/AdminHandleMembers/HandleMembers.jsx";
import "./Admin.css";
import { authGet } from "../hooksAndUtils/fetchUtil.js";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [optionState, setOptionState] = useState("non");
  const [topic, setTopic] = useState("noTopic");
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  const movieRef = useRef();
  const screeningRef = useRef();
  const bookingRef = useRef();
  const membersRef = useRef();
  

  const navigate = useNavigate();

  useEffect(() => {
    setToken(sessionStorage.getItem("JWT_TOKEN"));
  }, []);

  useEffect(() => {
    
    async function getUser() {
      setUser(await authGet("/api/auth/profile", token));
    }

    getUser();
  }, [token])

  return (
    <div>
      {user?.userRole !== "ADMIN" && (
        <div className="no-auth-container">
          <p>Nothing here...</p>
          <button className="return-home-btn" onClick={() => navigate("/")}>Return to home</button>
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
                />
              </dialog>
            </div>
            <div className="option">
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
                <HandleBookings />
              </dialog>
            </div>
            <div className="option">
              <p
                className="options-title"
                onClick={() => {
                  membersRef.current?.showModal();
                  setTopic("medlem");
                }}>
                Hantera medlemmar
              </p>
              <dialog className="dialog" ref={membersRef}>
                <button
                  className="close-ref-btn"
                  onClick={() => {
                    membersRef.current?.close();
                    setOptionState("non");
                  }}>
                  X
                </button>
                <HandleMembers
                  optionState={optionState}
                  token={token}
                  setOptionState={setOptionState}
                  topic={topic}
                />
              </dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
