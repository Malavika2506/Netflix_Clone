import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/movies/moviesSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.movies.favorites);
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const [showHeart, setShowHeart] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out bg-gray-900"
    >
      <img
        src={movie.poster_path}
        alt={movie.title}
        className="w-full h-80 object-cover group-hover:opacity-75 transition duration-300"
      />

      <div className="absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent w-full p-3">
        <h3 className="text-sm md:text-base font-semibold truncate">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400">⭐ {movie.rating}</p>
      </div>

      {/* ❤️ Favorite button (hover only) */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 text-2xl transition-all duration-300 transform opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 ${
          isFavorite ? "text-red-500" : "text-white"
        } hover:scale-125`}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* 💖 Floating center heart */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl text-red-500 animate-ping">❤️</span>
        </div>
      )}
    </div>
  );
}
