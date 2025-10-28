// src/pages/HomePage.jsx
import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

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

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Navbar />

      {/* 🔽 Add padding-top to prevent overlap with fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
        <SearchBar onSearch={(q) => dispatch(searchByTitle(q))} />

        {/* 🔥 Trending Section */}
        <section id="trending-section" className="mt-10">
          {list.length > 0 && <TrendingMovies movies={list} />}
        </section>

        {/* 🎬 Movies Section */}
        <section id="movies-section" className="mt-16">
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

          {status === "loading" ? (
            <p className="text-center mt-10 text-gray-400 text-lg animate-pulse">
              Loading movies...
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
              {filtered?.length > 0 ? (
                filtered.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
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
