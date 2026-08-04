import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
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

interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface EdgePanEvent {
  x: number;
  translationX: number;
  translationY: number;
  velocityY: number;
}

const MovieDetailsScreen = () => {
  const movie = useLocalSearchParams();
  const router = useRouter();

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [movieDetails, setMovieDetails] = useState<MovieCredits>({
    cast: [],
    crew: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const voteAverage = Number(movie.vote_average);

  const navigateBack = useCallback(() => {
    setTimeout(() => {
      router.back();
    }, 150);
  }, [router]);

  // Edge-strip only — does not wrap the screen, so ScrollViews keep their gestures
  const panGesture = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetY([-16, 16])
    .onUpdate((event: EdgePanEvent) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = Math.max(0, event.translationX);
        opacity.value = Math.max(0.3, 1 - Math.abs(event.translationX) / 200);
      }
    })
    .onEnd((event: EdgePanEvent) => {
      if (
        event.translationX > 150 &&
        Math.abs(event.velocityY) < 1000
      ) {
        translateX.value = withSpring(400);
        opacity.value = withSpring(0, {}, () => {
          scheduleOnRN(navigateBack);
        });
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
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
      setMovieDetails({
        cast: [],
        crew: [],
      });
    }
  };

  return (
    <Animated.View
      className="bg-gray-200 dark:bg-gray-900"
      style={[styles.screen, animatedStyle]}
    >
      {/* Fixed: backdrop + meta + overview */}
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

      <View className="px-8 pt-4">
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
              {Number.isFinite(voteAverage) && voteAverage > 0
                ? voteAverage.toFixed(1)
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
      </View>

      {/* Cast + crew: only this region scrolls vertically */}
      <ScrollView
        style={styles.creditsScroll}
        contentContainerStyle={styles.creditsContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {movieDetails.cast.length > 0 && (
          <View className="mb-6">
            <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
              Cast
            </Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castRow}
            >
              {movieDetails.cast
                .slice(0, 30)
                .map((actor: CastMember, index: number) =>
                  actor && actor.id ? (
                    <TouchableOpacity
                      key={`cast-${actor.id}-${index}`}
                      className="mr-9 w-32 items-center active:scale-95"
                      onPress={() => {
                        router.push({
                          pathname: "/CastScreen",
                          params: {
                            id: String(actor.id),
                            name: actor.name || "",
                            profile_path: actor.profile_path || "",
                          },
                        });
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
          </View>
        )}

        {movieDetails.crew && movieDetails.crew.length > 0 && (
          <View className="mb-6">
            <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
              Crew
            </Text>
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
          </View>
        )}
      </ScrollView>

      {/* Left-edge only: swipe-back without blocking scroll gestures */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.edgeStrip} collapsable={false} />
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  creditsScroll: {
    flex: 1,
    paddingHorizontal: 32,
  },
  creditsContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  castRow: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  edgeStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
    zIndex: 20,
  },
});

export default MovieDetailsScreen;
