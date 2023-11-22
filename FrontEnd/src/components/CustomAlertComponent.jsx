/** @format */

function CustomAlert({ message, onClose }) {
  return (
    <div id="customAlert">
      <p>{message}</p>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default CustomAlert;
