import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

// Movie interface
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
        <Image
          source={`https://www.themoviedb.org/t/p/w220_and_h330_face${movie.poster_path}`}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          contentFit="cover"
          placeholder="https://via.placeholder.com/150x265?text=Loading..."
          placeholderContentFit="cover"
          cachePolicy="memory-disk"
          allowDownscaling={true}
          recyclingKey={movie.id.toString()}
        />
        <View className="absolute top-0 left-0 right-0 rounded-t-2xl bg-black/30">
          <View className="px-3 pt-3">
            <Text className="text-sm text-gray-200 truncate">
              {movie.title}
            </Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm text-gray-300">
                {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
              </Text>
              <Text className="text-sm text-yellow-500">
                {movie.vote_average
                  ? movie.vote_average.toString().slice(0, 3)
                  : "N/A"}
                /10
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Loading skeleton component for movie items
export const MovieItemSkeleton = () => {
  return (
    <View className="flex flex-col items-center">
      <View className="h-[265px] w-[150px] rounded bg-gray-300 dark:bg-gray-700 animate-pulse">
        <View className="w-full h-full rounded bg-gray-200 dark:bg-gray-600" />
      </View>
      <View className="absolute top-0 left-0 right-0 rounded-t-2xl bg-black/20">
        <View className="px-3 pt-3">
          <View className="h-4 bg-gray-400/50 rounded mb-2 animate-pulse" />
          <View className="flex flex-row justify-between items-center">
            <View className="h-3 bg-gray-400/50 rounded w-12 animate-pulse" />
            <View className="h-3 bg-gray-400/50 rounded w-10 animate-pulse" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovieItem;
