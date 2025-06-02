import { TextInput } from 'react-native';
import { useRef } from 'react';
import { useMovieSearchStore } from '../store/store';
const Search = () => {
  const { fetchSearchedMovies } = useMovieSearchStore();
  const inputRef = useRef<TextInput>(null);

  const handleSearch = (query: string) => {
    useMovieSearchStore.getState().reset();
    fetchSearchedMovies(query);
    inputRef.current?.clear();
  };
  return (
    <TextInput
      ref={inputRef}
      className="flex-1 px-4 py-2 mr-6 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-800 dark:text-gray-200"
      placeholder="Search movies..."
      placeholderTextColor="#888"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
    />
  );
};

export default Search;
