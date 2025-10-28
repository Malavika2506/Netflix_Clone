import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch movies from local JSON
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const response = await fetch("/moviesData.json");
  const data = await response.json();
  return data;
});


