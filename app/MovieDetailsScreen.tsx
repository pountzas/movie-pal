import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
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

  // Animation values for swipe gestures
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const shouldHandleGesture = useSharedValue(false);

  const [movieDetails, setMovieDetails] = useState<MovieDetails>({
    cast: [],
    crew: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCrew, setShowCrew] = useState(false);

  const navigateBack = useCallback(() => {
    setTimeout(() => {
      router.back();
    }, 150);
  }, [router]);

  // Simplified swipe gesture - only trigger navigation, don't interfere with scrolling
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      // Only allow navigation gestures that start from the very left edge
      // This prevents interfering with cast scrolling
      shouldHandleGesture.value = event.x < 50;
    })
    .onUpdate((event) => {
      if (!shouldHandleGesture.value) {
        return;
      }

      // Only respond to horizontal swipes from left edge
      if (
        Math.abs(event.translationX) > Math.abs(event.translationY) &&
        event.x < 50
      ) {
        translateX.value = event.translationX;
        opacity.value = Math.max(0.3, 1 - Math.abs(event.translationX) / 200);
      }
    })
    .onEnd((event) => {
      if (!shouldHandleGesture.value) {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
        return;
      }

      shouldHandleGesture.value = false;

      if (
        Math.abs(event.translationX) > 150 &&
        Math.abs(event.velocityY) < 1000 &&
        event.x < 50
      ) {
        if (event.translationX > 0) {
          translateX.value = withSpring(400);
          opacity.value = withSpring(0, {}, () => {
            scheduleOnRN(navigateBack);
          });
        } else {
          translateX.value = withSpring(0);
          opacity.value = withSpring(1);
        }
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    })
    .onFinalize(() => {
      shouldHandleGesture.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
        {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
          },
          timeout: 30000,
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.data) {
        throw new Error("Invalid response structure");
      }

      setMovieDetails({
        cast: response.data.cast || [],
        crew: response.data.crew || [],
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      // Set empty arrays on error to prevent crashes
      setMovieDetails({
        cast: [],
        crew: [],
      });
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.ScrollView
        className="h-full bg-gray-200 dark:bg-gray-900"
        style={animatedStyle}
      >
        <View className="relative w-full">
          <Image
            source={`https://www.themoviedb.org/t/p/w500${movie.backdrop_path}`}
            style={{ width: "100%", height: 350 }}
            contentFit="cover"
            placeholder="https://via.placeholder.com/500x350?text=Loading..."
            placeholderContentFit="cover"
            cachePolicy="memory-disk"
            allowDownscaling={true}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 top-8 z-10 px-3 py-1 bg-black rounded-full opacity-60"
          >
            <Text className="text-lg text-white">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="px-8 py-4">
          <Text className="text-3xl font-semibold dark:text-gray-50 mb-2 animate-fade-in">
            {movie.title}
          </Text>

          <View className="flex flex-row items-center mb-4">
            <Text className="text-gray-500 dark:text-gray-400 mr-4">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-gray-700 dark:text-gray-300">
                {movie.vote_average &&
                typeof movie.vote_average === "number" &&
                movie.vote_average > 0
                  ? (movie.vote_average as number).toFixed(1)
                  : "N/A"}
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
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            className="mb-4 active:scale-95"
          >
            <Text className="text-blue-500">
              {isExpanded ? "Show Less" : "Read More"}
            </Text>
          </TouchableOpacity>

          {/* Cast Section */}
          {movieDetails.cast.length > 0 && (
            <View className="mb-6">
              <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
                Cast
              </Text>
              <GestureDetector gesture={Gesture.Native()}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="pl-4"
                >
                  {movieDetails.cast
                    .slice(0, 30)
                    .map((actor: CastMember, index: number) =>
                      actor && actor.id ? (
                        <TouchableOpacity
                          key={`cast-${actor.id}-${index}`}
                          className="mr-9 w-32 items-center active:scale-95"
                          onPress={() => {
                            // Optional: Add press animation or navigation
                          }}
                        >
                          <Image
                            source={
                              actor.profile_path
                                ? `https://www.themoviedb.org/t/p/w185${actor.profile_path}`
                                : "https://via.placeholder.com/185x185?text=No+Image"
                            }
                            style={{
                              width: 128,
                              height: 128,
                              borderRadius: 100,
                            }}
                            contentFit="cover"
                            placeholder="https://via.placeholder.com/128x128?text=Loading..."
                            placeholderContentFit="cover"
                            cachePolicy="memory-disk"
                            recyclingKey={`cast-${actor.id}`}
                          />
                          <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center leading-tight">
                            {actor.name || "Unknown"}
                          </Text>
                          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                            {actor.character || "Unknown"}
                          </Text>
                        </TouchableOpacity>
                      ) : null
                    )}
                </ScrollView>
              </GestureDetector>
            </View>
          )}

          {/* Crew Section */}
          {movieDetails.crew && movieDetails.crew.length > 0 && (
            <View className="mb-6">
              <View className="flex flex-row justify-between items-center mb-3">
                <Text className="text-2xl font-semibold dark:text-gray-50">
                  Crew
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCrew(!showCrew)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full active:scale-95"
                >
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    {showCrew ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              {showCrew && (
                <View className="space-y-2">
                  {movieDetails.crew
                    .slice(0, 8)
                    .map((crewMember: CrewMember, index: number) =>
                      crewMember && crewMember.id ? (
                        <View
                          key={`crew-${crewMember.id}-${index}`}
                          className="flex flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                        >
                          <View className="flex-1">
                            <Text className="text-gray-900 dark:text-gray-100 font-medium">
                              {crewMember.name || "Unknown"}
                            </Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                              {crewMember.job || "Unknown"}
                            </Text>
                          </View>
                          {crewMember.profile_path && (
                            <Image
                              source={`https://www.themoviedb.org/t/p/w45${crewMember.profile_path}`}
                              style={{ width: 48, height: 48 }}
                              className="rounded-full"
                              contentFit="cover"
                              placeholder="https://via.placeholder.com/48x48?text=..."
                              placeholderContentFit="cover"
                              cachePolicy="memory-disk"
                              recyclingKey={`crew-${crewMember.id}`}
                            />
                          )}
                        </View>
                      ) : null
                    )}
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </GestureDetector>
  );
};

export default MovieDetailsScreen;
