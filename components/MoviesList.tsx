import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useMovieStore, useMovieSearchStore } from "../store/store";
import ArrowUp from "../assets/icons/ArrowUp";
import MovieItem from "./MovieItem";

const MoviesList = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { movies, fetchMovies, loading, error } = useMovieStore();
  const { searchedMovies, loadingSearchedMovies, query, searchError } =
    useMovieSearchStore();
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (movies.length === 0) fetchMovies();
    console.log("MoviesList rendered", movies.length);
  }, []);

  const handleOnEndReached = () => {
    if (query.length) {
      useMovieSearchStore.getState().fetchSearchedMovies(query);
    } else {
      fetchMovies();
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
          className="absolute bottom-28 z-10 flex w-full flex-row items-center justify-center opacity-75"
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
        <FlatList
          ref={flatRef}
          className="space-x-1"
          data={query.length ? searchedMovies : movies}
          fadingEdgeLength={20}
          key={"movies-list"}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          onEndReached={handleOnEndReached}
          onEndReachedThreshold={0.15}
          renderItem={({ item }) => <MovieItem movie={item} />}
          onRefresh={() => {
            useMovieSearchStore.getState().reset();
            useMovieStore.getState().reset();
            fetchMovies();
          }}
          refreshing={loading || loadingSearchedMovies}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 70
          }}
          columnWrapperClassName="space-x-4"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

export default MoviesList;
