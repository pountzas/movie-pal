import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/person";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

const isPersonMovieCredit = (value: unknown): value is PersonMovieCredit => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.credit_id === "string" &&
    typeof value.character === "string"
  );
};

const isPersonCrewCredit = (value: unknown): value is PersonCrewCredit => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.credit_id === "string" &&
    typeof value.department === "string" &&
    typeof value.job === "string"
  );
};

const isPersonDetails = (value: unknown): value is PersonDetails => {
  if (!isRecord(value)) return false;

  const hasRequiredScalars =
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.biography === "string" &&
    typeof value.known_for_department === "string" &&
    typeof value.adult === "boolean" &&
    typeof value.gender === "number" &&
    typeof value.popularity === "number" &&
    Array.isArray(value.also_known_as) &&
    value.also_known_as.every((alias) => typeof alias === "string") &&
    isNullableString(value.birthday) &&
    isNullableString(value.deathday) &&
    isNullableString(value.homepage) &&
    isNullableString(value.imdb_id) &&
    isNullableString(value.place_of_birth) &&
    isNullableString(value.profile_path);

  if (!hasRequiredScalars) return false;

  if (value.movie_credits === undefined) return true;
  if (!isRecord(value.movie_credits)) return false;

  const { cast, crew } = value.movie_credits;
  if (!Array.isArray(cast) || !cast.every(isPersonMovieCredit)) return false;
  if (
    crew !== undefined &&
    (!Array.isArray(crew) || !crew.every(isPersonCrewCredit))
  ) {
    return false;
  }

  return true;
};

export const getPersonDetails = async (
  personId: number
): Promise<PersonDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}/${personId}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response: "movie_credits",
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching person details: ${response.statusText}`);
    }

    if (!isPersonDetails(response.data)) {
      throw new Error("Invalid person response structure");
    }

    if (!response.data.movie_credits) {
      return response.data;
    }

    return {
      ...response.data,
      movie_credits: {
        cast: response.data.movie_credits.cast,
        crew: response.data.movie_credits.crew ?? [],
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Error fetching")) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith("Invalid person")) {
      throw error;
    }
    throw new Error("Unable to load actor details. Please try again.");
  }
};
