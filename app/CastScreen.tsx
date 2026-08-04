import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPersonDetails } from "@/actions/getPersonDetails";

interface EdgePanEvent {
  x: number;
  translationX: number;
  translationY: number;
  velocityY: number;
}

const PLACEHOLDER_PROFILE =
  "https://via.placeholder.com/185x185?text=No+Image";
const PLACEHOLDER_POSTER =
  "https://via.placeholder.com/92x138?text=No+Poster";

const toMovieParams = (
  credit: PersonMovieCredit
): Record<string, string> => ({
  id: String(credit.id),
  adult: String(credit.adult),
  backdrop_path: credit.backdrop_path ?? "",
  genre_ids: JSON.stringify(credit.genre_ids ?? []),
  original_language: credit.original_language ?? "",
  original_title: credit.original_title ?? "",
  overview: credit.overview ?? "",
  popularity: String(credit.popularity ?? 0),
  poster_path: credit.poster_path ?? "",
  release_date: credit.release_date ?? "",
  title: credit.title ?? "",
  video: String(credit.video),
  vote_average: String(credit.vote_average ?? 0),
  vote_count: String(credit.vote_count ?? 0),
});

const dedupeAndSortCredits = (
  credits: PersonMovieCredit[]
): PersonMovieCredit[] => {
  const byId = new Map<number, PersonMovieCredit>();

  for (const credit of credits) {
    if (!credit?.id) continue;
    if (!byId.has(credit.id)) {
      byId.set(credit.id, credit);
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    const dateA = a.release_date || "";
    const dateB = b.release_date || "";
    return dateB.localeCompare(dateA);
  });
};

const CastScreen = () => {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    profile_path?: string;
  }>();
  const router = useRouter();

  const personId = Number(params.id);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

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
      if (event.translationX > 150 && Math.abs(event.velocityY) < 1000) {
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

  const loadPerson = useCallback(async () => {
    if (!Number.isFinite(personId) || personId <= 0) {
      setError("Invalid actor id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await getPersonDetails(personId);
      setPerson(details);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load actor details. Please try again.";
      setError(message);
      setPerson(null);
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    loadPerson();
  }, [loadPerson]);

  const filmography = useMemo(
    () => dedupeAndSortCredits(person?.movie_credits?.cast ?? []),
    [person]
  );

  const displayName = person?.name || params.name || "Actor";
  const profilePath = person?.profile_path || params.profile_path || null;
  const biography = person?.biography?.trim() ?? "";

  const handleMoviePress = useCallback(
    (credit: PersonMovieCredit) => {
      router.push({
        pathname: "/MovieDetailsScreen",
        params: toMovieParams(credit),
      });
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-200 dark:bg-gray-900">
      <Animated.View style={[styles.screen, animatedStyle]}>
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-3 py-1 bg-black rounded-full opacity-60 active:scale-95"
          >
            <Text className="text-lg text-white">Back</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-gray-600 dark:text-gray-400">
              Loading actor details...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-center text-red-500 mb-4">{error}</Text>
            <TouchableOpacity
              onPress={loadPerson}
              className="px-4 py-2 bg-blue-500 rounded-lg active:scale-95"
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
          >
            <View className="items-center px-8 mb-6">
              <Image
                source={
                  profilePath
                    ? `https://www.themoviedb.org/t/p/w185${profilePath}`
                    : PLACEHOLDER_PROFILE
                }
                style={styles.profileImage}
                contentFit="cover"
                placeholder={PLACEHOLDER_PROFILE}
                placeholderContentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={`person-${personId}`}
              />
              <Text className="text-3xl font-semibold dark:text-gray-50 mt-4 text-center">
                {displayName}
              </Text>
              {person?.known_for_department ? (
                <Text className="text-gray-500 dark:text-gray-400 mt-1">
                  {person.known_for_department}
                </Text>
              ) : null}
              {(person?.birthday || person?.place_of_birth) && (
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                  {[person.birthday, person.place_of_birth]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              )}
              {person?.deathday ? (
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Died {person.deathday}
                </Text>
              ) : null}
            </View>

            <View className="px-8 mb-6">
              <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
                Biography
              </Text>
              {biography.length > 0 ? (
                <>
                  <Text
                    numberOfLines={isBioExpanded ? undefined : 6}
                    className="text-gray-600 dark:text-gray-400 mb-2"
                  >
                    {biography}
                  </Text>
                  {biography.length > 220 ? (
                    <TouchableOpacity
                      onPress={() => setIsBioExpanded((prev) => !prev)}
                      className="active:scale-95"
                    >
                      <Text className="text-blue-500">
                        {isBioExpanded ? "Show Less" : "Read More"}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : (
                <Text className="text-gray-500 dark:text-gray-400">
                  No biography available.
                </Text>
              )}
            </View>

            <View className="px-8 mb-8">
              <Text className="text-2xl font-semibold dark:text-gray-50 mb-3">
                Movies ({filmography.length})
              </Text>
              {filmography.length === 0 ? (
                <Text className="text-gray-500 dark:text-gray-400">
                  No movie credits found.
                </Text>
              ) : (
                filmography.map((credit) => (
                  <TouchableOpacity
                    key={`${credit.id}-${credit.credit_id}`}
                    onPress={() => handleMoviePress(credit)}
                    className="flex-row mb-4 active:scale-95"
                  >
                    <Image
                      source={
                        credit.poster_path
                          ? `https://www.themoviedb.org/t/p/w92${credit.poster_path}`
                          : PLACEHOLDER_POSTER
                      }
                      style={styles.poster}
                      contentFit="cover"
                      placeholder={PLACEHOLDER_POSTER}
                      placeholderContentFit="cover"
                      cachePolicy="memory-disk"
                      recyclingKey={`credit-${credit.credit_id}`}
                    />
                    <View className="flex-1 ml-3 justify-center">
                      <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {credit.title || "Untitled"}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {credit.release_date
                          ? credit.release_date.slice(0, 4)
                          : "N/A"}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        as {credit.character || "Unknown"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        )}

        <GestureDetector gesture={panGesture}>
          <View style={styles.edgeStrip} collapsable={false} />
        </GestureDetector>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: 8,
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

export default CastScreen;
