import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Movie } from "../typings";

const MovieItem = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/MovieDetailsScreen",
      params: { ...movie }
    });
  };

  return (
    <View className="flex flex-col items-center">
      <TouchableOpacity
        onPress={handlePress}
        className="h-[275px] w-[150px] rounded"
      >
        <ImageBackground
          borderRadius={16}
          className="w-full h-full rounded"
          source={{
            uri: `https://www.themoviedb.org/t/p/w220_and_h330_face${movie.poster_path}`,
            method: "POST"
          }}
        ></ImageBackground>
        <View className="pt-1">
          <Text className="text-sm text-gray-800 truncate dark:text-gray-400">
            {movie.title}
          </Text>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              {movie.release_date.slice(0, 4)}
            </Text>
            <Text className="text-sm text-yellow-700 dark:text-yellow-500">
              {movie.vote_average.toString().slice(0, 3)}/10
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MovieItem;
