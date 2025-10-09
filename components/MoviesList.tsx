import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { useMovieStore, useMovieSearchStore } from "../store/store";
import ArrowUp from "../assets/icons/ArrowUp";
import MovieItem, { MovieItemSkeleton } from "./MovieItem";

const MoviesList = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { movies, fetchMovies, loading, error } = useMovieStore();
  const { searchedMovies, loadingSearchedMovies, query, searchError } =
    useMovieSearchStore();
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (movies.length === 0 && !loading) {
      fetchMovies();
    }
    console.log("MoviesList rendered", movies.length);
  }, []);

  const handleOnEndReached = async () => {
    // Prevent multiple rapid calls
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      // Get fresh state to avoid stale loading values
      const { hasMore: searchHasMore, loadingSearchedMovies } = useMovieSearchStore.getState();
      const { hasMore: moviesHasMore, loading } = useMovieStore.getState();

      console.log("End reached - Query:", query.length, "Search hasMore:", searchHasMore, "Movies hasMore:", moviesHasMore, "loading:", loading);

      if (query.length) {
        // Check if search has more items and is not already loading
        if (searchHasMore && !loadingSearchedMovies) {
          console.log("Fetching more search results for:", query);
          await useMovieSearchStore.getState().fetchSearchedMovies(query);
        }
      } else {
        // Check if movies have more items and are not already loading
        if (moviesHasMore && !loading) {
          console.log("Fetching more movies");
          await fetchMovies();
        }
      }
    } catch (error) {
      console.error("Error in handleOnEndReached:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    setIsRefreshing(true);
    try {
      // Reset both stores first
      useMovieSearchStore.getState().reset();
      useMovieStore.getState().reset();

      // Small delay to ensure stores are reset
      await new Promise(resolve => setTimeout(resolve, 100));

      // Fetch fresh data
      await fetchMovies();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 170);
  };

  return (
    <View className="relative">
      {isScrolled && (
        <TouchableOpacity
          onPress={() => {
            if (flatRef.current) {
              flatRef.current.scrollToOffset({ animated: true, offset: 0 });
            }
          }}
          className="flex absolute bottom-28 z-10 flex-row justify-center items-center w-full opacity-75"
        >
          <ArrowUp outerFill="gray" innerFill="black" />
        </TouchableOpacity>
      )}
      {error && (
        <View className="px-6">
          <Text className="text-lg text-gray-800 dark:text-gray-400">
            Error: {error}
          </Text>
        </View>
      )}
      {searchError && (
        <View className="px-6">
          <Text className="text-lg text-gray-800 dark:text-gray-400">
            Search Error:{searchError}
          </Text>
        </View>
      )}
      {!error && (
        <>
          {/* Show loading skeletons when initially loading */}
          {(movies.length === 0 && loading) || (query.length > 0 && searchedMovies.length === 0 && loadingSearchedMovies) ? (
            <View className="px-5">
              <View className="flex flex-row justify-between mb-8">
                <MovieItemSkeleton />
                <MovieItemSkeleton />
              </View>
              <View className="flex flex-row justify-between mb-8">
                <MovieItemSkeleton />
                <MovieItemSkeleton />
              </View>
              <View className="flex flex-row justify-between mb-8">
                <MovieItemSkeleton />
                <MovieItemSkeleton />
              </View>
            </View>
          ) : (
            <FlatList
              ref={flatRef}
              className="space-x-1"
              data={query.length ? searchedMovies : movies}
              fadingEdgeLength={20}
              key={"movies-list"}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              onEndReached={handleOnEndReached}
              onEndReachedThreshold={0.5} // Reset to default for better reliability
              renderItem={({ item }) => <MovieItem movie={item} />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={["#007AFF"]} // Blue color for iOS
                  tintColor="#007AFF" // Blue color for Android
                  title="Pull to refresh" // Optional title for iOS
                  titleColor="#007AFF"
                />
              }
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 70
              }}
              columnWrapperClassName="space-x-4"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}
              bounces={true}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={100}
              initialNumToRender={8}
              // Remove getItemLayout as it might cause issues with dynamic content
            />
          )}
        </>
      )}
    </View>
  );
};

export default MoviesList;
