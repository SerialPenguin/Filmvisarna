/** @format */
export default function ClearSeatsButton({
  screeningId,
  setSeats,
  setTickets,
  setSelectedSeats,
  selectedSeatsId,
}) {
  const handleClearSelectedSeats = async () => {
    try {
      // Clear all selected seats in the backend by sending an empty array
      const res = await fetch(`/api/deleteSeats`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: [],
          selectedSeatsId, // Empty array to show removal
        }),
      });

      if (!res.ok) {
        throw new Error("Error clearing selected seats");
      }

      setSeats([]);
      setSelectedSeats([]);

      setTickets((prev) => ({
        adults: { ...prev.adults, quantity: 0 },
        seniors: { ...prev.seniors, quantity: 0 },
        children: { ...prev.children, quantity: 0 },
      }));
    } catch (error) {
      console.error("Error clearing selected seats:", error);
    }
  };

  return (
    <button className="clear-button" onClick={handleClearSelectedSeats}>
      Rensa Valda Säten
    </button>
  );
}
