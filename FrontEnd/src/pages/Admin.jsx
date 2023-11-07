import {useRef, useState} from 'react';
import HandleMovies from "../Components/AdministrativActions/AdminHandleMovies/HandleMovies.jsx"
import HandleScreenings from '../Components/AdministrativActions/AdminHandleScreenings/HandleScreenings.jsx';
import HandleBookings from '../Components/AdministrativActions/AdminHandleBookings/HandleBookings.jsx';
import HandleMembers from '../Components/AdministrativActions/AdminHandleMembers/HandleMembers.jsx';
import './Admin.css';

export default function Admin() {

  const [optionState, setOptionState] = useState('non');
  const [topic, setTopic] = useState('noTopic');

  const movieRef = useRef();
  const screeningRef = useRef();
  const bookingRef = useRef();
  const membersRef = useRef();

  return (
    <div className="admin-landing-page">
      <h2 className="admin-header">Välkommen admin</h2>
      <h4 className="admin-options-header">Vad vill du göra?</h4>
      <div className="options-list">
        <div className="option" >
          <p className='options-title' onClick={() => {movieRef.current?.showModal(); setTopic('film')}}>Hantera filmer</p>
          <dialog className="dialog" ref={movieRef}>
            <button className='close-ref-btn' onClick={() => {movieRef.current?.close(); setOptionState('non')}}>X</button>
            <HandleMovies optionState={optionState} setOptionState={setOptionState} topic={topic}/>
          </dialog>
        </div>
        <div className="option" >
          <p className='options-title' onClick={() => {screeningRef.current?.showModal(); setTopic('visning')}}>Hantera visningar</p>
          <dialog className="dialog" ref={screeningRef}>
            <button className='close-ref-btn' onClick={() => {screeningRef.current?.close(); setOptionState('non')}}>X</button>
            <HandleScreenings optionState={optionState} setOptionState={setOptionState} topic={topic}/>
          </dialog>
        </div>
        <div className="option" >
          <p className='options-title' onClick={() => {bookingRef.current?.showModal(); setTopic('bokning')}}>Hantera bokningar</p>
          <dialog className="dialog" ref={bookingRef}>
            <button className='close-ref-btn' onClick={() => {bookingRef.current?.close(); setOptionState('non')}}>X</button>
            <HandleBookings />
          </dialog>
        </div>
        <div className="option" >
          <p className='options-title' onClick={() => {membersRef.current?.showModal(); setTopic('medlem')}}>Hantera medlemmar</p>
          <dialog className="dialog" ref={membersRef}>
            <button className='close-ref-btn' onClick={() => {membersRef.current?.close(); setOptionState('non')}}>X</button>
            <HandleMembers optionState={optionState} setOptionState={setOptionState} topic={topic}/>
          </dialog>
        </div>
      </div>
    </div>
  )
}
