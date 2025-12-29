import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/discover/movie";

export const getMoviesByPopularity = async (page = 1) => {
  const response = await axios.get(BASE_URL, {
    params: {
      api_key: API_KEY,
      language: "en-US",
      page,
      include_adult: false,
      append_to_response: "videos,images",
      sort_by: "popularity.desc",
    },
    timeout: 30000,
  });
  if (response.status !== 200) {
    throw new Error(`Error fetching movies: ${response.statusText}`);
  }
  if (!response.data || !response.data.results) {
    throw new Error("No results found");
  }
  if (response.data.results.length === 0) {
    throw new Error("No movies found for the given query");
  }
  if (response.data.total_pages < page) {
    throw new Error("No more pages available");
  }
  return response.data;
};
