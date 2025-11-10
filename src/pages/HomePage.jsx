// src/pages/HomePage.jsx
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  searchByTitle,
  filterByGenre,
} from "../features/movies/moviesSlice";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import TrendingMovies from "../components/TrendingMovies";

export default function HomePage() {
  const dispatch = useDispatch();
  const { list, filtered, status } = useSelector((state) => state.movies);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ref to the selected-movie section at top
  const selectedRef = useRef(null);

  // Fetch movies once
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Scroll to section if passed from Navbar
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [location]);

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(searchByTitle(query));
  };

  const isSearching = searchQuery.trim().length > 0;

  // When selectedMovie changes, scroll the selectedRef into view
  useEffect(() => {
    if (!selectedMovie) return;

    // allow DOM to update, then scroll the element into view
    // requestAnimationFrame is more reliable than raw setTimeout in many cases
    const raf = requestAnimationFrame(() => {
      if (selectedRef.current) {
        selectedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // fallback: scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [selectedMovie]);

  // Double click handler
  const handleMovieDoubleClick = (movie) => {
    // If clicking same movie repeatedly we still want to re-trigger scroll.
    // Clear and set so the effect runs every time.
    setSelectedMovie(null);
    // small delay to ensure the DOM "removes" previous content before re-adding
    setTimeout(() => setSelectedMovie(movie), 50);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
        <SearchBar onSearch={handleSearch} />

        {/* Selected movie detail section (has ref so we can scrollIntoView) */}
        {selectedMovie && (
          <div
            ref={selectedRef}
            id="selected-movie-section"
            className="mt-10 mb-10 bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-500 animate-fadeIn"
          >
            <img
              src={selectedMovie.poster || selectedMovie.poster_path || selectedMovie.image}
              alt={selectedMovie.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-5">
              <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
              <p className="text-gray-400 mb-2">{selectedMovie.genre}</p>
              <p className="text-gray-300 text-sm">
                {selectedMovie.description || selectedMovie.overview || selectedMovie.plot}
              </p>
            </div>
          </div>
        )}

        {/* Trending only if not searching */}
        {!isSearching && list.length > 0 && (
          <section id="trending-section" className="mt-10">
            <TrendingMovies movies={list} />
          </section>
        )}

        {/* Movies Section */}
        <section id="movies-section" className="mt-10">
          {!isSearching && (
            <div className="flex justify-center mt-4">
              <select
                onChange={(e) => dispatch(filterByGenre(e.target.value))}
                className="bg-gray-800 text-white rounded-md px-4 py-2 w-full sm:w-auto"
              >
                <option value="All">All Genres</option>
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Adventure">Adventure</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
          )}

          {status === "loading" ? (
            <p className="text-center mt-10 text-gray-400 text-lg animate-pulse">
              Loading movies...
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
              {filtered?.length > 0 ? (
                filtered.map((movie) => (
                  <div
                    key={movie.id}
                    onDoubleClick={() => handleMovieDoubleClick(movie)}
                    className="cursor-pointer"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400 mt-10">
                  No movies found.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
