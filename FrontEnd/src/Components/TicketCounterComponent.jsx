/** @format */

function TicketCounter({ label, quantity, onChange, type }) {
  return (
    <div className="ticket-counter-container" key={`ticket-${type}`}>
      <h4>{label}</h4>
      <div className="ticket-counter-arrow" onClick={() => onChange(type, -1)}>
        -
      </div>
      <div className="ticket-counter-value">{quantity}</div>
      <div className="ticket-counter-arrow" onClick={() => onChange(type, 1)}>
        +
      </div>
    </div>
  );
}

export default TicketCounter;
