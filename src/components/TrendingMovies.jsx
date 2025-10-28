// src/components/TrendingMovies.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrendingMovies = ({ movies }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!scrollRef.current || isPaused) return;

    const scroll = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 2; // smooth scroll speed
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 30);

    return () => clearInterval(scroll);
  }, [isPaused]);

  const handleClick = (movie) => {
    if (selected === movie.id) {
      navigate(`/movie/${movie.id}`); // navigate to movie details
    } else {
      setSelected(movie.id);
      setIsPaused(true);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-500">
        🔥 Trending Movies
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-ms-4 p-4"
      >
        {movies.slice(0, 10).map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`relative min-w-[200px] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 ${
              selected === movie.id ? "ring-4 ring-red-500" : ""
            }`}
          >
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="rounded-lg h-72 w-48 object-cover"
            />
            <div className="absolute bottom-0 bg-black/60 w-full text-center text-sm py-2">
              {movie.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
