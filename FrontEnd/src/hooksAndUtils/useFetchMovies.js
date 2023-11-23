import { useEffect, useState } from "react";


export default function useFetchMovies() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
          try {
            const response = await fetch("/api/movies");
            if (!response.ok) throw new Error("Failed to fetch movies");
            const data = await response.json();
            setMovies(data);
          } catch (error) {
            console.error("Error fetching movies:", error);
          }
        };
        fetchMovies();
      }, []);
      return movies;
} 