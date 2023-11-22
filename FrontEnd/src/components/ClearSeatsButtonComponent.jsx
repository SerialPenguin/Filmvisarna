/** @format */
export default function ClearSeatsButton({
  screeningId,
  setSeats,
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
          // seats: [], // Empty array to show removal
          selectedSeatsId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error clearing selected seats");
      }

      setSeats([]);
      setSelectedSeats([]);
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
