/** @format */
import "../pages/Booking.css";
import PropTypes from "prop-types";

function SeatsGrid({
  salonLayout,
  isSeatBooked,
  handleSeatClick,
  selectedSeats,
}) {
  return (
    <div className="seats-grid">
      {salonLayout?.rows?.map((row) => (
        <div key={row.rowNumber} className="row">
          {row.seats?.map((seatNumber) => (
            <button
              key={seatNumber}
              className={`${isSeatBooked(seatNumber) ? "" : "available"} ${
                selectedSeats.includes(seatNumber) ? "temporary-selected" : ""
              } ${
                isSeatBooked(seatNumber) & !selectedSeats.includes(seatNumber)
                  ? "booked"
                  : ""
              } `}
              onClick={() => handleSeatClick(row.rowNumber, seatNumber)}>
              {seatNumber}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

SeatsGrid.propTypes = {
  salonLayout: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        rowNumber: PropTypes.number.isRequired,
        seats: PropTypes.arrayOf(PropTypes.number).isRequired,
      })
    ),
  }),
  isSeatBooked: PropTypes.func.isRequired,
  handleSeatClick: PropTypes.func.isRequired,
};

export default SeatsGrid;
