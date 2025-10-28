import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { removeFavorite } from "../features/movies/moviesSlice";

export default function FavoritesPage() {
  const { favorites } = useSelector((state) => state.movies);
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">❤️ Favorites</h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            No favorite movies yet. Add some from Home!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
            {favorites.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => dispatch(removeFavorite(movie.id))}
                  className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
