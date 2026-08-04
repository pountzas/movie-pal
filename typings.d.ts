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

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

interface PersonMovieCredit extends Movie {
  character: string;
  credit_id: string;
  order?: number;
}

interface PersonCrewCredit extends Movie {
  credit_id: string;
  department: string;
  job: string;
}

interface PersonMovieCredits {
  cast: PersonMovieCredit[];
  crew: PersonCrewCredit[];
}

interface PersonDetails {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  movie_credits?: PersonMovieCredits;
}

interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface EdgePanEvent {
  x: number;
  translationX: number;
  translationY: number;
  velocityY: number;
}

interface MovieStore {
  movies: Movie[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchMovies: () => Promise<void>;
  reset: () => void;
}

interface MovieSearchStore {
  searchedMovies: Movie[];
  page: number;
  hasMore: boolean;
  loadingSearchedMovies: boolean;
  query: string;
  searchError: string | null;
  fetchSearchedMovies: (query: string) => Promise<void>;
  reset: () => void;
}
