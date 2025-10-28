import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { fetchMovies, selectMovie } from "../features/movies/moviesSlice";

export default function MovieDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedMovie, list, status } = useSelector((state) => state.movies);

  useEffect(() => {
    const movieId = Number(id);
    if (list.length === 0) {
      dispatch(fetchMovies()).then(() => dispatch(selectMovie(movieId)));
    } else {
      dispatch(selectMovie(movieId));
    }
  }, [dispatch, id, list.length]);

  if (status === "loading" || !selectedMovie)
    return <p className="text-center text-white mt-20">Loading details...</p>;

  // Filter out current movie for recommendations
  const otherMovies = list.filter((m) => m.id !== selectedMovie.id);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      {/* Banner Section */}
      <div
        className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${selectedMovie.poster_path})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content on left */}
        <div className="relative z-10 max-w-3xl px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {selectedMovie.title}
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-6 line-clamp-3">
            {selectedMovie.overview}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition"
              onClick={() => alert("Play movie logic here")}
            >
              Play Now
            </button>
            <button
              className="bg-gray-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600 transition"
              onClick={() => alert("More info logic here")}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Other Movies Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-red-500 mb-6">More Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {otherMovies.map((movie) => (
            <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
