import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetailsScreen = () => {
  const movie = useLocalSearchParams();
  const router = useRouter();

  const [cast, setCast] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    mediaDetails();
    console.log("MovieDetailsScreen rendered555", movie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mediaDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
      );
      setCast(response.data.cast);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

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
          className="absolute left-4 top-8 z-10 px-3 py-1 bg-black rounded-full opacity-60"
        >
          <Text className="text-lg text-white">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="px-8">
        <Text className="mt-6 text-3xl font-semibold dark:text-gray-50">
          {movie.title}
        </Text>
        <Text className="mt-2 text-gray-500 dark:text-gray-400">
          {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
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

        <View className="mt-4">
          <Text className="mb-2 text-2xl text-gray-500 dark:text-gray-400">
            Cast:
          </Text>
          <ScrollView className="space-x-2" horizontal>
            {cast.map((actor: any) => (
              <View key={actor.id} className="mr-4">
                <Image
                  source={{
                    uri: `https://www.themoviedb.org/t/p/w220_and_h330_face${actor.profile_path}`
                  }}
                  className="w-40 h-40 rounded-full"
                />
                <Text className="pt-1 text-lg text-gray-500 dark:text-gray-300">
                  {actor.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default MovieDetailsScreen;
