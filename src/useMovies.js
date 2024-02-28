import { useState, useEffect } from "react";

const KEY = "9f39c433";

export function useMovies({query}) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        async function fetchMovies() {
          try {
            setIsLoading(true);
            setError("");
            const response = await fetch(
              `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
              { signal: controller.signal }
            );
    
            if (!response.ok) {
              throw new Error("Something went wrong with fetching movies");
            }
    
            const data = await response.json();
    
            if (data.Response === "False") {
              throw new Error("Movie Not Found!");
            }
    
            setMovies(data.Search);
            setError("");
          } catch (error) {
            if (error.name !== "AbortError") {
              console.log(error.message);
              setError(error.message);
            }
          } finally {
            setIsLoading(false);
          }
        }
    
        if (query.length < 1) {
          setMovies([]);
          setError("");
          return;
        }
    
        // handleCloseMovie();
        fetchMovies();
    
        return function () {
          controller.abort();
        };
      }, [query]);

      return {movies, isLoading, error}
}