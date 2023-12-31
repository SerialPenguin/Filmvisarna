/** @format */
import "../pages/Booking.css";

function TicketCounter({ label, quantity, onChange, type }) {
  return (
    <div className="ticket-counter-container" key={`ticket-${type}`}>
      <h4 className="ticket-counter-text">{label}</h4>

      <div className="plus-minus-container">
        <div
          className="ticket-counter-arrow-minus"
          onClick={() => onChange(type, -1)}>
          -
        </div>
        <div className="ticket-counter-value">{quantity}</div>
        <div
          className="ticket-counter-arrow-plus"
          onClick={() => onChange(type, 1)}>
          +
        </div>
      </div>
    </div>
  );
}

export default TicketCounter;
