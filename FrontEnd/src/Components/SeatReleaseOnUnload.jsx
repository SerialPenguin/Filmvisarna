/** @format */

import { useEffect, useCallback } from "react";

function SeatReleaseOnUnload({ screeningId, selectedSeats }) {
  const releaseSeatsOnUnload = useCallback(async () => {
    if (selectedSeats.length > 0) {
      try {
        const res = await fetch(`/api/reserveSeats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            screeningId,
            seats: [], // Empty array to show removal
          }),
        });

        if (!res.ok) throw new Error("Error releasing seats");
        const data = await res.json();

        if (data && data.success) {
          console.log("Selected seats released.");
        }
      } catch (error) {
        console.error("Error releasing seats:", error);
      }
    }
  }, [screeningId, selectedSeats]);

  useEffect(() => {
    // Add an event listener to trigger the seat release when the page unloads
    window.addEventListener("beforeunload", releaseSeatsOnUnload);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("beforeunload", releaseSeatsOnUnload);
    };
  }, [releaseSeatsOnUnload]);

  return null; // This component doesn't render anything to the DOM
}

export default SeatReleaseOnUnload;
