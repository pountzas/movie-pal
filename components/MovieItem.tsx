import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

const MovieItem = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/MovieDetailsScreen",
      params: { ...(movie as any) }
    });
  };

  return (
    <View className="flex flex-col items-center">
      <TouchableOpacity
        onPress={handlePress}
        className="h-[265px] w-[150px] rounded"
      >
        <ImageBackground
          borderRadius={16}
          className="w-full h-full rounded"
          source={{
            uri: `https://www.themoviedb.org/t/p/w220_and_h330_face${movie.poster_path}`,
            method: "POST"
          }}
        >
          <View className="rounded-t-2xl bg-black/30">
            <View className="px-3 pt-3">
              <Text className="text-sm text-gray-200 truncate">
                {movie.title}
              </Text>
              <View className="flex flex-row justify-between items-center">
                <Text className="text-sm text-gray-300">
                  {movie.release_date.slice(0, 4)}
                </Text>
                <Text className="text-sm text-yellow-500">
                  {movie.vote_average.toString().slice(0, 3)}/10
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default MovieItem;
