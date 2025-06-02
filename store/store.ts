import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMoviesByTitle } from "../actions/getMoviesByTitle";
import { getMoviesByPopularity } from "../actions/getMoviesByPopularity";

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
      storage: {
        getItem: async (name) => {
          try {
            const item = await AsyncStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error("Failed to get item from AsyncStorage:", error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error("Failed to set item in AsyncStorage:", error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error("Failed to remove item from AsyncStorage:", error);
          }
        }
      }
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
