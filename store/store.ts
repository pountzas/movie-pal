import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMoviesByTitle } from "../actions/getMoviesByTitle";
import { getMoviesByPopularity } from "../actions/getMoviesByPopularity";
import { Platform } from "react-native";

// Platform-aware storage adapter
const createStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: async (name: string) => {
        try {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error("Failed to get item from localStorage:", error);
          return null;
        }
      },
      setItem: async (name: string, value: string) => {
        try {
          localStorage.setItem(name, JSON.stringify(value));
        } catch (error) {
          console.error("Failed to set item in localStorage:", error);
        }
      },
      removeItem: async (name: string) => {
        try {
          localStorage.removeItem(name);
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
      setItem: async (name: string, value: string) => {
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

        if (loading || !hasMore) return;

        set({ loading: true });

        try {
          const data = await getMoviesByPopularity(page);

          set({
            movies: [...movies, ...data.results],
            page: page + 1,
            hasMore: page < data.total_pages,
            error: null
          });
        } catch (error) {
          set({ error: "Failed to fetch movies" });
        } finally {
          set({ loading: false });
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

    if (loadingSearchedMovies || !hasMore) return;

    set({ loadingSearchedMovies: true, query });

    try {
      const data = await getMoviesByTitle(query, page);

      set({
        searchedMovies: [...searchedMovies, ...data.results],
        page: page + 1,
        hasMore: page < data.total_pages,
        searchError: null
      });
    } catch (error) {
      set({
        searchError: "Failed to fetch searched movies"
      });
    } finally {
      set({ loadingSearchedMovies: false });
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
