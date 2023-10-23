export const reserveSeats = async (req, res) => {

  const reservedSeats = [];

  const seats = req.body.seats;
  console.log("Seats: ", seats);

  seats.map((seat) => reservedSeats.push(seat));

  console.log("ReservedSeats: ", reservedSeats);

  if(seats) res.status(200).json({ msg: "Reserved seats properly"});
};