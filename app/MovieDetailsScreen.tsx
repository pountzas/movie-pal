import { View, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
const MovieDetailsScreen = () => {
  const movie = useLocalSearchParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="h-full bg-gray-200 dark:bg-gray-900">
      <View className="relative w-full">
        <Image
          height={350}
          source={{
            uri: `https://www.themoviedb.org/t/p/w220_and_h330_face${movie.backdrop_path}`,
            method: "POST"
          }}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute z-10 px-3 py-1 bg-black rounded-full opacity-60 top-8 left-4"
        >
          <Text className="text-lg text-white">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="px-8 ">
        <Text className="mt-6 text-3xl font-semibold dark:text-gray-50">
          {movie.title}
        </Text>
        <Text
          numberOfLines={isExpanded ? undefined : 4}
          className="mt-2 text-gray-500 dark:text-gray-400"
        >
          {movie.overview}
        </Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="text-blue-500 mt-0.5">
            {isExpanded ? "Show Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetailsScreen;
