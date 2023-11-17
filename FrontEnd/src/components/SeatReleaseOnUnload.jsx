/** @format */

import { useEffect } from "react";

function SeatReleaseOnUnload({ screeningId, selectedSeats }) {
  useEffect(() => {
    const handleUnload = async () => {
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

          if (!res.ok) {
            throw new Error("Error releasing seats");
          }

          const data = await res.json();

          if (data && data.success) {
            console.log("Selected seats released.");
          }
        } catch (error) {
          console.error("Error releasing seats:", error);
        }
      }
    };

    const beforeUnloadListener = (event) => {
      handleUnload();
      event.returnValue = "";
    };

    const unloadListener = () => {
      handleUnload();
    };

    window.addEventListener("beforeunload", beforeUnloadListener);
    window.addEventListener("unload", unloadListener);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
      window.removeEventListener("unload", unloadListener);
    };
  }, [screeningId, selectedSeats]);

  return null;
}

export default SeatReleaseOnUnload;
