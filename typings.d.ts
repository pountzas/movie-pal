interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieStore {
  movies: Movie[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  fetchMovies: () => Promise<void>;
  reset: () => void;
}

interface MovieSearchStore {
  searchedMovies: Movie[];
  page: number;
  hasMore: boolean;
  loadingSearchedMovies: boolean;
  query: string;
  fetchSearchedMovies: (query: string) => Promise<void>;
  reset: () => void;
}
