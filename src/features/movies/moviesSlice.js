import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🎬 Fetch movies from public/movies.json
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const res = await fetch("/moviesData.json");
  return await res.json();
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    list: [],          // All movies
    filtered: [],      // Filtered result
    favorites: [],     // Favorite movies
    selectedMovie: null,
    status: "idle",
    filters: {
      genre: "All",
      search: "",
    },
  },
  reducers: {
    // ❤️ Add a movie to favorites
    addFavorite: (state, action) => {
      const movie = action.payload;
      const exists = state.favorites.find((m) => m.id === movie.id);
      if (!exists) state.favorites.push(movie);
    },

    // 💔 Remove a movie from favorites
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((m) => m.id !== action.payload);
    },

    // 🔎 Search movies by title
    searchByTitle: (state, action) => {
      const term = action.payload.toLowerCase();
      state.filters.search = action.payload;
      state.filtered = state.list.filter((m) =>
        m.title.toLowerCase().includes(term)
      );
    },

    // 🎭 Filter movies by genre
    filterByGenre: (state, action) => {
      const genre = action.payload;
      state.filters.genre = genre;
      if (genre === "All") {
        state.filtered = state.list;
      } else {
        state.filtered = state.list.filter((m) => m.genre === genre);
      }
    },

    // 🎥 Select a specific movie for the detail page
    selectMovie: (state, action) => {
      const movieId = action.payload;
      state.selectedMovie = state.list.find((m) => m.id === movieId) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filtered = action.payload; // initial
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  addFavorite,
  removeFavorite,
  searchByTitle,
  filterByGenre,
  selectMovie,
} = moviesSlice.actions;

export default moviesSlice.reducer;
