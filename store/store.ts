import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMoviesByTitle } from "../actions/getMoviesByTitle";
import { getMoviesByPopularity } from "../actions/getMoviesByPopularity";
import { Platform } from "react-native";

// Import TypeScript interfaces
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

// Platform-aware storage adapter
const createStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: async (name: string) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          }
          return null;
        } catch (error) {
          console.error("Failed to get item from localStorage:", error);
          return null;
        }
      },
      setItem: async (name: string, value: unknown) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(name, JSON.stringify(value));
          }
        } catch (error) {
          console.error("Failed to set item in localStorage:", error);
        }
      },
      removeItem: async (name: string) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(name);
          }
        } catch (error) {
          console.error("Failed to remove item from localStorage:", error);
        }
      }
    };
  } else {
    // Use AsyncStorage for native platforms
    return {
      getItem: async (name: string) => {
        try {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error("Failed to get item from AsyncStorage:", error);
          return null;
        }
      },
      setItem: async (name: string, value: unknown) => {
        try {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        } catch (error) {
          console.error("Failed to set item in AsyncStorage:", error);
        }
      },
      removeItem: async (name: string) => {
        try {
          await AsyncStorage.removeItem(name);
        } catch (error) {
          console.error("Failed to remove item from AsyncStorage:", error);
        }
      }
    };
  }
};

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      movies: [],
      page: 1,
      hasMore: true,
      loading: false,
      error: null,

      fetchMovies: async () => {
        const { loading, hasMore, page, movies, error } = get();

        if (loading || !hasMore || page > 500) return; // Prevent infinite loops

        set({ loading: true, error: null });

        try {
          const data = await getMoviesByPopularity(page);

          if (data && data.results) {
            set({
              movies: [...movies, ...data.results],
              page: page + 1,
              hasMore: page < (data.total_pages || 1000),
              error: null
            });
          } else {
            set({ error: "Invalid response from API", loading: false });
          }
        } catch (error) {
          console.error("Error in fetchMovies:", error);
          set({
            error: error instanceof Error ? error.message : "Failed to fetch movies",
            loading: false
          });
        }
      },

      reset: () => {
        set({
          movies: [],
          page: 1,
          hasMore: true,
          loading: false,
          error: null
        });
      }
    }),
    {
      name: "movie-store",
      storage: createStorage()
    }
  )
);

export const useMovieSearchStore = create<MovieSearchStore>((set, get) => ({
  searchedMovies: [],
  page: 1,
  hasMore: true,
  loadingSearchedMovies: false,
  query: "",
  searchError: null,

  fetchSearchedMovies: async (query: string) => {
    const {
      loadingSearchedMovies,
      hasMore,
      page,
      searchedMovies,
      searchError
    } = get();

    if (loadingSearchedMovies || !hasMore || page > 500 || !query.trim()) return; // Prevent infinite loops

    set({ loadingSearchedMovies: true, query, searchError: null });

    try {
      const data = await getMoviesByTitle(query, page);

      if (data && data.results) {
        set({
          searchedMovies: [...searchedMovies, ...data.results],
          page: page + 1,
          hasMore: page < (data.total_pages || 1000),
          searchError: null
        });
      } else {
        set({ searchError: "Invalid response from API", loadingSearchedMovies: false });
      }
    } catch (error) {
      console.error("Error in fetchSearchedMovies:", error);
      set({
        searchError: error instanceof Error ? error.message : "Failed to fetch searched movies",
        loadingSearchedMovies: false
      });
    }
  },

  reset: () => {
    set({
      searchedMovies: [],
      page: 1,
      hasMore: true,
      loadingSearchedMovies: false,
      query: "",
      searchError: null
    });
  }
}));
