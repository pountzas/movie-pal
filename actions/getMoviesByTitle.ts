import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

// test url https://api.themoviedb.org/3/search/movie?api_key=120f1a60fbfcc0d0f3e9775e7816cde3&append_to_response=videos,images

// const BASE_URL = 'https://api.themoviedb.org/3/search/movie?api_key=120f1a60fbfcc0d0f3e9775e7816cde3&query=${name}&append_to_response=videos,images';

export const getMoviesByTitle = async (title = 'matrix', page = 1) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    params: {
      language: 'en-US',
      page,
      query: title,
      include_adult: false,
      append_to_response: 'videos,images',
    },
    timeout: 30000
  });
  if (response.status !== 200) {
    throw new Error(`Error fetching movies: ${response.statusText}`);
  }
  if (!response.data || !response.data.results) {
    throw new Error('No results found');
  }
  if (response.data.results.length === 0) {
    throw new Error('No movies found for the given query');
  }
  if (response.data.total_pages < page) {
    throw new Error('No more pages available');
  }
  console.log('Fetched movies by name:', response.data.results);

  return response.data;
};
