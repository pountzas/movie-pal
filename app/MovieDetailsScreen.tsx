import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

interface MovieDetails {
  cast: CastMember[];
  crew: CrewMember[];
}

const MovieDetailsScreen = () => {
  const movie = useLocalSearchParams();
  const router = useRouter();

  const [movieDetails, setMovieDetails] = useState<MovieDetails>({ cast: [], crew: [] });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
      );

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.data?.cast || !response.data?.crew) {
        throw new Error("Invalid response structure");
      }

      setMovieDetails({
        cast: response.data.cast,
        crew: response.data.crew
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <ScrollView className="h-full bg-gray-200 dark:bg-gray-900">
      <View className="relative w-full">
        <Image
          height={350}
          source={{
            uri: `https://www.themoviedb.org/t/p/w500${movie.backdrop_path}`
          }}
          className="w-full"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 top-8 z-10 px-3 py-1 bg-black rounded-full opacity-60"
        >
          <Text className="text-lg text-white">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="px-8 py-4">
        <Text className="text-3xl font-semibold dark:text-gray-50 mb-2">
          {movie.title}
        </Text>

        <View className="flex flex-row items-center mb-4">
          <Text className="text-gray-500 dark:text-gray-400 mr-4">
            {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
          </Text>
          <View className="flex flex-row items-center">
            <Text className="text-yellow-500 mr-1">★</Text>
            <Text className="text-gray-700 dark:text-gray-300">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 ml-1">
              ({movie.vote_count || 0} votes)
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={isExpanded ? undefined : 4}
          className="text-gray-600 dark:text-gray-400 mb-2"
        >
          {movie.overview}
        </Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="text-blue-500 mb-4">
            {isExpanded ? "Show Less" : "Read More"}
          </Text>
        </TouchableOpacity>

        {/* Cast Section */}
        {movieDetails.cast.length > 0 && (
          <View className="mb-6">
            <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
              Cast
            </Text>
            <ScrollView className="space-x-2" horizontal showsHorizontalScrollIndicator={false}>
              {movieDetails.cast.slice(0, 10).map((actor: CastMember) => (
                <View key={actor.id} className="mr-4 w-32">
                  <Image
                    source={{
                      uri: actor.profile_path
                        ? `https://www.themoviedb.org/t/p/w185${actor.profile_path}`
                        : "https://via.placeholder.com/185x185?text=No+Image"
                    }}
                    className="w-32 h-32 rounded-lg mb-2"
                  />
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                    {actor.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {actor.character}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Crew Section */}
        {movieDetails.crew.length > 0 && (
          <View className="mb-6">
            <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
              Crew
            </Text>
            <View className="space-y-2">
              {movieDetails.crew.slice(0, 8).map((crewMember: CrewMember) => (
                <View key={crewMember.id} className="flex flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-gray-100 font-medium">
                      {crewMember.name}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {crewMember.job}
                    </Text>
                  </View>
                  {crewMember.profile_path && (
                    <Image
                      source={{
                        uri: `https://www.themoviedb.org/t/p/w45${crewMember.profile_path}`
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MovieDetailsScreen;
